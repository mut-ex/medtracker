<template>
  <DailySchedule/>
</template>

<script>
import DailySchedule from './components/DailySchedule.vue'

export default {
  name: 'App',
  components: {
    DailySchedule
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
  margin-top: 32px;
}
</style>
