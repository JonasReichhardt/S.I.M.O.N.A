import fetch from 'node-fetch'
import fs from 'fs'

export default class WLED{
    static async activate(ip){
        var body
        fs.readFile('wled.json', 'utf8',(err,data)=>{
            if(err){
                console.error(err)
            }
            body = JSON.parse(data)
        })
        try{
            var response = await fetch('http://'+ip+'/json/state', {
                method: 'post',
                body: body,
                headers: {'Content-Type': 'application/json'}
            });
        }catch{
            console.log('%s could not be reached',ip)
            return
        }

        if(response.ok){
            console.log('%s on',ip)
        }else{
            console.log('%s could not turned on',ip)
        }
    }
}
