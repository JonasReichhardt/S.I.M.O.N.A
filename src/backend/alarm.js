export default class Alarm{
    #source_time
    #target_time
    #target_method
    #timeout

    ms_to_wait

    constructor(source_time,target_time, target_method){
        this.#source_time = source_time
        this.#target_time = target_time
        this.#target_method = target_method
        this.ms_to_wait = target_time - source_time
        this.#timeout = setTimeout(target_method,this.ms_to_wait)
    }

    deactivate(){
        clearTimeout(this.timeout)
    }
}