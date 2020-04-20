from threading import Thread
from time import sleep

from gpiozero import LEDBoard

from garbage_detector import config


class LEDBoardSingleton:
    board = LEDBoard(*[int(v) for k, v in config.leds.items()])


class LEDBoardSpinner(LEDBoardSingleton):
    blink_on_finish = False

    def __init__(self, function, **kwargs):
        Thread.__init__(self, **kwargs)

        self.function = function

        self.blink_time = 0.5

    def __call__(self, *args, **kwargs):
        if self.function is not None:
            thread = Thread(target=self.run, args=())

            thread.start()

            result = self.function(*args, **kwargs)

            while thread.is_alive():
                pass

            if self.blink_on_finish:
                self.board.blink(on_time=self.blink_time, off_time=self.blink_time, n=3, background=False)

            self.board.off()

            return result

    def run(self):
        runs = 0

        while True and runs < 2:
            for i in range(len(self.board)):
                self.board.toggle(i)
                sleep(0.2)
                self.board.toggle(i)

            runs += 1

        sleep(self.blink_time)


class LEDBoardSpinnerWithConfirmation(LEDBoardSpinner):
    blink_on_finish = True
