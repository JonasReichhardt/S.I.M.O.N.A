const express = require('express')
const cors = require('cors')
const fs = require("fs")
const ip =  require('ip')

main()

async function main(){
    var settings = load_app_settings()

    var server = init_webserver();

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

function init_webserver(){
    var server = express()

    server.use(express.json())
    server.use(cors())
    server.use(express.static('../frontend/dist'))

    server.post('/time', (req, res) => {
        var t = req.body.time

        if(t != undefined){
            var cur = new Date().getTime()
            var ms_to_wait = t - cur
            console.log("%s - %s = %s",t,cur,ms_to_wait)
            res.sendStatus(201)
        }
    })

    return server
}

function time(){
    return new Date().toTimeString().substring(0,8)
}

function start_webserver(server,port){
    return server.listen(port, function() {
        console.info("%s | Server listening at http://%s:%s",new Date().getTime(),ip.address(), port)
    })
}