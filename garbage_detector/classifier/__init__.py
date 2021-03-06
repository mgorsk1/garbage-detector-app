import logging
from abc import ABC
from abc import abstractmethod
from time import sleep

import requests
from gpiozero import LED

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

        self.gcp = GCP()

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

    def _map_classification(self, classification):
        result = self.categories_map.get(classification, 'trash')

        logging.info(f'Classification: {classification} mapped as: {result}')

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

        _classification = self._classify(image)
        classification = self._map_classification(_classification)

        self._upload_image_to_gcp(image, classification)

        return classification

    def notify(self, classification):
        self._notify_backend(classification)
        self._turn_on_led(classification)
