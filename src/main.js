import "./assets/reset.css";
import "./assets/style.css"
import { createApp } from 'vue'
import App from './App.vue'
import VueSidePanel from 'vue3-side-panel';
import 'vue3-side-panel/dist/vue3-side-panel.css'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
const app = createApp(App);
app.use(VueSidePanel);
app.component('VueDatePicker', VueDatePicker);
app.mount('#app')
