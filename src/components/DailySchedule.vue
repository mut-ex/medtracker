<template>
  <VueSidePanel v-model="isOpened" lock-scroll rerender side="bottom" height="50%" panel-color="#ffd670">
    <div class="confirmation-popup">
      <div class="confirmation-text">Have you taken <b>{{ med_name }}</b>?</div>
      <div class="confirmation-button-container">
        <div class="confirmation-button confirmation-button-yes" @click="setYes()"><img src="../assets/thumbs-up.svg"
            alt="My Happy SVG" />
        </div>
        <div class="confirmation-button confirmation-button-no" @click="setNo()"><img src="../assets/thumbs-down.svg"
            alt="My Happy SVG" />
        </div>
      </div>

    </div>

  </VueSidePanel>
  <h1>Daily Schedule</h1>
  <div class="card">
    <div class="schedule">
      <div class="time-slot">8:00 <span style="opacity: 0.75;">AM</span></div>
      <div class="pill-container">
        <div class="pill-card" :class="{
          'bg-yellow': med.name == 'Gabapentin',
          'bg-blue': med.name == 'Glyburide',
          'pill-taken': med.taken == true
        }" v-for="med in meds" :key="med.id" @click="setDone(med)">
          <div class="pill-icon">
            <img v-if="med.name == 'Metamucil'" src="../assets/poop.svg" :alt="med.name" />
            <img v-if="med.name == 'Gabapentin'" src="../assets/pill.svg" :alt="med.name" />
            <img v-if="med.name == 'Glyburide'" src="../assets/pill2.svg" :alt="med.name" />
          </div>
          <div class="pill-details">
            <div class="pill-name">{{ med.name }}</div>
            <div class="pill-dose">{{ med.dose }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="schedule">
      <div class="time-slot">3:00 <span style="opacity: 0.75;">PM</span></div>
      <div class="pill-container">
        <div class="pill-card" :class="{
          'bg-yellow': med.name == 'Gabapentin',
          'bg-blue': med.name == 'Glyburide',
          'bg-orange': med.name == 'Metamucil',
          'pill-taken': med.taken == true
        }" v-for="med in meds_3pm" :key="med.id" @click="setDone(med)">
          <div class="pill-icon">
            <img v-if="med.name == 'Metamucil'" src="../assets/poop.svg" :alt="med.name" />
            <img v-if="med.name == 'Gabapentin'" src="../assets/pill.svg" :alt="med.name" />
            <img v-if="med.name == 'Glyburide'" src="../assets/pill2.svg" :alt="med.name" />
          </div>
          <div class="pill-details">
            <div class="pill-name">{{ med.name }}</div>
            <div class="pill-dose">{{ med.dose }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="schedule">
      <div class="time-slot">8:00 <span style="opacity: 0.75;">PM</span></div>
      <div class="pill-container">
        <div class="pill-card" :class="{
          'bg-yellow': med.name == 'Gabapentin',
          'bg-blue': med.name == 'Glyburide',
          'bg-orange': med.name == 'Metamucil',
          'pill-taken': med.taken == true
        }" v-for="med in meds_8pm" :key="med.id" @click="setDone(med)">
          <div class="pill-icon">
            <img v-if="med.name == 'Metamucil'" src="../assets/poop.svg" :alt="med.name" />
            <img v-if="med.name == 'Gabapentin'" src="../assets/pill.svg" :alt="med.name" />
            <img v-if="med.name == 'Glyburide'" src="../assets/pill2.svg" :alt="med.name" />
          </div>
          <div class="pill-details">
            <div class="pill-name">{{ med.name }}</div>
            <div class="pill-dose">{{ med.dose }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
var isOpened = ref(false)
var med_name = ref("none")
var curr_med = ref("none")
var meds = ref([{ id: 1, name: "Gabapentin", dose: "300mg", taken: false }, { id: 2, name: "Glyburide", dose: "600mg", taken: false }])

var meds_3pm = ref([{ id: 1, name: "Metamucil", dose: "11.3", taken: false }])

var meds_8pm = ref([{ id: 1, name: "Glyburide", dose: "300mg", taken: false, }])
// export default defineComponent({
//   setup() {
//     return {
//       isOpened: ref(true)
//     }
//   }
// })
function setYes() {
  console.log("YES")
  curr_med.value.taken = true
  isOpened.value = !isOpened.value

}

function setNo() {
  console.log("YES")
  curr_med.value.taken = false
  isOpened.value = !isOpened.value

}
function setDone(med) {
  med_name = med.name
  curr_med.value = med
  isOpened.value = !isOpened.value
  console.log(med_name)
  // set.done = e.target.checked
  // localStorage.setItem(current_lift_id.value, JSON.stringify(days.value[current_day.value].routines[current_exercise.value].sets))
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 700;
  margin-bottom: 32px;
}

.confirmation-popup {
  padding: 32px;
  /* background-color: #ffd670; */
}

.confirmation-text {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: xx-large;
  padding-bottom: 16px;
  color: #2b2d42;
}

.confirmation-button {
  padding: 32px;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin: 16px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: x-large;
  text-align: center;
  border-radius: 32px;
  background-color: #2b2d42;
}

.bg-yellow {
  background-color: #ffd670 !important;
}

.bg-blue {
  background-color: #70d6ff !important;
}

.bg-orange {
  background-color: #ff9770 !important;
}

.confirmation-button-yes {
  /* box-shadow: rgba(189, 224, 254, 1) 0px 1px 4px; */
}

.confirmation-button-no {
  background-color: #e4c1f9;
  background-color: #2b2d42;

}

.confirmation-button-container {
  display: flex;
  flex-direction: row;
}

.pill-card {
  /* border: 1px solid #3d348b; */
  border-radius: 18px;
  margin: 16px;
  display: flex;
  flex-direction: row;
  background-color: #d0f4de;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 3px 5px;
}

/* .pill-card:hover {
  background-color: #3d348b!important;
} */

.pill-taken {
  opacity: 0.5;
}

.pill-icon {
  width: 32px;
  height: 32;
  margin: 16px;
}

.pill-name {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: xx-large;
  font-weight: 700;
  padding-bottom: 4px;
}

.pill-dose {
  font-size: x-large;
}

.pill-details {
  margin: 16px;
  text-align: left;
}

.pill {
  border-radius: 8px;
  padding: 12px;
  margin: 12px;
  font-weight: 600;
  font-size: 1.33em;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  font-family: 'IBM Plex Sans Condensed', sans-serif;
  display: flex;
}

.pill-open {
  background-color: #3d348b;
}

.pill-name {}

.card {
  border-radius: 4px;
  /* padding: 6px; */
  margin: 12px;
  margin-bottom: 32px;
  /* box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; */
}

.schedule {
  display: flex;
}

.time-slot {
  border-right: 6px solid #ff70a6;
  /* background-color: #f3722c; */
  /* background-color: #fefefa; */
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  color: #2b2d42;
  flex: 1;
  padding: 12px;
  text-align: right;
  font-size: 1.22em;
  font-weight: 700;
  font-family: 'IBM Plex Sans', sans-serif;
}

.pill-container {
  flex: 8;
  /* border: 1px solid red; */
}


.pill-yellow {
  background-color: #fee440;
  /* border: 1px solid #CBB001; */
}

.pill-blue {
  background-color: #9bb1ff;
  /* border: 1px solid #1F4FFF; */

}

.pill-orange {
  background-color: #ff9770;
  /* border: 1px solid #F54100; */

}


h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
