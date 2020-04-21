import logging

import requests


# @TODO develop this
class GarbageClassifier:
    def __init__(self):
        pass

    def _classify(self, image):
        result = 'plastic'

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
        return image

    def classify(self, image):
        logging.info('Starting classify process')

        image = self._prepare_image_for_model(image)

        classification = self._classify(image)

        photo_url = self._upload_image_to_gcp(image)

        self._notify_backend('Mariusz', classification, photo_url)
