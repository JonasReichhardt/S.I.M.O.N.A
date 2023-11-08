<script setup>
import { ref, onMounted } from "vue"
import AlarmElement from './components/AlarmElement.vue'
import DataProvider from './DataProvider'
import TimeHelper from "./TimeHelper";
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';


const alarms = ref([])
const time_picker = ref('')
const name = ref('')
const deleteIndex = ref('')
const triggerIndex = ref('')
const file = ref(null)
const wled_preset = ref(null)

function addAlarm() {
  var t = convertToTargetDateTime()
  var n = name.value
  if (t == undefined || t == null || n == undefined || n == '') {
    alert('time or name of the alarm is undefined')
    return
  }
  DataProvider.PushAlarm(t, n, wled_preset.value)
  fetchData()
}

function deleteAlarm() {
  var i = deleteIndex.value
  if (i > 0 || i <= alarms.value.length) {
    DataProvider.DeleteAlarm(i)
    fetchData()
  }
}

function triggerAlarm() {
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
  <div>
    <h1>S.I.M.O.N.A</h1>
    <h2>Since I make over nights already</h2>
    <br>
    <carousel>
      <slide :index="1">
        <div>
          <AlarmElement @onDataFetch="fetchData" v-for="a of alarms" :id="a.id" :name="a.name" :targetTime="a.target_time"
            :isActive="a.isActive" v-bind:key="a" />
          <h1 class="error" v-if="alarms.length == 0">No data</h1>
        </div>
      </slide>
      <slide :index="2">
        <div>
          <div class="div">
            <h3>Create alarm</h3>
            <div id="parent">
              <div id="wide">Name<br><input v-model="name" type="text"></div>
              <div id="wide">LED preset<input v-model="wled_preset" type="number"></div><br>
            </div>
            <div>Time<br><input v-model="time_picker" type="time"><br></div>
            <button class="btn" @click="addAlarm">+</button>
          </div>
          <br>
          <div class="div">
            <h3>Delete alarm</h3>
            <p>Index</p><input v-model="deleteIndex" type="number" /><br>
            <button class="btn" @click="deleteAlarm">-</button>
          </div>
        </div>
      </slide>
      <slide :index="3">
        <div>
        <div class="div">
          <h3>Trigger alarm</h3>
          <p>Index</p><input v-model="triggerIndex" type="number" /><br>
          <button class="btn" @click="triggerAlarm">Trigger</button>
        </div><br>
        <div class="div">
          <h3>Upload alarm sound</h3>
          <input class="file" type="file" @change="onFileChanged($event)" accept="audio/*" capture /><br>
          <button class="btn" @click="uploadFile">Upload</button>
        </div>
      </div>
      </slide>
    </carousel>
  </div>
</template>

<style scoped>
.error {
  font-size: 40px;
  font-style: italic;
  color: brown;
}

#parent {
  display: flex;
}

#wide {
  flex: 1;
}

.file {
  width: 200px;
  font-size: 25px;
  border-radius: 0px;
}

.btn {
  margin-top: 10px;
}
</style>
