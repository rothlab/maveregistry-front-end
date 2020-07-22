import Vue from 'vue'
import Vuex from 'vuex'
import createMutationsSharer from "vuex-shared-mutations"
import createPersistedState from "vuex-persistedstate"

// Import modules
import * as userModule from "./userModule.js"
import * as notificationModule from "./notificationModule.js"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: userModule,
    notifications: notificationModule
  },
  plugins: [
    createMutationsSharer({
      predicate: [
        'setUser', 'logoutUser', 'setRoles', 
        'addNotification', 'removeNotification', 'setNotifications', 'setAsRead', 'setAsUnread',
        'setCookieConsent'
      ]
    }),
    createPersistedState({
      paths: [
        'user.hasAcceptedCookieConsent'
      ]
    })
  ]
})
