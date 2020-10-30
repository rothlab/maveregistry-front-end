// Import frameworks
import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'

// Import plugins
import "@/assets/script/field_validation_rules.js"
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import VueAnimate from 'vue-animate-scroll'
import VueScrollactive from 'vue-scrollactive'
import VueScrollTo from 'vue-scrollto'
import SimpleAnalytics from "simple-analytics-vue";

// Import stylesheets
import "@/assets/style/bulma-customization.sass"
import '@mdi/light-font/css/materialdesignicons-light.css'
import 'vue-material-design-icons/styles.css'
import '@/assets/style/styles.sass'
import 'vue-resize/dist/vue-resize.css'

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
    attachProps: true,
    logErrors: true
  })],
  release: 'mave-registry-frontend@' + process.env.VUE_APP_VERSION
});
// Report vuex states
Sentry.configureScope(scope => {
  scope.setExtra(store.state)
})

// Inject plugins
Vue.use(VueAnimate)
Vue.use(VueScrollactive)
Vue.use(VueScrollTo, {
  duration: 600,
  offset: -100
})
Vue.use(SimpleAnalytics, { skip: process.env.NODE_ENV === "development" })

// Inject mixins
Vue.mixin(pageMixins)
Vue.mixin(userMixins)

// Initialize a new Vue instance
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
