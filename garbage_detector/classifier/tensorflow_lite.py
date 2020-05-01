import logging

import cv2
import numpy as np
import tflite_runtime.interpreter as tflite

from garbage_detector import BASE_PATH
from garbage_detector import config
from garbage_detector.classifier import GarbageClassifier


class TensorflowLiteGarbageClassifier(GarbageClassifier):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.interpreter = tflite.Interpreter(
            model_path=f'{BASE_PATH}/resources/models/tflite/{config.tflite.model.name}/model.tflite',
        )

        self.interpreter.allocate_tensors()

        self.labels = open(f'{BASE_PATH}/resources/models/tflite/{config.tflite.model.name}/dict.txt').readlines()

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
        input_details = self.interpreter.get_input_details()
        output_details = self.interpreter.get_output_details()

        image = np.expand_dims(image, axis=0)

        self.interpreter.set_tensor(input_details[0]['index'], image)

        self.interpreter.invoke()

        output_data = self.interpreter.get_tensor(output_details[0]['index'])

        results = np.squeeze(output_data)

        top_k = results.argsort()[-5:][::-1]

        result = self.labels[top_k[0]]

        logging.info(f'Image classified as: {result}')

        return result
