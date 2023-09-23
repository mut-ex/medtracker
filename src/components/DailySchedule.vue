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
        Have you taken <b>{{ curr_med.name }}</b
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
  <div class="day-selector-container">
    <div
      class="day-selector-button"
      :class="{ dimmed: curr_log_idx === 0 }"
      @click="prevDay()"
    >
      <img
        class="day-selector-button-svg"
        src="../assets/chevron_left.svg"
        alt="Previous"
      />
    </div>
    <h1 v-if="rx_log_keys[curr_log_idx] === keyForToday()">Today</h1>
    <h1 v-else>{{ rx_log_keys[curr_log_idx] }}</h1>
    <div
      class="day-selector-button"
      :class="{ dimmed: rx_log_keys[curr_log_idx] === keyForToday() }"
      @click="nextDay()"
    >
      <img
        class="day-selector-button-svg"
        src="../assets/chevron_right.svg"
        alt="Next"
      />
    </div>
  </div>
  <div class="time-slot" v-for="timeslot in curr_log" :key="timeslot.id">
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
        @click="setDone(timeslot.id, pill.id)"
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
          <img
            v-if="getPill(pill.name).type == 'poop'"
            src="../assets/poop.svg"
            :alt="pill"
          />
        </div>
        <div class="pill-details">
          <div class="pill-name">{{ pill.name }}</div>
          <div v-if="pill.name === 'Warfarin'" class="pill-dose">
            {{ getWarfarinDose(rx_log_keys[curr_log_idx]) }}
          </div>
          <div v-else class="pill-dose">{{ getPill(pill.name).dose }}</div>

          <div class="row" v-if="pill.taken_at">
            <img class="small-icon" src="../assets/check.png" />
            <div class="pill-takenat" :class="{ shake: disabled }">
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

var curr_log_idx = ref();
var isOpened = ref(false);
var med_name = ref("none");
var curr_med = ref("none");
var curr_timeslot = ref("none");

function getWarfarinDose(date_stamp) {
  const date = new Date();
  const s = date_stamp.split("-");
  date.setMonth(s[0]);
  date.setDate(s[1]);
  date.setYear(s[2]);
  date.setHours(0);
  date.setMinutes(0);
  date.setMilliseconds(0);
  const day = date.getDay();
  if (day === 2 || day === 4 || day === 6) {
    return "5 mg";
  }
  return "7.5 mg";
}

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
    name: "Centrum Ultra Men's Multivitamin",
    dose: "5000 IU",
    color: "#ADD5FF",
    type: "tablet",
  },
  {
    name: "Metamucil",
    dose: "2 × rounded TSP",
    color: "#FFE0AD",
    type: "poop",
  },
  {
    name: "Lisinopril",
    dose: "40 mg",
    color: "#FFE0AD",
    type: "tablet",
  },
  {
    name: "Cholestyramine Light",
    dose: "4 g",
    color: "#FFE0AD",
    type: "tablet",
  },
];

