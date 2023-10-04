export default class Alarm{
    source_time
    target_time
    #target_method
    #timeout

    ms_to_wait
    isActive

    constructor(source_time,target_time, target_method){
        this.source_time = source_time
        this.#target_method = target_method
        this.ms_to_wait = target_time - source_time
        this.target_time = target_time
        this.isActive = false
        this.activate()
    }

    deactivate(){
        clearTimeout(this.timeout)
    }

    activate(){
        this.#timeout = setTimeout(target_method,this.ms_to_wait)
        this.isActive = true
    }
}