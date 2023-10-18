<script setup>
import { ref, onMounted } from 'vue'
import DataProvider from '../DataProvider';
import TimeHelper from '../TimeHelper';
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
    DataProvider.UpdateAlarm(target_date, alarm.id, alarm.name)
}

function activate() {
    if (!alarm.isActive) {
        DataProvider.ChangeAlarmState(1, alarm.id)
        emit('onDataFetch')
    }
}

function deactivate() {
    if (alarm.isActive) {
        DataProvider.ChangeAlarmState(0, alarm.id)
        emit('onDataFetch')
    }
}

function convertFromTargetDateTime() {
    var t = TimeHelper.ConvertToTimeString(alarm.targetTime)
    time_picker.value = t 
}

function convertToTargetDateTime() {
    if (time_picker.value == '') { return }
    return TimeHelper.ConvertToTimestamp(time_picker.value)
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
    width: 150px;
}
</style>
