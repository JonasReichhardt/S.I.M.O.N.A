<script setup>
import { ref, onMounted, onActivated } from 'vue'
const time_picker = ref('')
const alarm = defineProps(['id', 'name', 'targetTime', 'isActive'])
const emit = defineEmits(['onDataFetch'])

onMounted(() => {
    convertFromTargetDateTime()
})

function update(event) {
    const target_date = convertToTargetDateTime()

    if (target_date == undefined) {
        return
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: target_date, id: alarm.id, name: alarm.name })
    };
    fetch('http://localhost:8083/alarms', requestOptions)
        .then(response => { if (!response.ok) { alert("Error updating alarm") } })
}

function activate() {
    if (!alarm.isActive) {
        var activation_request_options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: alarm.id })
        };
        fetch('http://localhost:8083/activate', activation_request_options)
            .then(response => { if (!response.ok) { alert("Error activating alarm") } })
        emit('onDataFetch')
    }
}

function deactivate() {
    if (alarm.isActive) {
        var activation_request_options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: alarm.id })
        };
        fetch('http://localhost:8083/deactivate', activation_request_options)
            .then(response => { if (!response.ok) { alert("Error deactivating alarm") } })
        emit('onDataFetch')
    }
}

function convertFromTargetDateTime() {
    var date = new Date(alarm.targetTime)
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
    time_picker.value = str
}

function convertToTargetDateTime() {
    if (time_picker.value == '') { return }
    var current_date = new Date()
    var delimiter_index = time_picker.value.indexOf(':')

    var hour = parseInt(time_picker.value.substring(0, delimiter_index + 1))
    var minute = parseInt(time_picker.value.substring(delimiter_index + 1))

    current_date.setHours(hour)
    current_date.setMinutes(minute)
    current_date.setSeconds(0)

    var target_date = current_date
    if(current_date.getTime() < new Date().getTime()){
        target_date = new Date(current_date.getTime() + 86400000)
    }

    return target_date.getTime()
}
</script>

<template>
    <div>
        <h4>{{ name }}</h4>
        <input v-model="time_picker" type="time" />
        <button @click="update">Save</button>
        <button v-if="!isActive" @click="activate">Activate</button>
        <button v-if="isActive" @click="deactivate">Deactivate</button>
    </div>
</template>

<style scoped>
div {
    background-color: coral;
    border-style: dashed;
}

input[type=time] {
    font-size: 36px;
    width: 180px;
}

h4 {
    font-size: 25px;
}

button {
    font-size: 36px;
    width: 180px;
}
</style>
