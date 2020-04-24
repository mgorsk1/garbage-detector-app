import json

import cv2
import numpy as np
import requests
import tensorflow as tf


class GarbageNet:
    def __init__(self, path_model, input_shape=(224, 224, 3)):
        self.input_shape = input_shape
        self.path_model = path_model
        self.preprocess_input = self.get_preprocessor()
        self.model_base = self.load_base_model()
        self.top_model = self.load_top_model()
        self.classes = ['metal', 'paper', 'glass', 'plastic', 'cardboard']

    def predict(self, image):
        image = self.preprocess_input(np.copy(image))
        embeddings = self.model_base.predict(image)
        prediction_probabilities = self.top_model.predict(embeddings)
        prediction = prediction_probabilities.argmax(axis=1)
        prediction = [self.classes[p] for p in prediction]
        return prediction

    def get_preprocessor(self):
        return tf.keras.applications.resnet50.preprocess_input

    def load_base_model(self):
        return tf.keras.applications.resnet50.ResNet50(include_top=False, input_shape=self.input_shape)

    def load_top_model(self):
        return tf.keras.models.load_model(self.path_model)


if __name__ == '__main__':
    model = GarbageNet('saved_model/model0.h5')

    # path_image = './data/test_middle_crop_glass4.jpg'

    photos = [
        'test_closer_deo.jpg',
        'test_closer.jpg',
        'test_closer_pl.jpg',
        'test_middle_crop_glass2.jpg',
        'test_middle_crop_glass4.jpg',
        'test_middle_crop_paper.jpg',
        'test_middle_no_crop2.jpg',
        'test_middle_no_crop.jpg',
        'test_closer_glass.jpg',
        'test_closer_paper.jpg',
        'test_farther_crop.jpg',
        'test_middle_crop_glass3.jpg',
        'test_middle_crop_glass.jpg',
        'test_middle_crop_plastic.jpg',
        'test_middle_no_crop3.jpg',
    ]

    resize_to = (800, 600)
    crop_to = (250, 250)

    up, down = int((resize_to[1] / 2) - (crop_to[1] / 2)), int((resize_to[1] / 2) + (crop_to[1] / 2))
    left, right = int((resize_to[0] / 2) - (crop_to[0] / 2)), int((resize_to[0] / 2) + (crop_to[0] / 2))

    for path_image in photos:
        path_image = f'./data/{path_image}'

        image = cv2.imread(path_image)
        image = cv2.flip(image, 0)
        image = cv2.resize(image, (800, 600))
        image = image[up:down, left:right]

        # cv2.imshow("image", image)
        # cv2.waitKey(0)

        image = cv2.resize(image, (224, 224))
        image_expanded = np.expand_dims(image, axis=0)

        image = tf.keras.applications.resnet50.preprocess_input(image)

        image = np.ascontiguousarray(image)

        request = requests.post(
            'http://localhost:8500/v1/models/gd:predict',
            data=json.dumps(dict(instances=[image.tolist()])),
        )

        predictions = json.loads(request.content)['predictions'][0]
        classes = ['metal', 'paper', 'glass', 'plastic', 'cardboard']
        predicted_class = classes[predictions.index(max(predictions))]
        label = model.predict(image_expanded)

        print(path_image, label, predicted_class)
