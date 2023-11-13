import Gpio from 'pigpio-mock'

const SLEEP = 5
const DIR = 6
const STEP = 13

const sleep_pin = new Gpio.Gpio(SLEEP, { mode: Gpio.OUTPUT, pullUpDown: Gpio.Gpio.PUD_DOWN });
const dir_pin = new Gpio.Gpio(DIR, { mode: Gpio.OUTPUT });
const step_pin = new Gpio.Gpio(STEP, { mode: Gpio.OUTPUT });

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) { break; }
    }
}

sleep_pin.digitalWrite(1)
dir_pin.digitalWrite(1)

for(var i = 0;i<200;i++){
    step_pin.digitalWrite(1)
    console.log("stepping")
    sleep(10)
    step_pin.digitalWrite(0)
    sleep(10)
}

sleep_pin.digitalWrite(0)


