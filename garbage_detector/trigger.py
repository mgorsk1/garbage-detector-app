import logging
import sys
from abc import ABC
from abc import abstractmethod
from importlib import import_module

from gpiozero import DistanceSensor


class Trigger(ABC):
    @abstractmethod
    def check(self):
        pass


class DummyTrigger(Trigger):
    def check(self):
        return True


class DistanceSensorTrigger(Trigger):
    def __init__(self, **kwargs):
        self.sensor = DistanceSensor(echo=kwargs.get('echo'), trigger=kwargs.get('trigger'))
        # distance_min - how close can one approach the device
        # distance_max - how far can one be from the device
        self.range = (kwargs.get('distance_min', -sys.maxsize), kwargs.get('distance_max', sys.maxsize))

    def check(self):
        check = False

        distance = round(self.sensor.distance * 100, 2)

        logging.info(f'Distance from object: {distance} [cm]')

        if distance > self.range[0]:
            logging.info('Object too far away')
        elif distance < self.range[1]:
            logging.info('Object too close')
        else:
            logging.info('Object in range')
            check = True

        return check


def get_trigger_class(class_name):
    try:
        TriggerClass = getattr(import_module('gargabe_detector.trigger'), class_name)

        return TriggerClass, True
    except Exception:
        logging.warning('Class {class_name} not found, defaulting to DummyTrigger')

        return DummyTrigger, False
