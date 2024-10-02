import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';

import { BootstrapVue3 } from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);

app.use(BootstrapVue3);

axios.defaults.baseURL = process.env.VUE_APP_BASE_API_URL || '';

app.mount('#app');
