import Vue from 'vue'
import App from './App.vue'

// Import frameworks
import Buefy from 'buefy'

// Import plugins

// Import stylesheets
import 'buefy/dist/buefy.css'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/styles.sass'

// Initialize frameworks
Vue.use(Buefy)

// Initialize plugins

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
