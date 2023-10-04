export default class Alarm{
    target_method
    #timeout

    source_time
    target_time
    ms_to_wait
    isActive
    name

    constructor(target_time, target_method,name){
        this.source_time = new Date().getTime()
        this.target_method = target_method
        this.ms_to_wait = target_time - this.source_time
        this.target_time = target_time
        this.isActive = false
        this.name = name
        this.activate()
    }

    deactivate(){
        try { clearTimeout(this.#timeout) } catch (TypeError) { }
    }

    reset_time(new_time){
        this.source_time = new Date().getTime()
        this.target_time = new_time
        this.ms_to_wait = this.target_time - this.source_time
        this.deactivate()
        this.activate()
    }

    activate(){
        if(this.ms_to_wait > 1){
            this.#timeout = setTimeout(this.target_method,this.ms_to_wait)
            this.isActive = true
        }
    }
}