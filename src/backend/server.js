import express from 'express'
import cors from 'cors'
import fs from 'fs'
import ip from 'ip'
import Alarm from './alarm.js'

main()

var alarms = []

async function main(){
    var settings = load_app_settings()

    var server = init_webserver();

    activation()

    start_webserver(server, settings.port);
}

function load_app_settings(){
    try {
        return JSON.parse(fs.readFileSync('appsettings.json', 'utf8'))
    } catch (err) {
        console.error("ERR| could not load app settings")
        console.error(err)
    }
}

function persist_state(){
    try{
        JSON.stringify()
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

    server.post('/time', (req, res) => {
        var target_time = req.body.time
        var id = req.body.id

        if(target_time != undefined && id != undefined){
            try{
                alarms[id].deactivate()
            }catch(TypeError){}
            alarms.splice(id,1,new Alarm(new Date().getTime(),target_time,activation))
            console.log("%s | %d seconds until alarm",time(),alarms[id].ms_to_wait/1000)
            res.sendStatus(201)
        }
    })

    return server
}

function activation(){
    console.log("%s | alarm",time())
}

function time(){
    return new Date().toTimeString().substring(0,8)
}

function start_webserver(server,port){
    return server.listen(port, function() {
        console.info("%s | Server listening at http://%s:%s",time(),ip.address(), port)
    })
}