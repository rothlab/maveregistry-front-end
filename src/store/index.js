import Vue from 'vue'
import Vuex from 'vuex'
import createMutationsSharer from "vuex-shared-mutations"
import createPersistedState from "vuex-persistedstate"

// Import modules
import * as userModule from "./userModule.js"
import * as notificationModule from "./notificationModule.js"
import * as preferenceModule from "./preferenceModule.js"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: userModule,
    notifications: notificationModule,
    preference: preferenceModule
  },
  plugins: [
    createMutationsSharer({
      predicate: [
        'setUser', 'logoutUser', 'setRoles', 'setNonce',
        'addNotification', 'removeNotification', 'setNotifications', 'setAsRead', 'setAsUnread',
        'setCookieConsent'
      ]
    }),
    createPersistedState({
      key: 'preference',
      paths: [
        'preference', 'user.nonce'
      ]
    })
  ]
})
