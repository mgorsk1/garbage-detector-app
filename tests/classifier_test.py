from garbage_detector.classifier import GarbageClassifier
import os
import cv2


# Determine current dir
current_dir = os.path.dirname(__file__)

if __name__ == '__main__':
    image = cv2.imread(f'{current_dir}/resources/plastic.jpg')
    classifier = GarbageClassifier()
    classifier.classify(image=image)
