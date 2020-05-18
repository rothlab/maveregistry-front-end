import Vue from 'vue'
import App from './App.vue'

// Import frameworks
import Buefy from 'buefy'

// Import plugins
import { extend } from 'vee-validate';
import { required, email, password } from 'vee-validate/dist/rules';

// Import stylesheets
import 'buefy/dist/buefy.css'
import '@mdi/font/css/materialdesignicons.css'
import '@mdi/light-font/css/materialdesignicons-light.css'
import '@/assets/styles.sass'
import '@fortawesome/fontawesome-free/css/brands.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'

// Import custom scripts
import router from './router'

// Initialize plugins
// Vee-validate
extend('required', {
  ...required,
  message: 'This field is required'
});
extend('email', {
  ...email,
  message: 'Please provide a valid email'
});
extend('password', {
  params: ['target'],
  ...password,
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match'
});

// Initialize frameworks
Vue.use(Buefy, {
  defaultIconPack: 'mdil',
})

// Initialize parameters
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
