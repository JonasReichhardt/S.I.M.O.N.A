import fetch from 'node-fetch'
import fs from 'fs'

export default class WLED {
    static get CONFIG_PATH() {return './integrations/wled.json'}

    static async activate(ip,preset=undefined) {
        var data = fs.readFileSync(this.CONFIG_PATH, 'utf8', (err) => {
            if (err) {
                console.error(err)
            }
        })
        var body = JSON.parse(data)

        if(preset != undefined || preset != null){
            console.log('overwriting %s with %s',body.ps,preset)
            body.ps = preset
        }

        try {
            await fetch('http://' + ip + '/json', {
                method: 'post',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(res => res.json())
                .then((body) => {
                    if (!body.success) { 
                        console.error('%s lights could not be turned on', ip) 
                    }
                });
        } catch {
            console.error('%s could not be reached', ip)
            return
        }
    }
}
