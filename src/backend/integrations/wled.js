import fetch from 'node-fetch'
import fs from 'fs'

export default class WLED {
    static get CONFIG_PATH() {return './integrations/wled.json'}

    static async activate(ip) {
        var data = fs.readFileSync(this.CONFIG_PATH, 'utf8', (err) => {
            if (err) {
                console.error(err)
            }
        })
        var body = JSON.stringify(JSON.parse(data))

        try {
            await fetch('http://' + ip + '/json', {
                method: 'post',
                body: body,
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
