export default class TimeHelper{

    // converts a time string (e.g HH:MM) to a UNIX timestamp
    static ConvertToTimestamp(timeString){
        const delimiter_index = timeString.indexOf(':')
        const hour = parseInt(timeString.substring(0, delimiter_index + 1))
        const minute = parseInt(timeString.substring(delimiter_index + 1))

        var target_date = new Date()
        target_date.setHours(hour)
        target_date.setMinutes(minute)
        target_date.setSeconds(0)

        var target_timestamp = target_date.getTime()

        // add a day if selected time is in the past
        if (target_timestamp < new Date().getTime()) {
          return target_timestamp + 86400000
        }

        return target_timestamp
    }

    // converts UNIX timestamp in following formated string HH:MM
    static ConvertToTimeString(timestamp){
        var date = new Date(timestamp)
        var str = ''
        if (date.getHours() < 10) {
            str = str + '0' + date.getHours()
        } else {
            str = date.getHours()
        }
        str = str + ':'
        if (date.getMinutes() < 10) {
            str = str + '0' + date.getMinutes()
        } else {
            str = str + date.getMinutes()
        }
        return str
    }


}