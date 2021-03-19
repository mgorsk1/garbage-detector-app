import logging
import os
import time

import cv2
from google.cloud import storage

from garbage_detector import config


class GCP:
    def __init__(self):
        storage_client = storage.Client()
        self.bucket = storage_client.bucket(config.gcp.bucket.name)

    def upload_image(self, image, classification):
        """
        Uploads a file to the bucket.
        """

        image_name = f'{classification}_{int(time.time())}.jpg'
        image_location = f'/tmp/{image_name}'

        cv2.imwrite(image_location, image)

        destination_blob_name = f'class={classification}/{image_name}'
        blob = self.bucket.blob(destination_blob_name)

        blob.upload_from_filename(image_location)

        logging.info(f'File {image_location} uploaded to {destination_blob_name}.')

        os.remove(image_location)

        return blob.public_url

    def blob_exists(self, destination_blob_name):
        """
        Checks if a blob exists in GCP
        """

        blob = self.bucket.blob(destination_blob_name)
        return blob.exists()
