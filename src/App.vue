
<template>
  
  <!-- <UpdateSchedule/> -->
  <DailySchedule />
</template>

<script>
import DailySchedule from './components/DailySchedule.vue'
// import UpdateSchedule from './components/UpdateSchedule.vue'

export default {
  name: 'App',
  components: {
    DailySchedule,
    // UpdateSchedule
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2b2d42;
  margin-top: 0px;
  background-color: #fefefa;
}

html {
  background-color: #fefefa;
}
</style>
