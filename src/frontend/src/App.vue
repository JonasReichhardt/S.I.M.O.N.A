<script setup>
import { ref, onMounted } from "vue"
import Alarm from './components/Alarm.vue'
import DataProvider from './DataProvider'
import TimeHelper from "./TimeHelper";


const alarms = ref([])
const time_picker = ref('')
const name = ref('')
const index = ref('')

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
  var i = index.value
  if (i > 0 || i <= alarms.value.length) {
    DataProvider.DeleteAlarm(i)
    fetchData()
  }
}

function convertToTargetDateTime() {
  if (time_picker.value == '') { return }
  return TimeHelper.ConvertToTimestamp(time_picker.value)
}

function fetchData() {
  DataProvider.GetAllAlarmsPromise().then(res=> res.json())
    .then((data) => {
      alarms.value = data.alarms
    })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <h1>S.I.M.O.N.A</h1>
  <h2>Since I make over nights already</h2>

  <div>
    <h3>Overview</h3>
    <Alarm @onDataFetch="fetchData" v-for="a of alarms" :id="a.id" :name="a.name"
      :targetTime="a.target_time" :isActive="a.isActive" />
    <h1 class="error" v-if="alarms.length == 0">Loading data</h1>
  </div>

  <div>
    <h3>Create Alarm</h3>
    <input v-model="name" type="text">
    <input v-model="time_picker" type="time">
    <button @click="addAlarm">+</button>
    <h3>Delete Alarm</h3>
    <p>Index</p><input v-model="index" type="number" />
    <button @click="deleteAlarm">-</button>
  </div>
</template>

<style scoped>
.error {
  font-size: 40px;
  font-style: italic;
  color: brown;
}

input {
  font-size: 36px;
  width: 180px;
}

button {
  font-size: 36px;
  width: 180px;
}
</style>
