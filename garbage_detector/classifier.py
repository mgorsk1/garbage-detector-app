import logging
import random
import cv2
import numpy as np
import requests
import time
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

    def _upload_image_to_gcp(self, image_location, image_name):
        self.gcp.upload_blob(source_file_name=image_location,
                             destination_blob_name=image_name)

        logging.info(f'Image uploaded to GCP as: {image_name}')

        return f"https://storage.cloud.google.com/{BUCKET_NAME}/{image_name}"

    def _notify_backend(self, user, category, image):
        json_payload = {'user': user, 'class': category, 'image': image}

        logging.info(f"Sending payload to backend: {json_payload}")

        r = requests.post(f'http://{BACKEND_HOST}:{BACKEND_PORT}/collections', json=json_payload)

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
        """
        Classifies an image and notifies the backend of this. Process:
            1. Call GCP to classify the image
            2. Upload the image to GCP Bucket
            3. Notifying the backend

        :param image: Image opened with OpenCV (cv2)
        :return:
        """
        logging.info('Starting classify process')

        # process the image and classify
        image_processed = self._prepare_image_for_model(image)
        classification = self._classify(image_processed)

        # Write processed image back to disk
        generated_image_name = f'hopefully_{classification}_{int(time.time())}.jpg'
        processed_image_location = f'/tmp/{generated_image_name}'
        cv2.imwrite(processed_image_location, image)

        img_url = self._upload_image_to_gcp(image_location=processed_image_location, image_name=generated_image_name)

        self._notify_backend(user='Mariusz',
                             category=classification,
                             image=img_url)
