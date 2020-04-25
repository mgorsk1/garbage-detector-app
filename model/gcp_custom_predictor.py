import os
import numpy as np
from tensorflow import keras


class MyPredictor(object):
    """An example Predictor for an AI Platform custom prediction routine."""

    def __init__(self, model):
        """Stores artifacts for prediction. Only initialized via `from_path`.
        """
        self._model = model

    def predict(self, instances, **kwargs):
        """Performs custom prediction.

        Preprocesses inputs, then performs prediction using the trained Keras
        model.

        Args:
            instances: A list of prediction input instances.
            **kwargs: A dictionary of keyword args provided as additional
                fields on the predict request body.

        Returns:
            A list of outputs containing the prediction results.
        """
        inputs = np.asarray(instances)
        preprocessed_inputs = keras.applications.resnet50.preprocess_input(inputs)
        outputs = self._model.predict(preprocessed_inputs)
        return outputs.tolist()

    @classmethod
    def from_path(cls, model_dir):
        """Creates an instance of MyPredictor using the given path.

        This loads artifacts that have been copied from your model directory in
        Cloud Storage. MyPredictor uses them during prediction.

        Args:
            model_dir: The local directory that contains the trained Keras
                model and the pickled preprocessor instance. These are copied
                from the Cloud Storage model directory you provide when you
                deploy a version resource.

        Returns:
            An instance of `MyPredictor`.
        """
        model_path = os.path.join(model_dir, 'model.h5')
        model = keras.models.load_model(model_path)

        return cls(model)
