import logging
from json import loads

import cv2
from google.cloud import vision
from google.cloud.vision import types

from garbage_detector import BASE_PATH
from garbage_detector import config
from garbage_detector.classifier import GarbageClassifier


class GoogleCloudVisionGarbageClassifier(GarbageClassifier):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        with open(f'{BASE_PATH}/resources/gcp_objects/class-descriptions.json') as f:
            self.labels = loads(f.read())

        self.vision = vision.ImageAnnotatorClient()

    def _prepare_image_for_model(self, image):
        # @todo parametrize this
        resize_to = (2400, 1800)

        image = cv2.resize(image, resize_to)

        return image

    def _classify(self, image):
        frame_bytes = cv2.imencode('.jpg', image)[1].tostring()

        image = types.Image(content=frame_bytes)

        response = self.vision.label_detection(image=image)
        annotations = {l.description: round(l.score * 100, 2) for l in response.label_annotations}

        logging.info(f'Received annotations {annotations}')

        result = self._get_best_pick(annotations)

        if result is not None:
            description, category, confidence = [result.get(x) for x in ['description', 'category', 'confidence']]

            if confidence >= int(config.gcp.vision.classification.threshold):
                return category

                logging.info(f'Image classified as: {category}')

        return 'rest'

    def _get_best_pick(self, values):
        import operator

        values_sorted = sorted(values.items(), key=operator.itemgetter(1), reverse=True)

        for description, score in values_sorted:
            category = self.labels.get(description)

            if category:
                result = dict(description=description, category=category, confidence=score)

                logging.info(f'Found best pick: {result}')

                return result

        return None
