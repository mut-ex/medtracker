<template>
  <VueSidePanel
    v-model="isOpened"
    rerender
    side="bottom"
    panel-color="#ffd670"
    hide-close-btn
    height="400px"
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
    <h1 v-else>{{ prettifyDate(rx_log_keys[curr_log_idx]) }}</h1>
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
      <!-- <div class="triangle"></div> -->
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
          'pill-taken': pill.taken_at !== null,
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
          <img
            v-if="getPill(pill.name).type == 'inhaler'"
            src="../assets/inhaler.svg"
            :alt="pill"
          />
          <img
            v-if="getPill(pill.name).type == 'tablet-round'"
            src="../assets/tablet-round.svg"
            :alt="pill"
          />
          <img
            v-if="getPill(pill.name).type == 'powder'"
            src="../assets/powder.svg"
            :alt="pill"
          />
          <img
            v-if="getPill(pill.name).type == 'tablet-diamond'"
            src="../assets/tablet-diamond.svg"
            :alt="pill"
          />
          <img
            v-if="getPill(pill.name).type == 'tablet-round-2x'"
            src="../assets/tablet-round-2x.svg"
            :alt="pill"
          />
          <img
            v-if="getPill(pill.name).type == 'tablet-oval'"
            src="../assets/tablet-oval.svg"
            :alt="pill"
          />
        </div>
        <div class="pill-details">
          <div class="pill-name">{{ pill.name }}</div>
          <div v-if="pill.name === 'Warfarin'" class="pill-dose">
            {{ getWarfarinDose(rx_log_keys[curr_log_idx]) }}
          </div>
          <div v-else class="pill-dose">{{ getPill(pill.name).dose }}</div>

          <div v-if="pill.taken_at">
            <div class="pill-taken-at">
              <img class="small-icon" src="../assets/check.png" />
              <div class="pill-taken-at--text">
                Taken at {{ pill.taken_at }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="time-slot-gap"></div> -->
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
    type: "tablet-round-2x",
  },
  {
    name: "Eplerenone",
    dose: "50 mg",
    color: "#FFE0AD",
    type: "tablet-diamond",
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
    type: "tablet-round",
  },
  {
    name: "Advair",
    dose: "500/50 mcg",
    color: "#EFD6FF",
    type: "inhaler",
  },
  {
    name: "Triamterene-Hydrochlorothiazide",
    dose: "37.5/25 mg",
    color: "#ADFFE4",
    type: "tablet-oval",
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
    type: "tablet-round",
  },
  {
    name: "Cholestyramine Light",
    dose: "4 g",
    color: "#FFE0AD",
    type: "powder",
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
// var rx_log_history_dummy = [
//   { date: "9-22-2023", data: dummy_log_a },
//   { date: "9-23-2023", data: dummy_log_b },
// ];
var rx_log_history = ref(
  JSON.parse(localStorage.getItem("rx_log_history")) || [
    { date: keyForToday(), data: empty_log },
  ]
);
var rx_log_keys = [];
rx_log_history.value.forEach((day) => {
  console.log(day.date);
  rx_log_keys.push(day.date);
});
if (!rx_log_keys.includes(keyForToday())) {
  console.log("No key for today!");
  rx_log_history.value.push({ date: keyForToday(), data: empty_log });
  rx_log_keys.push(keyForToday());
}
localStorage.setItem("rx_log_history", JSON.stringify(rx_log_history.value));

curr_log_idx.value = rx_log_keys.length - 1;
var curr_log = ref(rx_log_history.value[curr_log_idx.value].data);

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

function prettifyDate(date_stamp) {
  const date = new Date();
  const s = date_stamp.split("-");
  date.setMonth(s[0] - 1);
  date.setDate(s[1]);
  date.setYear(s[2]);
  date.setHours(0);
  date.setMinutes(0);
  date.setMilliseconds(0);
  const pretty = date.toDateString().split(" ");

  return pretty[0] + ", " + pretty[1] + " " + pretty[2];
}
function keyForToday() {
  const date = new Date();
  const rx_log_history_key =
    String(date.getMonth() + 1) +
    "-" +
    String(date.getDate()) +
    "-" +
    String(date.getFullYear());
  return rx_log_history_key;
}

function currTime() {
  const date = new Date();
  var curr_hour = date.getHours();
  var am_pm = " AM";
  if (curr_hour > 12) {
    curr_hour = curr_hour - 12;
    am_pm = " PM";
  }
  let mins;
  if (date.getMinutes() < 10) mins = "0" + String(date.getMinutes());
  else mins = String(date.getMinutes());
  return String(curr_hour) + ":" + mins + am_pm;
}
// const disabled = ref(false)
function setYes() {
  console.log("YES -> " + curr_med.value.taken_at);
  curr_med.value.taken_at = currTime();
  console.log(curr_med.value.taken_at);
  localStorage.setItem("rx_log_history", JSON.stringify(rx_log_history.value));

  isOpened.value = !isOpened.value;
  console.log(curr_log);

  // disabled.value = true
  // setTimeout(() => {
  //   disabled.value = false
  // }, 1500)
  // localStorage.setItem("rx_log", JSON.stringify(rx_log));
}
// var curr_tid = 0
// var curr_pid = 0

function setNo() {
  console.log("No -> " + curr_med.value.taken_at);
  curr_med.value.taken_at = null;
  console.log(curr_med.value.taken_at);
  localStorage.setItem("rx_log_history", JSON.stringify(rx_log_history.value));

  isOpened.value = !isOpened.value;
}
function setDone(timeslot, pill) {
  console.log(timeslot);
  console.log(pill);
  // curr_tid = timeslot
  // curr_pid = pill
  curr_med.value = curr_log.value
    .find((t) => t.id == timeslot)
    .pill_checklist.find((p) => p.id == pill);
  // curr_med.value = schedule.find((t) => t.id == timeslot).find((p) => p.id == pill)
  // med_name.value = schedule[timeslot][pill].name;
  isOpened.value = !isOpened.value;
  console.log("thuis?");
  console.log(curr_med.value);
  // curr_timeslot.value = schedule.value.find((t) => t.id == timeslot);
  // console.log(curr_timeslot.value.pill_checklist.find(p => p.name == pill))
  // curr_med.value = curr_timeslot.value.pill_checklist.find(
  // (p) => p.name == pill
  // );
  // curr_med = curr_timeslot.value.pill_checklist.find(p => p.name == pill)
  // set.done = e.target.checked
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
  height: 128px;
  position: sticky;
  top: 0px;
  /* border: 1px solid black; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  background: linear-gradient(
    180deg,
    white 0%,
    white 50%,
    rgba(0, 0, 0, 0) 100%
  );
  /* background-color: #fefefa; */
  z-index: 1;
}

.confirmation-popup {
  padding: 32px;
  /* background-color: #ffd670; */
}

.confirmation-text {
  font-family: "IBM Plex Sans", sans-serif;
  font-size: x-large;
  padding-bottom: 16px;
  color: #2b2d42;
}

.confirmation-button {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.3) 0px -6px 0px inset;

  padding: 32px;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin: 16px;
  font-family: "IBM Plex Sans", sans-serif;
  font-size: large;
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
  /* border: 1px solid black; */
  flex-direction: row;
}

