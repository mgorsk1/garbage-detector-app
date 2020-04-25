import logging

import cv2
from google.cloud import automl

from garbage_detector import config
from garbage_detector.classifier import GarbageClassifier


class GoogleCloudAutoMLGarbageClassifier(GarbageClassifier):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.model = automl.PredictionServiceClient()

        self.model_full_id = self.model.model_path(
            config.gcp.project.name,
            config.gcp.project.region,
            config.gcp.automl.model.id,
        )

    def _prepare_image_for_model(self, image):
        resize_to = (1200, 900)

        crop_to = (
            int(resize_to[0] * float(config.image.crop_factor)),
            int(resize_to[1] * float(config.image.crop_factor)),
        )

        up, down = int((resize_to[1] / 2) - (crop_to[1] / 2)), int((resize_to[1] / 2) + (crop_to[1] / 2))
        left, right = int((resize_to[0] / 2) - (crop_to[0] / 2)), int((resize_to[0] / 2) + (crop_to[0] / 2))

        image = cv2.resize(image, resize_to)

        result = image[up:down, left:right]

        result = cv2.resize(result, (int(config.image.final_size), int(config.image.final_size)))

        return result

    def _classify(self, image):
        frame_bytes = cv2.imencode('.jpg', image)[1].tostring()

        automl_image = automl.types.Image(image_bytes=frame_bytes)
        payload = automl.types.ExamplePayload(image=automl_image)

        params = {'score_threshold': config.gcp.automl.threshold}

        response = self.model.predict(self.model_full_id, payload, params)

        for result in response.payload:
            logging.info(f'Predicted class name: {result.display_name}')
            logging.info(f'Predicted class score: {result.classification.score}')

            return result.display_name
