import child_process from 'child_process'
import process from 'process';
import fs from 'fs'
import path from 'path';

const VOLUME_KEY = '[VOLUME]'

export default class Audio {
    static get CONFIG_PATH() {return './integrations/audio.json'}

    static async play(storage,file,volume=0) {
        var command = load_command(volume) + ' ' + path.join(storage,file)
        console.log("executing "+command)
        execute_command(command)
    }
}

function execute_command(command){
    child_process.exec(command, (error, stdout, stderr) => {
        if (error) { console.error(error.message); return }
    })
}

function load_command(volume){
    var data = fs.readFileSync(Audio.CONFIG_PATH, 'utf8', (err) => {
        if (err) { console.error(err) }
    })

    var json = JSON.parse(data)
    var command = ''
    if (process.platform === 'win32'){
        command = json.win32.command
    }else{
        // volume setting is only used on posix OS
        command = json.posix.command
        if(command.includes(VOLUME_KEY) && volume > 0){
            command = command.replace(VOLUME_KEY,volume)
        }
    }
    return command
}