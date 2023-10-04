<script setup>
import { ref, onMounted } from "vue"
import Alarm from './components/Alarm.vue'

const alarm_count = ref(0)

async function fetchData() {
  const res = await fetch('http://localhost:8083/alarms',{method: 'get',
    headers: {
      'content-type': 'application/json'
    }})
  if (!res.ok) {
    alert(res.statusText)
  }
  alarm_count.value = await res.json().size
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <h1>S.I.M.O.N.A</h1>
  <h2>Since I make over nights already</h2>

  <div v-for="alarm of alarm_count">
    <Alarm></Alarm>
  </div>
</template>

<style scoped></style>
