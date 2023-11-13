import Gpio from 'pigpio'

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

var start = new Date().getTime();
for(var i = 0;i<200;i++){
    step_pin.trigger(100,1)
    sleep(2)
}
var stop = new Date().getTime() - start
console.log("One rotation took %d s",stop/1000)

sleep_pin.digitalWrite(0)






