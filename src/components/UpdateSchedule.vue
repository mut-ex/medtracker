<script setup>
// import { ref } from 'vue'


// var schedule = ref([{
//   id: 1, time_of_day: "8:00 AM", pills: [{ id: 1, name: "Gabapentin", dose: "300mg", taken: false }, { id: 2, name: "Glyburide", dose: "600mg", taken: false }] }])

</script>

<template>
  <h1>Prescription List & Schedule</h1>
  <div class="container">
    <div class="record">
      <div class="name">Glyburide</div>
      <div class="dose">300mg</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin: 12px;
  margin-bottom: 32px;
}

.record {
  border-radius: 18px;
  margin: 16px;
  display: flex;
  flex-direction: row;
  background-color: #d0f4de;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 3px 5px;
  padding: 16px;
}
</style>