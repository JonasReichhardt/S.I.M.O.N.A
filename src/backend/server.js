import express from 'express'
import cors from 'cors'
import fs from 'fs'
import ip from 'ip'
import Alarm from './alarm.js'
import WLED from './wled.js'
import Blinds from './blinds.js'
import Audio from './audio.js'

var alarms = []
var settings

main()

async function main(){
    load_app_settings()
    load_state()

    var server = init_webserver();

    activation()

    start_webserver(server, settings.port);
}

function load_app_settings(){
    try {
        settings = JSON.parse(fs.readFileSync('appsettings.json', 'utf8'))
        
        var activeActions = []
        if(settings.useaudio){ activeActions.push('Audio') }
        if(settings.usewleds){ activeActions.push('LEDs') }
        if(settings.useblinds){ activeActions.push('Blinds') }

        console.log("%s | loaded appsettings using %s",time(),activeActions.join())
    } catch (err) {
        console.error("ERR| could not load app settings")
        console.error(err)
    }
}

function load_state(){
    try {
        var data = JSON.parse(fs.readFileSync('state.json', 'utf8'))
        for(const el of data){
            if(el.target_time > new Date().getTime()){
                alarms.push(new Alarm(el.source_time,el.target_time,activation))
            }
        }
    } catch (err) {
        console.error("ERR| could not load app state")
        console.error(err)
    }
    persist_state()
}

function persist_state(){
    try{
        fs.writeFileSync('./state.json',JSON.stringify(alarms),'utf-8')
    }catch{
        console.error("ERR| could not persist app state")
        console.error(err)
    }
}

function init_webserver(){
    var server = express()

    server.use(express.json())
    server.use(cors())
    server.use(express.static('../frontend/dist'))

    server.post('/time', create_alarm)

    return server
}

function create_alarm(req,res){
    var target_time = req.body.time
    var id = req.body.id

    if(target_time != undefined && id != undefined){
        try{ alarms[id].deactivate() }catch(TypeError){}
        alarms.splice(id,1,new Alarm(new Date().getTime(),target_time,activation))
        
        persist_state()
        
        console.log("%s | %d seconds until alarm",time(),alarms[id].ms_to_wait/1000)
        res.sendStatus(201)
    }
}

function activation(){
    console.log("%s | alarm",time())
    if(settings.usewleds){
        for(const led of settings.wleds){
            WLED.activate(led)
        }
    }

    if(settings.useblinds){
        Blinds.open(settings.blinds_port)
    }

    if(settings.useaudio){
        Audio.play(settings.audio)
    }
}

function time(){
    return new Date().toTimeString().substring(0,8)
}

function start_webserver(server,port){
    return server.listen(port, function() {
        console.info("%s | server listening at http://%s:%s",time(),ip.address(), port)
    })
}