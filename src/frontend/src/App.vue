<script setup>
import { ref, onMounted } from "vue"
import Alarm from './components/Alarm.vue'
import DataProvider from './DataProvider'
import TimeHelper from "./TimeHelper";


const alarms = ref([])
const time_picker = ref('')
const name = ref('')
const deleteIndex = ref('')
const triggerIndex = ref('')
const file = ref(null)

function addAlarm() {
  var t = convertToTargetDateTime()
  var n = name.value
  if (t == undefined || t == null || n == undefined || n == '') {
    alert('time or name of the alarm is undefined')
    return
  }
  DataProvider.PushAlarm(t, n)
  fetchData()
}

function deleteAlarm() {
  var i = deleteIndex.value
  if (i > 0 || i <= alarms.value.length) {
    DataProvider.DeleteAlarm(i)
    fetchData()
  }
}

function triggerAlarm(){
  var i = triggerIndex.value
  if (i > 0 || i <= alarms.value.length) {
    DataProvider.TriggerAlarm(i)
  }
}

function convertToTargetDateTime() {
  if (time_picker.value == '') { return }
  return TimeHelper.ConvertToTimestamp(time_picker.value)
}

function fetchData() {
  DataProvider.GetAllAlarmsPromise().then(res => res.json())
    .then((data) => {
      alarms.value = data.alarms
    })
}

onMounted(() => {
  fetchData()
})

function onFileChanged(event) {
  file.value = event.target.files[0]
}

function uploadFile() {
  DataProvider.UploadAudio(file.value)
}
</script>

<template>
  <h1>S.I.M.O.N.A</h1>
  <h2>Since I make over nights already</h2>

  <div>
    <h3>Overview</h3>
    <Alarm @onDataFetch="fetchData" v-for="a of alarms" :id="a.id" :name="a.name" :targetTime="a.target_time"
      :isActive="a.isActive" />
    <h1 class="error" v-if="alarms.length == 0">Loading data</h1>
  </div>

  <div>
    <div>
      <h3>Create alarm</h3>
      <input v-model="name" type="text">
      <input v-model="time_picker" type="time">
      <button @click="addAlarm">+</button>
    </div>
    <div>
      <h3>Delete alarm</h3>
      <p>Index</p><input v-model="deleteIndex" type="number" />
      <button @click="deleteAlarm">-</button>
    </div>
    <div>
      <h3>Upload alarm sound</h3>
      <input type="file" @change="onFileChanged($event)" accept="audio/*" capture />
      <button @click="uploadFile">Upload</button>
    </div>
    <div>
      <h3>Trigger alarm</h3>
      <p>Index</p><input v-model="triggerIndex" type="number" />
      <button @click="triggerAlarm">Trigger</button>
    </div>
  </div>
</template>

<style scoped>
.error {
  font-size: 40px;
  font-style: italic;
  color: brown;
}

input[time] {
  font-size: 36px;
  width: 180px;
}

button {
  font-size: 36px;
  width: 180px;
}
</style>
