import json
import logging

import cv2
import numpy as np
import requests

from garbage_detector import config
from garbage_detector.utils.gcp import GCP


class GarbageClassifier:
    def __init__(self):
        self.gcp = GCP()

        self.classes = ['metal', 'paper', 'glass', 'plastic', 'cardboard']

    def _classify(self, image):
        image = np.ascontiguousarray(image)

        request = requests.post(
            'http://192.168.0.17:8500/v1/models/gd:predict',
            data=json.dumps(dict(instances=[image.tolist()])),
        )

        predictions = json.loads(request.content)['predictions'][0]
        result = self.classes[predictions.index(max(predictions))]

        logging.info(f'Image classified as: {result}')
        return result

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
        resize_to = (800, 600)
        crop_to = (250, 250)

        up, down = int((resize_to[1] / 2) - (crop_to[1] / 2)), int((resize_to[1] / 2) + (crop_to[1] / 2))
        left, right = int((resize_to[0] / 2) - (crop_to[0] / 2)), int((resize_to[0] / 2) + (crop_to[0] / 2))

        image = cv2.flip(image, 0)
        image = cv2.resize(image, (800, 600))

        image = image[up:down, left:right]

        image_resized = cv2.resize(image, (224, 224))

        return image_resized, image

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

        image_processed_resized, image_processed = self._prepare_image_for_model(image)

        classification = self._classify(image_processed_resized)

        img_url = self._upload_image_to_gcp(image_processed, classification)

        self._notify_backend('Mariusz', classification, img_url)

        return classification
