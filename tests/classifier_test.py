import os

from garbage_detector.classifier import GarbageClassifier


# Determine current dir
current_dir = os.path.dirname(__file__)

if __name__ == '__main__':
    classifier = GarbageClassifier()
    classifier.classify(f'{current_dir}/resources/plastic.jpg')
