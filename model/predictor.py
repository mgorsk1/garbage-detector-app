import os 

import numpy as np
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


if __name__ == "__main__":
    model = GarbageNet('saved_model/model0.h5')

    path_image1 = 'data/train/cardboard/cardboard1.jpg'
    path_image2 = 'data/train/glass/glass1.jpg'

    image = tf.keras.preprocessing.image.load_img(path_image2, target_size=(224, 224))
    image = tf.keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)

    label = model.predict(image)

    print(label)