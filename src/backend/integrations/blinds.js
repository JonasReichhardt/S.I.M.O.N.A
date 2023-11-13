import Gpio from 'pigpio-mock'

const SLEEP = 5
const DIR = 6
const STEP = 13

const STEPS_PER_REV = 200
const CIRCUMFERENCE = 125 //mm

const sleep_pin = new Gpio.Gpio(SLEEP, { mode: Gpio.OUTPUT, pullUpDown: Gpio.Gpio.PUD_DOWN });
const dir_pin = new Gpio.Gpio(DIR, { mode: Gpio.OUTPUT });
const step_pin = new Gpio.Gpio(STEP, { mode: Gpio.OUTPUT });

export default class Blinds{

    static async open(ip){
        await fetch('http://' + ip + '/open').then(res => res.text()).then((body)=>console.log(body))
    }

    static move(distance){
        const revs = distance / CIRCUMFERENCE
    
        dir_pin.digitalWrite(1)
        sleep_pin.digitalWrite(1)
        var start = new Date().getTime();
        for(var i = 0;i<revs * STEPS_PER_REV;i++){
            step_pin.trigger(100,1)
            sleep(2)
        }
        var stop = new Date().getTime() - start
        sleep_pin.digitalWrite(0)
        console.log("movement done moved %d mm in %d s",distance,stop/1000)
    }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) { break; }
    }
}