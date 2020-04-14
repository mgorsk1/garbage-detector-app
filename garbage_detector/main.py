import time

import cv2
from picamera import PiCamera
from picamera.array import PiRGBArray

camera = PiCamera()
camera.resolution = (640, 480)
camera.framerate = 32
raw_capture = PiRGBArray(camera, size=camera.resolution)

# allow the camera to warmup
time.sleep(0.1)

for frame in camera.capture_continuous(raw_capture, format='bgr', use_video_port=True):
    image = frame.array

    cv2.imshow('Frame', image)
    key = cv2.waitKey(1) & 0xFF

    raw_capture.truncate(0)

    if key == ord('q'):
        break
