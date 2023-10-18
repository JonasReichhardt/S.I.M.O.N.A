
export default  class DataProvider {

    static GetAllAlarmsPromise() {
        return fetch(import.meta.env.VITE_API_ENDPOINT+'/alarms')
    }

    static async GetAllAlarms(){
        var res = await this.GetAllAlarmsPromise()
        return (await res.json()).alarms
    }

    static async PushAlarm(time,name){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ time: time, name: name })
          };
        fetch(import.meta.env.VITE_API_ENDPOINT+'/alarms', requestOptions)
        .then(response => { if (!response.ok) { alert("Error posting alarm") }})
    }

    static async UpdateAlarm(target_date,id,name){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ time: target_date, id: id, name: name })
        }
        fetch(import.meta.env.VITE_API_ENDPOINT+'/alarms', requestOptions)
        .then(response => { if (!response.ok) { alert("Error updating alarm") } })
    }

    static async ChangeAlarmState(state,id){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        }

        var url = import.meta.env.VITE_API_ENDPOINT+'/'
        
        if(state == 1){
            url = url + 'activate'
        }else{
            url = url + 'deactivate'
        }

        fetch(url, requestOptions)
            .then(response => { if (!response.ok) { alert('Error executing '+url) } })
    }

    static DeleteAlarm(index){
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index: index })
        }
        fetch(import.meta.env.VITE_API_ENDPOINT+'/alarms', requestOptions)
            .then(response => { if (!response.ok) { alert('Error deleting alarm') } })
    }

    static UploadAudio(file){
        var body = new FormData()
        body.append('audio',file)
        const requestOptions = {
            method: 'POST',
            body: body
        }
        fetch(import.meta.env.VITE_API_ENDPOINT+'/audio', requestOptions)
            .then(response => { if (!response.ok) { alert('Error uploding file') } })
    }
}