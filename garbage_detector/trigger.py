import logging
import sys
from abc import ABC
from abc import abstractmethod

from gpiozero import DistanceSensor
from gpiozero import LED

from garbage_detector import config


class Trigger(ABC):
    def __init__(self, *args, **kwargs):
        pass

    @abstractmethod
    def _check(self):
        pass

    def check(self):
        return self._check()


class TriggerWithLedNotification(Trigger):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.led = LED(int(config.trigger.parameters.led))

    def check(self):
        c = self._check()

        if c:
            self.led.on()
        else:
            self.led.off()

        return c


class DummyTrigger(Trigger):
    def _check(self):
        return True


class DistanceSensorTrigger(TriggerWithLedNotification):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.sensor = DistanceSensor(echo=int(kwargs.get('echo')), trigger=int(kwargs.get('trigger')))
        # distance_min - how close can one approach the device
        # distance_max - how far can one be from the device
        self.range = (int(kwargs.get('distance_min', -sys.maxsize)), int(kwargs.get('distance_max', sys.maxsize)))

    def _check(self):
        check = False

        distance = round(self.sensor.distance * 100, 2)

        logging.info(f'Distance from object: {distance} [cm]')

        if distance > self.range[1]:
            logging.info('Object too far away')
        elif distance < self.range[0]:
            logging.info('Object too close')
        else:
            logging.info('Object in range')
            check = True

        return check


def get_trigger_class(class_name):
    if class_name == 'DistanceSensorTrigger':
        return DistanceSensorTrigger
    else:
        return DummyTrigger

    # try:
    #     TriggerClass = getattr(import_module('gargabe_detector.trigger'), class_name)

    #     return TriggerClass
    # except Exception as e:
    #     print(e.args)
    #     logging.warning('Class {class_name} not found, defaulting to DummyTrigger')

    #     return DummyTrigger
