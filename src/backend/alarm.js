export default class Alarm{
    id
    target_method
    #timeout
    target_time
    #ms_to_wait
    isActive
    name
    settings

    constructor(target_time, target_method,id,name){
        this.target_method = target_method
        this.target_time = target_time
        this.isActive = false
        this.name = name
        this.id = id
    }

    deactivate(){
        try { clearTimeout(this.#timeout); this.isActive = false } catch (TypeError) { }
    }

    reset_time(new_time){
        var source_time = new Date().getTime()
        this.target_time = new_time
        this.#ms_to_wait = this.target_time - source_time
        if(this.isActive){
            this.deactivate()
            this.activate()
        }
    }

    activate(){
        var source_time = new Date().getTime()
        this.#ms_to_wait = this.target_time - source_time
        if(this.ms_to_wait > 1){
            this.#timeout = setTimeout(this.target_method,this.ms_to_wait)
            this.isActive = true
        }
    }
}