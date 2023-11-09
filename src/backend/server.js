import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import fs from 'fs'
import ip from 'ip'
import Alarm from './alarm.js'
import WLED from './integrations/wled.js'
import Blinds from './integrations/blinds.js'
import Audio from './integrations/audio.js'
import Speech from './integrations/speech.js'

//var alarms = [new Alarm(0, activation, 0, 'WakeUp', 1)]
var alarms = []
var settings

main()

async function main() {
    load_app_settings()
    load_state()

    var server = init_webserver();
    start_webserver(server, settings.port);
}

//#region endpoint functions
function trigger_alarm(req, res) {
    var id = req.body.id

    if (id == undefined || id < 0 || id > alarms.length) {
        res.sendStatus(404)
        return
    }

    // call activation function
    activation(alarms[id])
    res.sendStatus(200)
}

function upload_file(req, res) {
    var file = req.files.audio

    if (file == undefined) {
        res.sendStatus(403)
        return
    }

    fs.writeFile(settings.audio.storage + '/' + file.name, file.data, (err) => {
        if (err) { console.log(err) }
    })

    res.sendStatus(200)
}

function deactivate_alarm(req, res) {
    var id = req.body.id

    if (id == undefined || id < 0 || id > alarms.length) {
        res.sendStatus(404)
        return
    }

    if (!alarms[id].deactivate()) {
        res.sendStatus(500)
        return
    }
    console.log('%s | deactivated alarm %s', time(), alarms[id].name)
    persist_state()
    res.sendStatus(200)
}

function activate_alarm(req, res) {
    var id = req.body.id

    if (id == undefined || id < 0 || id > alarms.length) {
        res.sendStatus(404)
        return
    }

    if (!alarms[id].activate()) {
        res.sendStatus(500)
        return
    }
    console.log('%s | activated alarm %s', time(), alarms[id].name)
    persist_state()
    res.sendStatus(200)
}

function create_alarm(req, res) {
    var id = req.body.id
    var target_time = req.body.time
    var name = req.body.name
    var wled = req.body.wled

    if (id == undefined) {
        // create new alarm
        alarms.push(new Alarm(target_time, activation, alarms.length, name, wled))
        console.log('%s | created alarm %s', time(), name)

    } else if (id > -1 && id <= alarms.length) {
        // update existing alarm
        alarms[id].reset_time(target_time)
        alarms[id].name = name
        console.log('%s | updated alarm %s', time(), name)
    }

    persist_state()
    res.sendStatus(201)
}

function get_alarms(req, res) {
    res.send({ alarms: alarms });
}

function delete_alarm(req, res) {
    var index = req.body.index

    if (index == null || index == undefined || index > alarms.length || index < 0) {
        res.sendStatus(204)
        return
    }

    alarms.splice(index, 1)
    persist_state()

    res.sendStatus(200)
}

//#endregion

function load_app_settings() {
    try {
        settings = JSON.parse(fs.readFileSync('appsettings.json', 'utf8'))

        var activeActions = []
        if (settings.audio.active) { activeActions.push('Audio') }
        if (settings.wled.activate) { activeActions.push('LEDs') }
        if (settings.blinds.activate) { activeActions.push('Blinds') }

        console.log('%s | loaded appsettings using [%s] integrations', time(), activeActions.join())
    } catch (err) {
        console.error('ERR| could not load app settings')
        console.error(err)
    }
}

function load_state() {
    try {
        var data = JSON.parse(fs.readFileSync('./persistence/state.json', 'utf8'))
        for (const el of data) {
            var alarm = new Alarm(el.target_time, activation, el.id, el.name,el.wled)
            if (el.isActive) {
                alarm.activate()
            }
            alarms.push(alarm)
        }
        console.log('%s | loaded %s alarm(s)', time(), alarms.length)
    } catch (err) {
        console.error('ERR| could not load app state')
    }
    persist_state()
}

function persist_state() {
    fs.writeFile('./persistence/state.json', JSON.stringify(alarms), 'utf-8', (err) => {
        if (err) {
            console.error(err)
        }
    })
}

function log_activation(message) {
    fs.appendFile('./persistence/log.txt', 'message\r\n', 'utf-8', (err) => {
        if (err) {
            console.error(err)
        }
    })
}

function init_webserver() {
    var server = express()

    server.use(express.json())
    server.use(cors())
    server.use(fileUpload())
    server.use(express.static('../frontend/dist'))

    server.post('/alarms', create_alarm)
    server.get('/alarms', get_alarms)
    server.delete('/alarms', delete_alarm)
    server.post('/activate', activate_alarm)
    server.post('/deactivate', deactivate_alarm)
    server.post('/audio', upload_file)
    server.post('/trigger', trigger_alarm)

    return server
}

function start_webserver(server, port) {
    return server.listen(port, function () {
        console.info('%s | server listening at http://%s:%s', time(), ip.address(), port)
    })
}

function activation(alarm) {
    if (alarm != undefined && alarm != null) {
        alarm.deactivate()
    }
    var message = `${time()} | ${alarm.name} activated`
    console.log(message)
    log_activation(message)

    if (settings.wled.active) {
        for (const led_ip of settings.wled.instances) {
            WLED.activate(led_ip,alarm.wled)
        }
    }

    if (settings.blinds.active) {
        Blinds.open(settings.blinds.instance)
    }

    if (settings.audio.active) {
        // generate speech file
        const sp = settings.audio.speech
        if(sp.active){
            Speech.generate_speech(sp.config.greet_name,sp.config.location,sp.config.voice_id)
            Audio.play(settings.audio.storage, 'daily.mp3')
        }else{
            Audio.play(settings.audio.storage, settings.audio.file)
        }
    }
}

function time() {
    return new Date().toTimeString().substring(0, 8)
}