var empty_log = [
  {
    id: 1,
    time: "8:00",
    am_or_pm: "AM",
    pill_checklist: [
      { id: 1, name: "Advair", taken_at: null },
      { id: 2, name: "Centrum Ultra Men's Multivitamin", taken_at: null },
      { id: 3, name: "Diltiazem ER (24HR)", taken_at: null },
      { id: 4, name: "Eplerenone", taken_at: null },
      { id: 5, name: "Fluticasone", taken_at: null },
      { id: 6, name: "Gabapentin", taken_at: null },
      { id: 7, name: "Glyburide", taken_at: null },
      { id: 8, name: "Metformin", taken_at: null },
      { id: 9, name: "Omeprazole", taken_at: null },
      { id: 10, name: "Triamterene-Hydrochlorothiazide", taken_at: null },
      { id: 11, name: "Vitamin D3", taken_at: null },
      { id: 12, name: "Warfarin", taken_at: null },
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
    time: "4:30",
    am_or_pm: "PM",
    pill_checklist: [{ id: 1, name: "Metamucil", taken_at: null }],
  },
  {
    id: 4,
    time: "Dinner",
    am_or_pm: null,
    pill_checklist: [{ id: 1, name: "Glyburide", taken_at: null }],
  },
  {
    id: 5,
    time: "8:00",
    am_or_pm: "PM",
    pill_checklist: [
      { id: 1, name: "Advair", taken_at: null },
      { id: 2, name: "Diltiazem ER (24HR)", taken_at: null },
      { id: 3, name: "Lisinopril", taken_at: null },
      { id: 4, name: "Metformin", taken_at: null },
    ],
  },
  {
    id: 6,
    time: "11:30",
    am_or_pm: "PM",
    pill_checklist: [{ id: 1, name: "Gabapentin", taken_at: null }],
  },
  {
    id: 7,
    time: "12:00",
    am_or_pm: "AM",
    pill_checklist: [{ id: 1, name: "Cholestyramine Light", taken_at: null }],
  },
];

var dummy_log_a = [
  {
    id: 1,
    time: "8:00",
    am_or_pm: "AM",
    pill_checklist: [
      { id: 1, name: "Diltiazem ER (24HR)", taken_at: "8:00 AM" },
      { id: 2, name: "Glyburide", taken_at: "8:10 AM" },
    ],
  },
  {
    id: 2,
    time: "3:30",
    am_or_pm: "PM",
    pill_checklist: [{ id: 1, name: "Gabapentin", taken_at: "4:00 PM" }],
  },
  {
    id: 3,
    time: "8:00",
    am_or_pm: "PM",
    pills: ["Diltiazem ER (24HR)"],
    pill_checklist: [
      { id: 1, name: "Diltiazem ER (24HR)", taken_at: "8:00 PM" },
    ],
  },
];

var dummy_log_b = [
  {
    id: 1,
    time: "8:00",
    am_or_pm: "AM",
    pill_checklist: [
      { id: 1, name: "Diltiazem ER (24HR)", taken_at: "8:00 AM" },
      { id: 2, name: "Glyburide", taken_at: "8:11 AM" },
    ],
  },
  {
    id: 2,
    time: "3:30",
    am_or_pm: "PM",
    pill_checklist: [{ id: 1, name: "Gabapentin", taken_at: "4:10 PM" }],
  },
  {
    id: 3,
    time: "8:00",
    am_or_pm: "PM",
    pills: ["Diltiazem ER (24HR)"],
    pill_checklist: [
      { id: 1, name: "Diltiazem ER (24HR)", taken_at: "8:20 PM" },
    ],
  },
];

function getPill(pill) {
  // console.log("Pill: " + pill)
  return prescriptions.find((p) => p.name == pill);
}
// var rx_log = ref(JSON.parse(localStorage.getItem("rx_log")) || []);

var rx_log_history = ref([
  // { date: "20-8-2023", data: dummy_log_a },
  // { date: "21-8-2023", data: dummy_log_b },
]);
rx_log_history.value.push({ date: "22-8-2023", data: empty_log });

var rx_log_keys = [];
rx_log_history.value.forEach((day) => {
  console.log(day.date);
  rx_log_keys.push(day.date);
});
curr_log_idx.value = rx_log_keys.length - 1;
console.log(rx_log_keys);
console.log(rx_log_keys.length);

var curr_log = ref();
curr_log.value = rx_log_history.value[curr_log_idx.value].data;
console.log(rx_log_history.value[curr_log_idx.value].data);

// console.log("date_keys = "+date_keys)
// console.log(date_keys.indexOf("22-8-2023"))

function prevDay() {
  if (curr_log_idx.value === 0) {
    console.log("Already at oldest record!");
    return;
  }
  curr_log_idx.value = curr_log_idx.value - 1;
  curr_log.value = rx_log_history.value[curr_log_idx.value].data;
}

function nextDay() {
  if (curr_log_idx.value === rx_log_keys.length - 1) {
    console.log("Already at latest record!");
    return;
  }
  curr_log_idx.value = curr_log_idx.value + 1;
  curr_log.value = rx_log_history.value[curr_log_idx.value].data;
}

console.log("todays key: " + keyForToday());
// active_date.value = keyForToday()
function keyForToday() {
  const date = new Date();
  const rx_log_history_key =
    String(date.getDate()) +
    "-" +
    String(date.getMonth()) +
    "-" +
    String(date.getFullYear());
  return rx_log_history_key;
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
  var am_pm = " AM";
  if (curr_hour > 12) {
    curr_hour = curr_hour - 12;
    am_pm = " PM";
  }
  return String(curr_hour) + ":" + String(date.getMinutes()) + am_pm;
}
// const disabled = ref(false)
function setYes() {
  console.log("YES -> " + curr_med.value.taken_at);
  curr_med.value.taken_at = currTime();
  console.log(curr_med.value.taken_at);
  isOpened.value = !isOpened.value;
  // disabled.value = true
  // setTimeout(() => {
  //   disabled.value = false
  // }, 1500)
  // localStorage.setItem("rx_log", JSON.stringify(rx_log));
}

function setNo() {
  console.log("No -> " + curr_med.value.taken_at);
  curr_med.value.taken_at = null;
  console.log(curr_med.value.taken_at);
  isOpened.value = !isOpened.value;
}
function setDone(timeslot, pill) {
  console.log(timeslot);
  console.log(pill);

  isOpened.value = !isOpened.value;
  curr_med.value = empty_log
    .find((t) => t.id == timeslot)
    .pill_checklist.find((p) => p.id == pill);
  // curr_med.value = schedule.find((t) => t.id == timeslot).find((p) => p.id == pill)
  // med_name.value = schedule[timeslot][pill].name;
  console.log(curr_med.value);
  // curr_timeslot.value = schedule.value.find((t) => t.id == timeslot);
  // console.log(curr_timeslot.value.pill_checklist.find(p => p.name == pill))
  // curr_med.value = curr_timeslot.value.pill_checklist.find(
  // (p) => p.name == pill
  // );
  // curr_med = curr_timeslot.value.pill_checklist.find(p => p.name == pill)
  // set.done = e.target.checked
}

// const more_new = computed(() => {
//   return author.books.length > 0 ? 'Yes' : 'No'
// })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

h1 {
  font-family: "Barlow", sans-serif;
  font-weight: 700;
  margin-bottom: 32px;
}

.day-selector-button {
  background-color: #42b983;
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 64px;
}

.dimmed {
  background-color: #a8a8a8;
}

.day-selector-button-svg {
  width: 80%;
  height: 80%;
}

.day-selector-container {
  border: 1px solid black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
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
  border: 1px solid #3d348b;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 8px;
  margin-top: 8px;
  justify-content: center;
  /* height: 0; */
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
