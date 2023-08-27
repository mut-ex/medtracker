<template>
  <VueSidePanel
    v-model="isOpened"
    lock-scroll
    rerender
    side="bottom"
    height="50%"
    panel-color="#ffd670"
  >
    <div class="confirmation-popup">
      <div class="confirmation-text">
        Have you taken <b>{{ med_name }}</b
        >?
      </div>
      <div class="confirmation-button-container">
        <div
          class="confirmation-button confirmation-button-yes"
          @click="setYes()"
        >
          <img src="../assets/thumbs-up.svg" alt="My Happy SVG" />
        </div>
        <div
          class="confirmation-button confirmation-button-no"
          @click="setNo()"
        >
          <img src="../assets/thumbs-down.svg" alt="My Happy SVG" />
        </div>
      </div>
    </div>
  </VueSidePanel>
  <h1>Daily Schedule</h1>
  <div class="time-slot" v-for="timeslot in schedule" :key="timeslot.id">
    <div class="time-container">
      <!-- <img class="time-icon" src="../assets/sunrise.png" /> -->
      <div class="time-text">
        {{ timeslot.time }}
        <span style="opacity: 0.75">{{ timeslot.am_or_pm }}</span>
      </div>
    </div>
    <div class="pill-container">
      <!-- <div v-for="pill in timeslot.pill_checklist.value" :key="pill.name">
        {{ pill.name }}
      </div> -->
      <div
        :style="{ 'background-color': getPill(pill.name).color }"
        class="pill-card"
        :class="{
          'pill-taken': pill.taken == true,
        }"
        v-for="pill in timeslot.pill_checklist"
        :key="pill.id"
        @click="setDone(timeslot.id, pill.name)"
      >
        <div class="pill-icon">
          <img
            v-if="getPill(pill.name).type == 'capsule'"
            src="../assets/capsule.svg"
            :alt="pill"
          />
          <img
            v-if="getPill(pill.name).type == 'tablet'"
            src="../assets/tablet.svg"
            :alt="pill"
          />
          <img
            v-if="getPill(pill.name).type == 'spray'"
            src="../assets/spray.svg"
            :alt="pill"
          />
        </div>
        <div class="pill-details">
          <div class="pill-name">{{ pill.name }}</div>
          <div class="pill-dose">{{ getPill(pill.name).dose }}</div>
          <div class="row" v-if="pill.taken_at">
            <img class="small-icon" src="../assets/check.png" />
            <div class="pill-takenat" >
              Taken at {{ pill.taken_at }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, reactive } from "vue";

var isOpened = ref(false);
var med_name = ref("none");
var curr_med = ref("none");
var curr_timeslot = ref("none");

var prescriptions = [
  {
    name: "Diltiazem ER (24HR)",
    dose: "180 mg",
    color: "#ADFFFF",
    type: "capsule",
  },
  {
    name: "Gabapentin",
    dose: "300 mg",
    color: "#FFF8AD",
    type: "capsule",
  },
  {
    name: "Glyburide",
    dose: "10 mg",
    color: "#ADE9FF",
    type: "tablet",
  },
  {
    name: "Metformin",
    dose: "2 × 500 mg",
    color: "#F2F3F4",
    type: "tablet",
  },
  {
    name: "Eplerenone",
    dose: "50 mg",
    color: "#FFE0AD",
    type: "tablet",
  },
  {
    name: "Omeprazole",
    dose: "40 mg",
    color: "#DFDAFB",
    type: "capsule",
  },
  {
    name: "Warfarin",
    dose: "?? mg",
    color: "#B6FFAD",
    type: "tablet",
  },
  {
    name: "Advair",
    dose: "500/50 mcg",
    color: "#EFD6FF",
    type: "spray",
  },
  {
    name: "Triamterene-Hydrochlorothiazide",
    dose: "37.5/25 mg",
    color: "#ADFFE4",
    type: "tablet",
  },
  {
    name: "Fluticasone",
    dose: "27.5 mcg",
    color: "#FFADAD",
    type: "spray",
  },
  {
    name: "Vitamin D3",
    dose: "5000 IU",
    color: "#D9FFAD",
    type: "capsule",
  },
  {
    name: "Centrum Ultra Men's Vitamin",
    dose: "5000 IU",
    color: "#ADD5FF",
    type: "tablet",
  },
];

var schedule = [
  {
    id: 1,
    time: "8:00",
    am_or_pm: "AM",
    pill_checklist: [
      { id: 1, name: "Diltiazem ER (24HR)", taken_at: "8:06 AM" },
      { id: 2, name: "Glyburide", taken_at: null },
    ],
  },
  {
    id: 2,
    time: "3:30",
    am_or_pm: "PM",
    pill_checklist: [{ id: 1, name: "Gabapentin", taken_at: null }],
  },
  {
    id: 3,
    time: "8:00",
    am_or_pm: "PM",
    pills: ["Diltiazem ER (24HR)"],
    pill_checklist: [{ id: 1, name: "Diltiazem ER (24HR)", taken_at: null }],
  },
];

var rx_log = ref(JSON.parse(localStorage.getItem("rx_log")) || []);

function getPill(pill) {
  // console.log("Pill: " + pill)
  return prescriptions.find((p) => p.name == pill);
}

