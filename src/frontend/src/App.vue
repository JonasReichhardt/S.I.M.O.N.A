<script setup>
import { ref, onMounted } from "vue"
import Alarm from './components/Alarm.vue'

const alarms = ref(null)
const time_picker = ref('')
const name = ref('')
const index = ref('')

function fetchData() {
  fetch('http://localhost:8083/alarms')
    .then(res=> res.json())
    .then((data) => {
      alarms.value = data.alarms
    })
}

function addAlarm() {
  var t = convertToTargetDateTime()
  var n = name.value
  if (t == undefined || t == null || n == '') {
    return
  }
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ time: t, name: n })
  };
  fetch('http://localhost:8083/alarms', requestOptions)
    .then(response => { if (!response.ok) { alert("Error posting data") }else{fetchData()} })
}

function deleteAlarm(){
  var i = index.value
  if(i>0 || i <= alarms.value.length){
    console.log("delete %d alarm",i)
  } 
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

onMounted(() => {
  fetchData()
})
</script>

<template>
  <h1>S.I.M.O.N.A</h1>
  <h2>Since I make over nights already</h2>

  <div>
    <h3>Overview</h3>
    <Alarm @onDataFetch="fetchData" v-for="a of alarms" :id="a.id" :name="a.name" :targetTime="a.target_time" :isActive="a.isActive"></Alarm>
    <h1 class="error" v-if="alarms == null">API connection failed</h1>
  </div>
  
  <div>
    <h3>Create Alarm</h3>
    <input v-model="name" type="text">
    <input v-model="time_picker" type="time">
    <button @click="addAlarm">+</button>
    <h3>Delete Alarm</h3>
    <p>Index</p><input v-model="index" type="number"/>
    <button @click="deleteAlarm">-</button>
  </div>

</template>

<style scoped>
.error{
  font-size: 40px;
  font-style: italic;
  color: brown;
}

input{
    font-size: 36px;
    width: 180px;
}

button {
    font-size: 36px;
    width: 180px;}
</style>
