import child_process from 'child_process'
import process from 'process';
import fs from 'fs'
import path from 'path';

export default class Audio {
    static get CONFIG_PATH() {return './integrations/audio.json'}

    static async play(storage,file) {
        execute_command(load_command() + ' ' + path.join(storage,file))
    }
}

function execute_command(command){
    child_process.exec(command, (error, stdout, stderr) => {
        if (error) { console.error(error.message); return }
        if (stderr) { console.error(stderr); return }
    })
}

function load_command(){
    var data = fs.readFileSync(Audio.CONFIG_PATH, 'utf8', (err) => {
        if (err) { console.error(err) }
    })

    var json = JSON.parse(data)
    var command = ''
    if (process.platform === 'win32'){
        command = json.win32.command
    }else{
        command = json.posix.command
    }
    return command
}