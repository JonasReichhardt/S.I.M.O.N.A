<script setup>
import { ref, onMounted } from "vue"
import Alarm from './components/Alarm.vue'

const alarms = ref(0)

async function fetchData() {
  const res = await fetch('http://localhost:8083/alarms',{method: 'get',
    headers: {
      'content-type': 'application/json'
    }})
  if (!res.ok) {
    alert(res.statusText)
  }
  alarms.value = await res.json().alarms
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <h1>S.I.M.O.N.A</h1>
  <h2>Since I make over nights already</h2>

  <div >
    <Alarm v-for="alarm of alarms" :key="alarm.name"></Alarm>
  </div>
</template>

<style scoped></style>
