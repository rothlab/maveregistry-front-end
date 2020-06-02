import Vue from 'vue'
import App from './App.vue'

// Import frameworks
import Buefy from 'buefy'

// Import plugins
import "@/assets/field_validation_rules.js"
import GAuth from 'vue-google-oauth2'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import axios from 'axios'
import VueAxios from 'vue-axios'

// Import stylesheets
// import 'buefy/dist/buefy.css'
import '@mdi/font/css/materialdesignicons.css'
import '@mdi/light-font/css/materialdesignicons-light.css'
import '@fortawesome/fontawesome-free/css/brands.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import '@/assets/styles.sass'

// Import custom scripts
import router from './router'
import store from './store'

// Initialize frameworks
Vue.use(Buefy, {
  defaultIconPack: 'mdil',
})

// Initialize parameters
const gauthOption = { // Google O-Auth
  clientId: '637030175210-gdtjb7kd3kalhovg25sm3d2ns8mu67o5.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.config.productionTip = false

// Inject plugins
Vue.use(GAuth, gauthOption)
Vue.use(VueReCaptcha, {
  siteKey: '6LeEHPwUAAAAABdzBkPKUmfsxsGPxBtddID97XWh',
  loaderOptions: {
    useRecaptchaNet: true,
    autoHideBadge: true
  }
})
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
