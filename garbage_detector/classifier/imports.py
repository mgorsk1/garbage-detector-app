from garbage_detector.classifier.google_cloud_ai import GoogleCloudAIGarbageClassifier
from garbage_detector.classifier.google_cloud_automl import GoogleCloudAutoMLGarbageClassifier
from garbage_detector.classifier.google_cloud_vision import GoogleCloudVisionGarbageClassifier
from garbage_detector.classifier.tensorflow_lite import TensorflowLiteGarbageClassifier
from garbage_detector.classifier.tensorflow_serving import TensorflowServingGarbageClassifier


def get_classifier_class(class_name):
    if class_name == 'TensorflowServingGarbageClassifier':
        return TensorflowServingGarbageClassifier
    elif class_name == 'GoogleCloudAIGarbageClassifier':
        return GoogleCloudAIGarbageClassifier
    elif class_name == 'GoogleCloudVisionGarbageClassifier':
        return GoogleCloudVisionGarbageClassifier
    elif class_name == 'GoogleCloudAutoMLGarbageClassifier':
        return GoogleCloudAutoMLGarbageClassifier
    elif class_name == 'TensorflowLiteGarbageClassifier':
        return TensorflowLiteGarbageClassifier
    else:
        raise NotImplementedError(f'Provided class name does not exist: {class_name}')
