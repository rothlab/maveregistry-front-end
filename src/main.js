// Import frameworks
import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'

// Import plugins
import "@/assets/script/field_validation_rules.js"
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';

// Import stylesheets
import "@/assets/style/bulma-customization.sass"
import '@mdi/font/css/materialdesignicons.css'
import '@mdi/light-font/css/materialdesignicons-light.css'
import '@fortawesome/fontawesome-free/css/brands.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import '@/assets/style/styles.sass'

// Import custom scripts
import router from '@/router'
import store from '@/store'
import pageMixins from '@/mixins/pageMixins'
import userMixins from '@/mixins/userMixins'

// Initialize framework
Vue.use(Buefy, {
  defaultIconPack: 'mdil',
})

// Initialize parameters
Vue.config.productionTip = false

// Initialize Sentry
Sentry.init({
  dsn: process.env.NODE_ENV === "development" ? '' : 'https://937e133d79854ca7a2301bbaa9aa8a36@o239664.ingest.sentry.io/5266396',
  integrations: [new VueIntegration({
    Vue,
    attachProps: true
  })],
  release: 'mave-registry-frontend@' + process.env.VUE_APP_VERSION
});

// Inject plugins
Vue.use(VueAxios, axios)
Vue.mixin(pageMixins)
Vue.mixin(userMixins)

// Initialize a new Vue instance
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
