import os

from garbage_detector import config
from garbage_detector.classifier.imports import get_classifier_class

# Determine current dir
current_dir = os.path.dirname(__file__)

if __name__ == '__main__':
    classifier = get_classifier_class(config.classifier.cls)
    classifier.classify(f'{current_dir}/resources/plastic.jpg')