var curr_schedule = ref([]);

function keyForToday() {
  const date = new Date();
  const rx_log_key =
    String(date.getDate()) +
    "-" +
    String(date.getMonth()) +
    "-" +
    String(date.getFullYear());
  return rx_log_key;
}
// var rx_log = ref([])

// const rx_log_key = keyForToday();
// console.log("rx_log = ");
// console.log(rx_log);

// console.log("rx_log[rx_log_key] = ");
// console.log(rx_log[rx_log_key]);

// if (typeof rx_log[rx_log_key] === "undefined") {
//   rx_log[rx_log_key] = schedule;
//   console.log("New entry created for today");
//   rx_log[rx_log_key].forEach((timeslot) => {
//     timeslot.pills.forEach((pill) => {
//       console.log(timeslot["pill_checklist"]);
//       timeslot["pill_checklist"].push({ name: pill, taken: false, taken_at: null });
//     });
//   });
// } else {
//   console.log("Entry for today already exists");
//   schedule = rx_log[rx_log_key];
// }
// console.log("rx_log[rx_log_key] => ");
// console.log(rx_log[rx_log_key]);
// console.log(schedule);

// // var rx_log_today = rx_log[rx_log_key];
// console.log("rx_log =>");

// console.log(rx_log);
// localStorage.setItem("rx_log", JSON.stringify(rx_log));
// onBeforeMount(() => {
//   console.log("Before mount!");
//   schedule = rx_log[rx_log_key];
//   console.log(schedule);
// });

function currTime() {
  const date = new Date();
  var curr_hour = date.getHours();
  var am_pm = "AM";
  if (curr_hour > 12) {
    curr_hour = curr_hour - 12;
    am_pm = "PM";
  }
  return String(curr_hour) + ":" + String(date.getMinutes()) + am_pm;
}

function setYes() {
  console.log("YES -> " + curr_med.value.taken);
  curr_med.value.taken = true;
  console.log(currTime());
  curr_med.value.taken_at = currTime();
  isOpened.value = !isOpened.value;
  localStorage.setItem("rx_log", JSON.stringify(rx_log));
}

function setNo() {
  console.log("NO");
  curr_med.value.taken = false;
  isOpened.value = !isOpened.value;
}
function setDone(timeslot, pill) {
  console.log("TimeSlot: " + timeslot);
  console.log("Pill: " + pill);
  isOpened.value = !isOpened.value;
  med_name = pill;
  curr_timeslot.value = schedule.value.find((t) => t.id == timeslot);
  // console.log(curr_timeslot.value.pill_checklist.find(p => p.name == pill))
  curr_med.value = curr_timeslot.value.pill_checklist.find(
    (p) => p.name == pill
  );
  // curr_med = curr_timeslot.value.pill_checklist.find(p => p.name == pill)
  // set.done = e.target.checked
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1 {
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 700;
  margin-bottom: 32px;
}

.confirmation-popup {
  padding: 32px;
  /* background-color: #ffd670; */
}

.confirmation-text {
  font-family: "IBM Plex Sans", sans-serif;
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
  font-family: "IBM Plex Sans", sans-serif;
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

.bg-gray {
  background-color: #ced4da !important;
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
  /* background-color: #d0f4de; */
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 3px 5px;
  padding-top: 12px;
  padding-bottom: 12px;
}

/* .pill-card:hover {
  background-color: #3d348b!important;
} */

.row {
  border:1px solid #3d348b;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 8px;
  margin-top: 8px;
  justify-content: center;
}

.small-icon {
  margin-right: 4px;
  width: 20px;
  height: 20px;
}

.pill-taken {
  opacity: 0.65;
  background-color: rgb(219, 224, 230) !important;
}

.pill-icon {
  width: 32px;
  height: 32;
  margin: 16px;
}

/* flex-grow: 0; */
.pill-name {
  font-family: "Barlow Semi Condensed", sans-serif;
  font-size: larger;
  font-weight: 600;
  padding-bottom: 4px;
}

.pill-dose {
  font-family: "Barlow", sans-serif;
  font-weight: 500;
  font-size: large;
}

.pill-details {
  /* margin: 16px; */
  text-align: left;
}

.pill-takenat {
  /* margin-top: 8px; */
  font-family: "Barlow", sans-serif;
  font-weight: 600;
  font-size: large;
}

.time-slot {
  /* border-radius: 4px; */
  margin: 12px;
  margin-bottom: 32px;
}

.time-container {
  display: flex;
  align-items: center;
  margin: 16px;
}

.time-icon {
  width: 50px;
  margin: 8px;
}

.time-text {
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 700;
  font-size: xx-large;
}

.time-slot {
  /* display: flex; */
  border-left: 6px solid #ff70a6;
  /* background-color: #f3722c; */
  /* background-color: #fefefa; */
  /* border-radius: 4px; */
  /* border-bottom-left-radius: 4px; */
  color: #2b2d42;
  flex: 1;
  /* padding: 12px; */
  text-align: right;
  font-size: 1.22em;
  font-weight: 700;
  font-family: "IBM Plex Sans", sans-serif;
}

.pill-container {
  /* flex: 8; */
  /* border-top: 2px solid #2b2d42; */
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
