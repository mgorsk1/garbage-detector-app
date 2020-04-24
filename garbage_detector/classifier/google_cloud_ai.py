import logging

import cv2
import googleapiclient.discovery
from google.oauth2 import service_account

from garbage_detector import BASE_PATH
from garbage_detector import config
from garbage_detector.classifier import GarbageClassifier
from garbage_detector.utils.gcp import GCP


class GoogleCloudAIGarbageClassifier(GarbageClassifier):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.gcp = GCP()

        sa_file = f'{BASE_PATH}/resources/keys/ai.json'
        credentials = service_account.Credentials.from_service_account_file(sa_file)

        self.ai = googleapiclient.discovery.build('ml', 'v1', credentials=credentials)

    def _prepare_image_for_model(self, image):
        resize_to = (1200, 900)

        crop_to = (
            int(resize_to[0]*float(config.image.crop_factor)),
            int(resize_to[1]*float(config.image.crop_factor)),
        )

        up, down = int((resize_to[1] / 2) - (crop_to[1] / 2)), int((resize_to[1] / 2) + (crop_to[1] / 2))
        left, right = int((resize_to[0] / 2) - (crop_to[0] / 2)), int((resize_to[0] / 2) + (crop_to[0] / 2))

        image = cv2.resize(image, resize_to)

        result = image[up:down, left:right]

        result = cv2.resize(result, (config.image.final_size, config.image.final_size))

        return result

    def _classify(self, image):
        image = image.tolist()

        name = f'projects/{config.gcp.project.name}/models/{config.gcp.model.name}'

        response = self.ai.projects().predict(
            name=name,
            body={'instances': [image]},
        ).execute()

        logging.info(f'Received response {response}')

        predictions = list(response.get('predictions')[0])

        if 'error' in response:
            raise RuntimeError(response['error'])

        result = self.classes[predictions.index(max(predictions))]

        logging.info(f'Image classified as: {result}')

        result = self.categories_map.get(result, 'trash')

        logging.info(f'Image mapped as: {result}')

        return result
