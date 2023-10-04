import express from 'express'
import cors from 'cors'
import fs from 'fs'
import ip from 'ip'
import Alarm from './alarm.js'
import WLED from './integrations/wled.js'
import Blinds from './integrations/blinds.js'
import Audio from './integrations/audio.js'

var alarms = [new Alarm(0,activation,"WakeUp")]
var settings

main()

async function main() {
    load_app_settings()
    load_state()

    var server = init_webserver();

    start_webserver(server, settings.port);
}

function load_app_settings() {
    try {
        settings = JSON.parse(fs.readFileSync('appsettings.json', 'utf8'))

        var activeActions = []
        if (settings.useaudio) { activeActions.push('Audio') }
        if (settings.usewleds) { activeActions.push('LEDs') }
        if (settings.useblinds) { activeActions.push('Blinds') }

        console.log("%s | loaded appsettings using %s", time(), activeActions.join())
    } catch (err) {
        console.error("ERR| could not load app settings")
        console.error(err)
    }
}

function load_state() {
    try {
        var data = JSON.parse(fs.readFileSync('state.json', 'utf8'))
        for (const el of data) {
            alarms.push(new Alarm(el.target_time, activation,"test"))
        }
    } catch (err) {
        console.error("ERR| could not load app state")
    }
    persist_state()
}

function persist_state() {
    fs.writeFile('./state.json', JSON.stringify(alarms), 'utf-8',(err)=>{
        if(err){
            console.error(err)
        }  
    })
}

function init_webserver() {
    var server = express()

    server.use(express.json())
    server.use(cors())
    server.use(express.static('../frontend/dist'))

    server.post('/time', create_alarm)
    server.get('/alarms', get_alarms)

    return server
}

function create_alarm(req, res) {
    var target_time = req.body.time
    var id = req.body.id

    if (target_time != undefined && id != undefined) {
        alarms[id].reset_time(target_time)
        persist_state()

        console.log("%s | %d seconds until alarm", time(), alarms[id].ms_to_wait / 1000)
        res.sendStatus(201)
    }
}

function get_alarms(req, res) {
    res.send({ alarms: alarms });
}

function activation() {
    console.log("%s | alarm", time())
    if (settings.usewleds) {
        for (const led of settings.wleds) {
            WLED.activate(led)
        }
    }

    if (settings.useblinds) {
        Blinds.open(settings.blinds_port)
    }

    if (settings.useaudio) {
        Audio.play(settings.audio)
    }
}

function time() {
    return new Date().toTimeString().substring(0, 8)
}

function start_webserver(server, port) {
    return server.listen(port, function () {
        console.info("%s | server listening at http://%s:%s", time(), ip.address(), port)
    })
}