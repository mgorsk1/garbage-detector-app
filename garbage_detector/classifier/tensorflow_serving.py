import json
import logging

import cv2
import numpy as np
import requests
import tensorflow as tf

from garbage_detector.classifier import GarbageClassifier
from garbage_detector.utils.gcp import GCP


class TensorflowServingGarbageClassifier(GarbageClassifier):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.gcp = GCP()

    def _prepare_image_for_model(self, image):
        # @todo parametrize this
        resize_to = (800, 600)
        crop_to = (250, 250)

        up, down = int((resize_to[1] / 2) - (crop_to[1] / 2)), int((resize_to[1] / 2) + (crop_to[1] / 2))
        left, right = int((resize_to[0] / 2) - (crop_to[0] / 2)), int((resize_to[0] / 2) + (crop_to[0] / 2))

        # @todo parametrize this
        image = cv2.resize(image, (800, 600))

        result = image[up:down, left:right]

        # @todo parametrize this
        result = cv2.resize(result, (224, 224))

        result = tf.keras.applications.resnet50.preprocess_input(result)

        return result

    def _classify(self, image):
        image = np.ascontiguousarray(image)

        # @todo parametrize this
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
