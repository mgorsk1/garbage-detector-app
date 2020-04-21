from threading import Thread
from time import sleep

from gpiozero import LEDBoard

from garbage_detector import config


class SpinnerThread(Thread):
    def __init__(self,  *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.runs = 0
        self.blink_time = 0.5
        self.blink_on_finish = False
        self.board = LEDBoard(*[int(v) for k, v in config.leds.items()])

        self.killed = False

    def stop(self):
        self.killed = True

    def run(self):
        while not self.killed or self.runs < 2:
            for i in range(len(self.board)):
                self.board.toggle(i)
                sleep(0.2)
                self.board.toggle(i)

            self.runs += 1

        sleep(self.blink_time)

        if self.blink_on_finish:
            self.board.blink(on_time=self.blink_time, off_time=self.blink_time, n=3, background=False)

        self.board.off()

        raise SystemExit()


class LEDBoardSpinner:
    blink_on_finish = False

    def __init__(self, function, **kwargs):
        Thread.__init__(self, **kwargs)

        self.function = function

        self.blink_time = 0.5

    def __call__(self, *args, **kwargs):
        if self.function is not None:
            spinner = SpinnerThread(args=(self.blink_on_finish))

            spinner.blink_on_finish = self.blink_on_finish

            spinner.start()

            result = self.function(*args, **kwargs)

            spinner.stop()

            while spinner.is_alive():
                pass

            return result


class LEDBoardSpinnerWithConfirmation(LEDBoardSpinner):
    blink_on_finish = True
