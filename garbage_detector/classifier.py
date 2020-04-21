import logging
import random
import cv2
import requests
from garbage_detector.utils import gcp


# @TODO develop this
class GarbageClassifier:
    def __init__(self):
        pass

    def _classify(self, image):
        result = random.choice(['glass', 'plastic', 'paper', 'rest'])

        logging.info(f'Image classified as: {result}')
        return result

    def _upload_image_to_gcp(self, image_location):
        blob_name = image_location.split('/')[-1]

        gcp.upload_blob(bucket_name="garbage-detector-classifications",
                        source_file_name=image_location,
                        destination_blob_name=blob_name)

        logging.info(f'Image uploaded to GCP as: {blob_name}')
        return blob_name

    def _notify_backend(self, user, category, image):
        json_payload = {'user': user, 'class': category, 'image': image}

        r = requests.post('http://192.168.0.17:9000/collections', json=json_payload)

        logging.info(f'Backend notified with response: {r}')
        return r

    def classify(self, image_location):
        """
        Classifies the image by calling GCP and notifying the backend.

        :param image_location: Full path to the file
        :return:
        """
        logging.info('Starting classify process')

        image = cv2.imread(image_location)

        classification = self._classify(image)

        photo_url = self._upload_image_to_gcp(image_location=image_location)

        self._notify_backend('Mariusz', classification, photo_url)