.pill-card {
  /* border: 1px solid #3d348b; */
  border-radius: 18px;
  margin: 16px;
  margin-bottom: 0px;
  display: flex;
  /* flex-direction: row; */
  /* background-color: #d0f4de; */
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 3px 5px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 12px;
}

.pill-taken-at {
  align-items: center;
  background-color: #fefefa;
  border-radius: 4px;
  border: 1px solid #3d348b;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  display: flex;
  width: 256px;
  flex-basis: 32px;
  justify-content: center;
  margin-top: 8px;
  padding: 8px;
}

.pill-taken-at--text {
  /* margin-top: 8px; */
  font-family: "Barlow", sans-serif;
  font-weight: 600;
  font-size: large;
}

.small-icon {
  margin-right: 4px;
  width: 20px;
  height: 20px;
}

.pill-taken {
  /* opacity: 0.65; */
  background-color: rgba(219, 224, 230) !important;
}

.pill-icon {
  width: 40px;
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
  /* display: flex; */
  /* flex-direction: column; */
}

.triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 28px 20px 28px 0;
  border-color: transparent #1d2d44 transparent transparent;
}

.time-container {
  display: flex;
  align-items: center;
  /* margin: 16px; */
  /* margin-bottom: -16px; */
  /* padding-top: 16px; */
  /* padding-left: 16px; */
  padding-bottom: 16px;
  /* margin-top: 16px; */
  position: sticky;
  top: 128px;
  /* background: linear-gradient(
    180deg,
    white 0%,
    white 75%,
    rgba(0, 0, 0, 0) 100%
  ); */
}

.time-icon {
  width: 50px;
  margin: 8px;
}

.time-text {
  background-image: url("../assets/marker.svg");
  filter: drop-shadow(4px 4px 10px rgb(0 0 0 / 0.4));
  /* box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; */
  /* clip-path: path("m20.33,55.25h98.04c5.45,0,9.88-3.77,9.88-8.42V7.03c0-3.75-3.56-6.78-7.95-6.78H20.33c-3.01,0-5.77,1.45-7.11,3.75L1.1,24.68C-.03,26.61-.03,28.89,1.1,30.82l12.12,20.68c1.35,2.3,4.1,3.75,7.11,3.75Z"); */
  height: 55px;
  width: 128px;
  color: #fefefa;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  /* display:table-cell; */
  /* vertical-align:middle; */
  line-height: 55px;
  font-size: xx-large;
  text-align: center;
  /* background-color: #1d2d44; */
  /* padding: 0px; */
  padding-right: 8px;
  padding-left: 16px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.time-slot-gap {
  border-left: 6px solid #fdd3e3;
  margin-left: -6px;
  height: 64px;
}

.time-slot {
  padding-bottom: 32px;
  margin-left: 32px;
  /* padding-bottom: 32px; */
  /* display: flex; */
  border-left: 2px dotted #fb6f92;
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
