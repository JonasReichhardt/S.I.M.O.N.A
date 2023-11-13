import Gpio from 'pigpio-mock'

const SLEEP = 5
const DIR = 6
const STEP = 13

const sleep_pin = new Gpio.Gpio(SLEEP, { mode: Gpio.OUTPUT, pullUpDown: Gpio.PUD_DOWN });
const dir_pin = new Gpio.Gpio(DIR, { mode: Gpio.OUTPUT });
const step_pin = new Gpio.Gpio(STEP, { mode: Gpio.OUTPUT });

sleep_pin.digitalWrite(1)
dir_pin.digitalWrite(1)

setInterval(()=>{
    for(var i = 0;i<200;i++){
        step_pin.trigger(100,1)
    }
},5000)


