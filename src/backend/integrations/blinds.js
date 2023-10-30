export default class Blinds{

    static async open(ip){
        await fetch('http://' + ip + '/open').then(res => res.text()).then((body)=>console.log(body))
    }
}