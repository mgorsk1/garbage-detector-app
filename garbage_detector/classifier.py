import json
import logging
from abc import ABC
from abc import abstractmethod
from json import loads
from time import sleep

import cv2
import googleapiclient.discovery
import numpy as np
import requests
import tensorflow as tf
from google.cloud import vision
from google.cloud.vision import types
from google.oauth2 import service_account
from gpiozero import LED

from garbage_detector import BASE_PATH
from garbage_detector import config
from garbage_detector.utils.gcp import GCP


class GarbageClassifier(ABC):
    def __init__(self):
        self.classes = ['metal', 'paper', 'glass', 'plastic', 'cardboard']

        self.led_mapping = dict(
            paper=config.leds.green,
            glass=config.leds.yellow,
            plastic=config.leds.blue,
            trash=config.leds.red,
        )

        self.categories_map = dict(
            paper='paper',
            plastic='plastic',
            glass='glass',
            cardboard='paper',
        )

    @abstractmethod
    def _prepare_image_for_model(self, image):
        pass

    @abstractmethod
    def _classify(self, image):
        pass

    def _upload_image_to_gcp(self, image, classification):
        photo_url = self.gcp.upload_image(image, classification)

        logging.info(f'Image uploaded to GCP as: {photo_url}')

        return photo_url

    def _notify_backend(self, category):
        json_payload = {'category': category}

        logging.info(f'Sending payload to backend: {json_payload}')

        scheme = config.backend.scheme
        host = config.backend.host
        port = config.backend.port

        r = requests.post(f'{scheme}://{host}:{port}/collections', json=json_payload)

        logging.info(f'Backend notified with response: {r}')
        return r

    def _turn_on_led(self, classification):
        led = LED(self.led_mapping.get(classification))

        led.on()
        sleep(3)
        led.off()

    def classify(self, image):
        """
        Classifies an image and notifies the backend of this. Process:
            1. Call GCP to classify the image
            2. Upload the image to GCP Bucket
            3. Notifying the backend
        :param image: Image opened with OpenCV (cv2)
        :return:
        """
        logging.info('Starting classify process')

        image = self._prepare_image_for_model(image)

        classification = self._classify(image)

        self._upload_image_to_gcp(image, classification)

        return classification

    def notify(self, classification):
        self._notify_backend(classification)
        self._turn_on_led(classification)


class TensorflowServingGarbageClassifier(GarbageClassifier):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.gcp = GCP()

    def _prepare_image_for_model(self, image):
        resize_to = (800, 600)
        crop_to = (250, 250)

        up, down = int((resize_to[1] / 2) - (crop_to[1] / 2)), int((resize_to[1] / 2) + (crop_to[1] / 2))
        left, right = int((resize_to[0] / 2) - (crop_to[0] / 2)), int((resize_to[0] / 2) + (crop_to[0] / 2))

        image = cv2.resize(image, (800, 600))

        result = image[up:down, left:right]
        result = cv2.resize(result, (224, 224))

        result = tf.keras.applications.resnet50.preprocess_input(result)

        return result

    def _classify(self, image):
        image = np.ascontiguousarray(image)

        request = requests.post(
            'http://192.168.0.17:8500/v1/models/gd:predict',
            data=json.dumps(dict(instances=[image.tolist()])),
        )

        logging.info(f'Received response: {request.__dict__}')

        predictions = json.loads(request.content)['predictions'][0]
        result = self.classes[predictions.index(max(predictions))]

        logging.info(f'Image classified as: {result}')

        result = self.categories_map.get(result, 'trash')

        logging.info(f'Image mapped as: {result}')
        return result


class GoogleCloudAIGarbageClassifier(GarbageClassifier):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.gcp = GCP()

        sa_file = f'{BASE_PATH}/resources/keys/ai.json'
        credentials = service_account.Credentials.from_service_account_file(sa_file)

        self.ai = googleapiclient.discovery.build('ml', 'v1', credentials=credentials)

    def _prepare_image_for_model(self, image):
        resize_to = (800, 600)
        crop_to = (250, 250)

        up, down = int((resize_to[1] / 2) - (crop_to[1] / 2)), int((resize_to[1] / 2) + (crop_to[1] / 2))
        left, right = int((resize_to[0] / 2) - (crop_to[0] / 2)), int((resize_to[0] / 2) + (crop_to[0] / 2))

        image = cv2.resize(image, (800, 600))

        result = image[up:down, left:right]
        result = cv2.resize(result, (128, 128))

        return result

    def _classify(self, image):
        image = image.tolist()

        name = f'projects/{config.gcp.project.name}/models/{config.gcp.model.name}'

        response = self.ai.projects().predict(
            name=name,
            body={'instances': [image]},
        ).execute()

        logging.info(f'Received response {response}')

        predictions = list(response.get('predictions')[0])

        if 'error' in response:
            raise RuntimeError(response['error'])

        result = self.classes[predictions.index(max(predictions))]

        logging.info(f'Image classified as: {result}')

        result = self.categories_map.get(result, 'trash')

        logging.info(f'Image mapped as: {result}')

        return result


class GoogleCloudVisionGarbageClassifier(GarbageClassifier):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        with open(f'{BASE_PATH}/resources/gcp_objects/class-descriptions.json') as f:
            self.labels = loads(f.read())

        self.vision = vision.ImageAnnotatorClient()

    def _prepare_image_for_model(self, image):
        resize_to = (2400, 1800)

        image = cv2.resize(image, resize_to)

        return image

    def _classify(self, image):
        frame_bytes = cv2.imencode('.jpg', image)[1].tostring()

        image = types.Image(content=frame_bytes)

        response = self.vision.label_detection(image=image)
        annotations = {l.description: round(l.score * 100, 2) for l in response.label_annotations}

        logging.info(f'Received annotations {annotations}')

        result = self._get_best_pick(annotations)

        if result is not None:
            description, category, confidence = [result.get(x) for x in ['description', 'category', 'confidence']]

            if confidence >= config.gcp.vision.classification.threshold:
                return category

                logging.info(f'Image classified as: {category}')

        return 'rest'

    def _get_best_pick(self, values):
        import operator

        values_sorted = sorted(values.items(), key=operator.itemgetter(1), reverse=True)

        for description, score in values_sorted:
            category = self.labels.get(description)

            if category:
                result = dict(description=description, category=category, confidence=score)

                logging.info(f'Found best pick: {result}')

                return result

        return None


def get_classifier_class(class_name):
    if class_name == 'TensorflowServingGarbageClassifier':
        return TensorflowServingGarbageClassifier
    elif class_name == 'GoogleCloudAIGarbageClassifier':
        return GoogleCloudAIGarbageClassifier
    elif class_name == 'GoogleCloudVisionGarbageClassifier':
        return GoogleCloudVisionGarbageClassifier
    else:
        raise NotImplementedError(f'Provided class name does not exist: {class_name}')
