import logging
from json import loads
from time import sleep

import cv2
import requests
from google.cloud import vision
from google.cloud.vision import types
from gpiozero import LED

from garbage_detector import BASE_PATH
from garbage_detector import config
from garbage_detector.utils.gcp import GCP


class GarbageClassifier:
    def __init__(self):
        self.gcp = GCP()

        with open(f'{BASE_PATH}/resources/gcp_objects/class-descriptions.json') as f:
            self.labels = loads(f.read())

        self.vision = vision.ImageAnnotatorClient()

        self.led_mapping = dict(
            paper=config.leds.blue,
            glass=config.leds.green,
            plastic=config.leds.yellow,
            rest=config.leds.red,
        )

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

    def _prepare_image_for_model(self, image):
        resize_to = (2400, 1800)

        image = cv2.resize(image, resize_to)

        return image

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
