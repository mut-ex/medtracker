<template>
  <VueSidePanel
    v-model="isOpened"
    rerender
    side="bottom"
    panel-color="#ffd670"
    height="80%"
  >
    <div class="confirmation-popup">
      <div class="confirmation-popup__text">
        Have you taken <b>{{ curr_med.name }}</b
        >?
      </div>
      <VueDatePicker
        v-model="date"
        @update:model-value="handleDate"
        time-picker
        inline
        :is-24="false"
        no-hours-overlay
        no-minutes-overlay
        auto-apply
      />
      <div class="confirmation-button__container">
        <div
          class="confirmation-button confirmation-button-yes"
          @click="setYes()"
        >
          <img
            class="confirmation-button__svg"
            src="../assets/thumbs-up.svg"
            alt="Yes"
          />
        </div>
        <div
          class="confirmation-button confirmation-button-no"
          @click="setNo()"
        >
          <img
            class="confirmation-button__svg"
            src="../assets/thumbs-down.svg"
            alt="No"
          />
        </div>
      </div>
    </div>
  </VueSidePanel>
  <div class="hero">
    <div class="tab-container">
      <div class="extra-container"><div class="extra extra__before"></div></div>
      <div class="tab tab--active">Scheduled</div>
      <div class="extra-container"><div class="extra extra__after"></div></div>

      <div class="extra-container--inactive ">
        <div class="extra extra--inactive extra__before"></div>
      </div>
      <div class="tab">As Needed</div>
      <div class="extra-container--inactive ">
        <div class="extra extra--inactive extra__after"></div>
      </div>

      <!-- <div class="tab__after>">xx</div> -->
    </div>
  </div>
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
  </div>
</template>

<script setup>
import { ref, onBeforeMount, reactive } from "vue";

var curr_log_idx = ref();
var isOpened = ref(false);
var curr_med = ref("none");
// var curr_med = ref({
//   id: 2,
//   name: "Centrum Ultra Men's Multivitamin",
//   taken_at: null,
// });

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
    color: "#E5B3D0",
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
    color: "#FF8957",
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
    color: "#F09875",
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

function getPill(pill) {
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
  rx_log_keys.push(day.date);
});
if (!rx_log_keys.includes(keyForToday())) {
  rx_log_history.value.push({ date: keyForToday(), data: empty_log });
  rx_log_keys.push(keyForToday());
}
localStorage.setItem("rx_log_history", JSON.stringify(rx_log_history.value));

curr_log_idx.value = rx_log_keys.length - 1;
var curr_log = ref(rx_log_history.value[curr_log_idx.value].data);

function prevDay() {
  if (curr_log_idx.value === 0) {
    return;
  }
  curr_log_idx.value = curr_log_idx.value - 1;
  curr_log.value = rx_log_history.value[curr_log_idx.value].data;
}

function nextDay() {
  if (curr_log_idx.value === rx_log_keys.length - 1) {
    return;
  }
  curr_log_idx.value = curr_log_idx.value + 1;
  curr_log.value = rx_log_history.value[curr_log_idx.value].data;
}

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

function maketimestamp() {
  var curr_hour = date.value.hours;
  var am_pm = " AM";
  if (curr_hour > 12) {
    curr_hour = curr_hour - 12;
    am_pm = " PM";
  }
  let mins;
  if (date.value.minutes < 10) mins = "0" + String(date.value.minutes);
  else mins = String(date.value.minutes);
  return String(curr_hour) + ":" + mins + am_pm;
}

function setYes() {
  curr_med.value.taken_at = maketimestamp();
  localStorage.setItem("rx_log_history", JSON.stringify(rx_log_history.value));
  isOpened.value = !isOpened.value;
}

function setNo() {
  curr_med.value.taken_at = null;
  localStorage.setItem("rx_log_history", JSON.stringify(rx_log_history.value));
  isOpened.value = !isOpened.value;
}
function setDone(timeslot, pill) {
  curr_med.value = curr_log.value
    .find((t) => t.id == timeslot)
    .pill_checklist.find((p) => p.id == pill);
  const now = new Date();
  date.value = {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
  };
  if (curr_med.value.taken_at !== null) {
    const timestamp_split = curr_med.value.taken_at.split(" ");
    var hours = parseInt(timestamp_split[0].split(":")[0]);
    var minutes = parseInt(timestamp_split[0].split(":")[1]);
    if (timestamp_split[1] === "PM") hours = hours + 12;
    date.value = { hours: hours, minutes: minutes, seconds: 0 };
  }
  isOpened.value = !isOpened.value;
}

const date = ref({ hours: 0, minutes: 0, seconds: 0 });

const handleDate = (modelData) => {
  date.value = modelData;
};
</script>

<style></style>
