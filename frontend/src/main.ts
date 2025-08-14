import { createApp } from "vue";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";

createApp(App).use(router).use(createPinia()).mount("#app");
