import logging
from json import loads

import cv2
import requests
from google.cloud import vision
from google.cloud.vision import types

from garbage_detector import BASE_PATH
from garbage_detector import config
from garbage_detector.utils.gcp import GCP


class GarbageClassifier:
    def __init__(self):
        self.gcp = GCP()

        with open(f'{BASE_PATH}/resources/gcp_objects/class-descriptions.json') as f:
            self.labels = loads(f.read())

        self.vision = vision.ImageAnnotatorClient()

    def _classify(self, image):
        frame_bytes = cv2.imencode('.jpg', image)[1].tostring()

        image = types.Image(content=frame_bytes)

        response = self.vision.label_detection(image=image)
        annotations = {l.description: round(l.score * 100, 2) for l in response.label_annotations}

        logging.info(f'Received annotations {annotations}')

        result = self._get_best_pick(annotations)

        if result is not None:
            description, category, confidence = [result.get(x) for x in ['description', 'category', 'confidence']]

            if confidence >= 70:
                return category

                logging.info(f'Image classified as: {category}')
        else:
            return None

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

    def _notify_backend(self, user, category, image):
        json_payload = {'user': user, 'class': category, 'image': image}

        logging.info(f'Sending payload to backend: {json_payload}')

        scheme = config.backend.scheme
        host = config.backend.host
        port = config.backend.port

        r = requests.post(f'{scheme}://{host}:{port}/collections', json=json_payload)

        logging.info(f'Backend notified with response: {r}')
        return r

    def _prepare_image_for_model(self, image):
        resize_to = (2400, 1800)
        crop_to = (1300, 1300)

        up, down = int((resize_to[1] / 2) - (crop_to[1] / 2)), int((resize_to[1] / 2) + (crop_to[1] / 2))
        left, right = int((resize_to[0] / 2) - (crop_to[0] / 2)), int((resize_to[0] / 2) + (crop_to[0] / 2))

        image = cv2.flip(image, 0)
        image = cv2.resize(image, resize_to)

        image = image[up:down, left:right]

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

        image_processed = self._prepare_image_for_model(image)

        classification = self._classify(image_processed)

        img_url = self._upload_image_to_gcp(image_processed, classification)

        self._notify_backend('Mariusz', classification, img_url)

        return classification
