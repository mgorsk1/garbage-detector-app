from threading import Thread
from time import sleep

from gpiozero import LEDBoard

from garbage_detector import config


class LEDBoardSpinner(Thread):
    blink_on_finish = False

    def __init__(self, function, **kwargs):
        Thread.__init__(self, **kwargs)

        self.function = function

        self.board = LEDBoard(*[int(v) for k, v in config.leds.items()])

        self.wait = True

        self.blink_time = 0.5

    def __call__(self, *args, **kwargs):
        if self.function is not None:
            self.start()

            result = self.function(*args, **kwargs)

            self.finish()

            while self.is_alive():
                pass

            return result

    def run(self):
        runs = 0

        while self.wait or runs < 2:
            for i in range(len(self.board)):
                self.board.toggle(i)
                sleep(0.2)
                self.board.toggle(i)

            runs += 1

        sleep(self.blink_time)

        if self.blink_on_finish:
            self.board.blink(on_time=self.blink_time, off_time=self.blink_time, n=3, background=False)

        self.board.off()

    def finish(self):
        self.wait = False


class LEDBoardSpinnerWithConfirmation(LEDBoardSpinner):
    blink_on_finish = True
