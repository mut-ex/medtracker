import "./assets/reset.css";
import "./assets/style.css"
import { createApp } from 'vue'
import App from './App.vue'
import VueSidePanel from 'vue3-side-panel';
import 'vue3-side-panel/dist/vue3-side-panel.css'
const app = createApp(App);
app.use(VueSidePanel);
app.mount('#app')
