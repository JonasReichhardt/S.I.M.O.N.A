<script setup>
  import { ref } from 'vue'
  const t = ref('')

  function send(event){
    const target_date = convertToTargetDateTime()

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time: target_date })
    };
    fetch('http://localhost:8083/time', requestOptions)
      .then(response => console.log(response.status))
  }

  function convertToTargetDateTime(){
    var current_date = new Date()
    var delimiter_index = t.value.indexOf(':')

    var hour = parseInt(t.value.substring(0,delimiter_index+1))
    var minute = parseInt(t.value.substring(delimiter_index+1))

    current_date.setHours(hour)
    current_date.setMinutes(minute)

    return current_date.getTime()
  }
</script>

<template>
  <input v-model="t" type="time"/>

  <button @click="send">Send</button>
</template>

<style scoped>
  input[type=time] {
    font-size: 36px;
    width: 180px;
  }
</style>
