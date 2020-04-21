import logging
import random

import cv2
import numpy as np
import requests


# @TODO develop this
class GarbageClassifier:
    def __init__(self):
        pass

    def _classify(self, image):
        result = random.choice(['glass', 'plastic', 'paper', 'rest'])

        logging.info(f'Image classified as: {result}')
        return result

    def _upload_image_to_gcp(self, image):
        result = 'https://storage.googleapis.com/garbage-detector-classifications/20200419_100642%20(1).jpg'

        logging.info(f'Image uploaded to GCP as: {result}')
        return result

    def _notify_backend(self, user, category, image):
        json_payload = {'user': user, 'class': category, 'image': image}

        r = requests.post('http://192.168.0.17:9000/collections', json=json_payload)

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

        image = cv2.resize(image, (224, 224))

        image = np.expand_dims(image, axis=0)

        return image

    def classify(self, image):
        logging.info('Starting classify process')

        image_processed = self._prepare_image_for_model(image)

        classification = self._classify(image_processed)

        photo_url = self._upload_image_to_gcp(image_processed)

        self._notify_backend('Mariusz', classification, photo_url)
