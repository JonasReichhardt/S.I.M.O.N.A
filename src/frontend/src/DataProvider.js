
export default  class DataProvider {

    static async GetAllAlarms() {
        console.log(import.meta.env.VITE_API_ENDPOINT+'/alarms')
        var res = await fetch(import.meta.env.VITE_API_ENDPOINT+'/alarms')
        if(res.ok){
            var data = await res.json()
            return data
        }
    }

    static async PushAlarm(requestOptions){
        fetch(import.meta.env.VITE_API_ENDPOINT+'alarms', requestOptions)
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
            .then(response => { if (!response.ok) { alert('Error exectuting '+url) } })
    }
}