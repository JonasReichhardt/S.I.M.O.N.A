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
    <div class="div">
        <h4>{{ name }}</h4>
        <input v-model="time_picker" type="time" />
        <button @click="update">Save</button>
        <button v-if="!isActive" @click="activate">Activate</button>
        <div><button v-if="isActive" @click="deactivate">Deactivate</button></div>
    </div>
    <br>
</template>

<style scoped>
h4 {
    font-size: 25px;
}
</style>
