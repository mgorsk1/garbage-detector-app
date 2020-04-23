import json
import logging
from time import sleep

import cv2
import numpy as np
import requests
from gpiozero import LED

from garbage_detector import config
from garbage_detector.utils.gcp import GCP


class GarbageClassifier:
    def __init__(self):
        self.gcp = GCP()

        self.classes = ['metal', 'paper', 'glass', 'plastic', 'cardboard']

        self.led_mapping = dict(
            paper=config.leds.green,
            glass=config.leds.yellow,
            plastic=config.leds.blue,
            rest=config.leds.red,
        )

        self.categories_map = dict(
            paper='paper',
            plastic='plastic',
            glass='glass',
        )

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
        resize_to = (800, 600)
        crop_to = (250, 250)

        up, down = int((resize_to[1] / 2) - (crop_to[1] / 2)), int((resize_to[1] / 2) + (crop_to[1] / 2))
        left, right = int((resize_to[0] / 2) - (crop_to[0] / 2)), int((resize_to[0] / 2) + (crop_to[0] / 2))

        image = cv2.resize(image, (800, 600))

        result = image[up:down, left:right]
        result = cv2.resize(result, (128, 128))

        return result

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
