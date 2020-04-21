import logging
import random
import cv2
import requests
from garbage_detector.utils.gcp import GCP


# @TODO move to config
BACKEND_HOST = '127.0.0.1'
BACKEND_PORT = 9000
BUCKET_NAME = "garbage-detector-classifications"


# @TODO develop this
class GarbageClassifier:
    def __init__(self):
        self.gcp = GCP(bucket_name=BUCKET_NAME)
        pass

    def _classify(self, image):
        result = random.choice(['glass', 'plastic', 'paper', 'rest'])

        logging.info(f'Image classified as: {result}')
        return result

    def _upload_image_to_gcp(self, image_location):
        original_blob_name = image_location.split('/')[-1]
        blob_name_prefix = original_blob_name.rsplit('.', 1)[0]
        blob_extension = original_blob_name.rsplit('.', 1)[-1]
        blob_name_postfix = ''

        blob_name = f"{blob_name_prefix}{blob_name_postfix}.{blob_extension}"
        while self.gcp.blob_exists(blob_name):
            if blob_name_postfix == '':
                blob_name_postfix = 1
            else:
                blob_name_postfix += 1

            blob_name = f"{blob_name_prefix}{blob_name_postfix}.{blob_extension}"

        self.gcp.upload_blob(source_file_name=image_location,
                             destination_blob_name=blob_name)

        logging.info(f'Image uploaded to GCP as: {blob_name}')
        return blob_name

    def _notify_backend(self, user, category, image):
        json_payload = {'user': user, 'class': category, 'image': image}

        logging.info(f"Sending payload to backend: {json_payload}")

        r = requests.post(f'http://{BACKEND_HOST}:{BACKEND_PORT}/collections', json=json_payload)

        logging.info(f'Backend notified with response: {r}')
        return r

    def classify(self, image_location):
        """
        Classifies an image and notifies the backend of this. Process:
            1. Call GCP to classify the image
            2. Upload the image to GCP Bucket
            3. Notifying the backend

        :param image_location: Full path to the file
        :return:
        """
        logging.info('Starting classify process')

        image = cv2.imread(image_location)

        classification = self._classify(image)

        img_name = self._upload_image_to_gcp(image_location=image_location)
        img_url = f"https://storage.cloud.google.com/{BUCKET_NAME}/{img_name}"

        self._notify_backend(user='Mariusz',
                             category=classification,
                             image=img_url)
