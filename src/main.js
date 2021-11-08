// Import frameworks
import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'

// Import plugins
import "@/assets/script/field_validation_rules.js"
import * as Sentry from '@sentry/vue'
import { Integrations } from "@sentry/tracing"
import VueAnimate from 'vue-animate-scroll'
import VueScrollactive from 'vue-scrollactive'
import VueScrollTo from 'vue-scrollto'

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
  Vue: Vue,
  dsn: 'https://937e133d79854ca7a2301bbaa9aa8a36@o239664.ingest.sentry.io/5266396',
  logErrors: true,
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", "api.registry.varianteffect.org"],
    }),
  ],
  tracingOptions: {
    trackComponents: true,
  },
  tracesSampleRate: 0.5,
  release: 'mave-registry-frontend@' + process.env.VUE_APP_VERSION,
  tunnel: process.env.VUE_APP_SENTRY_TUNNEL_URL,
  environment: process.env.NODE_ENV
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

// Inject mixins
Vue.mixin(pageMixins)
Vue.mixin(userMixins)

// Initialize a new Vue instance
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
