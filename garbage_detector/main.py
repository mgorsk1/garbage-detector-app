import logging
import time
from datetime import datetime
from time import sleep
from typing import Any

import cv2
from gpiozero import LED
from picamera import PiCamera
from picamera.array import PiRGBArray

from garbage_detector import config
from garbage_detector.classifier import GarbageClassifier
from garbage_detector.trigger import get_trigger_class
from garbage_detector.utils.spinner import LEDBoardSpinner
from garbage_detector.utils.spinner import LEDBoardSpinnerWithConfirmation

LED_MAPPING = dict(
    paper=config.leds.blue,
    glass=config.leds.green,
    plastic=config.leds.yellow,
    rest=config.leds.red,
)

trigger: Any
camera: Any
raw_capture: Any
classifier: GarbageClassifier


@LEDBoardSpinnerWithConfirmation
def setup():
    global trigger
    global camera
    global raw_capture
    global classifier

    # allow the camera to warmup
    time.sleep(0.1)

    camera = PiCamera()
    camera.resolution = (int(config.camera.resolution.width), int(config.camera.resolution.height))
    camera.framerate = int(config.camera.framerate)
    raw_capture = PiRGBArray(camera, size=camera.resolution)

    trigger = get_trigger_class(config.trigger.cls)(**config.trigger.parameters)

    classifier = GarbageClassifier()


def turn_on_led(classification):
    led = LED(LED_MAPPING.get(classification))

    led.on()

    sleep(3)

    led.off()


@LEDBoardSpinner
def classify(classifier: GarbageClassifier, image):
    return classifier.classify(image)


if __name__ == '__main__':
    setup()

    start = None

    for frame in camera.capture_continuous(raw_capture, format='bgr', use_video_port=True):
        image = cv2.flip(frame.array, 0)

        if trigger.check():
            if start is None:
                start = datetime.now()

            in_range_for = round((datetime.now() - start).total_seconds(), 2)

            logging.info(f'In range for: {in_range_for} s.')

            if in_range_for > int(config.trigger.delay):
                classification = classify(classifier, image)

                turn_on_led(classification)

                start = None
        else:
            start = None

        # @TODO delete before going live
        # cv2.imshow('Frame', image)

        key = cv2.waitKey(1) & 0xFF

        raw_capture.truncate(0)

        if key == ord('q'):
            break
