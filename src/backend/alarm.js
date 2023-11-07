export default class Alarm {
    id
    target_method
    #timeout
    target_time
    #ms_to_wait
    isActive
    name
    wled

    constructor(target_time, target_method, id, name, wled) {
        this.target_method = target_method
        this.target_time = target_time
        this.isActive = false
        this.name = name
        this.id = id
        this.wled = wled
    }

    deactivate() {
        try {
            clearTimeout(this.#timeout); this.isActive = false;
            console.log("%s | cleared timeout", this.name); return true
        } catch (TypeError) { return false }
    }

    reset_time(new_time) {
        var source_time = new Date().getTime()
        this.target_time = new_time
        this.#ms_to_wait = this.target_time - source_time
        console.log("reseting timer")
        if (this.isActive) {
            this.deactivate()
            this.activate()
        }
    }

    activate() {
        var source_time = new Date().getTime()
        this.#ms_to_wait = this.target_time - source_time
        if (this.#ms_to_wait > 1) {
            console.log("%s | setting timeout for %s minutes", this.name, this.#ms_to_wait / 1000 / 60)
            this.#timeout = setTimeout(this.target_method.bind(this,this), this.#ms_to_wait)
            this.isActive = true
            return true
        }
        return false
    }
}