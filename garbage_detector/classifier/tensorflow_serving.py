import json
import logging

import cv2
import numpy as np
import requests
import tensorflow as tf

from garbage_detector import config
from garbage_detector.classifier import GarbageClassifier
from garbage_detector.utils.gcp import GCP


class TensorflowServingGarbageClassifier(GarbageClassifier):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.gcp = GCP()

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
        image = tf.keras.applications.resnet50.preprocess_input(image)

        image = np.ascontiguousarray(image)

        serving_url = f'{config.tfserving.scheme}://{config.tfserving.host}:{config.tfserving.port}'
        serving_endpoint = f'v1/models/{config.tfserving.model.name}:predict'

        request = requests.post(
            f'{serving_url}/{serving_endpoint}',
            data=json.dumps(dict(instances=[image.tolist()])),
        )

        logging.info(f'Received response: {request.__dict__}')

        predictions = json.loads(request.content)['predictions'][0]
        result = self.classes[predictions.index(max(predictions))]

        logging.info(f'Image classified as: {result}')

        result = self.categories_map.get(result, 'trash')

        logging.info(f'Image mapped as: {result}')

        return result
