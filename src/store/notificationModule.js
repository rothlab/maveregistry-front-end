import * as NotificationManage from "@/api/notificationManage.js"

export const state = {
  messages: []
}

export const getters = {
  getNotifications: state => {
    return state.messages.sort((a, b) => b.time - a.time)
  },
  countNotifications: state => {
    return state.messages.length
  },
  countUnreadNotifications: state => {
    return state.messages.filter(e => !e.is_read).length
  }
}

export const mutations = {
  addNotification(state, item) {
    if (state.messages.some(e => e.id === item.id)) return
    state.messages.unshift(item)
  },
  removeNotification(state, id) {
    state.messages = state.messages.filter(e => e.id !== id)
  },
  setNotifications(state, items) {
    state.messages = items
  },
  setAsRead(state, ids) {
    state.messages = state.messages.map(e => {
      if (ids.includes(e.id)) e.is_read = true
      return e
    })
  },
  setAsUnread(state, ids) {
    state.messages = state.messages.map(e => {
      if (ids.includes(e.id)) e.is_read = false
      return e
    })
  }
}

export const actions = {
  async subscribeToNotifications({ commit }) {
    if (state.messages.length > 0) return
    await NotificationManage.retrieveAndSubscribe(commit)
  },
  async markAsRead({ commit }, ids) {
    if (ids.length < 1) return

    await NotificationManage.markAs(ids, true)
    commit("setAsRead", ids)
  },
  async markAsUnread({ commit }, ids) {
    if (ids.length < 1) return

    await NotificationManage.markAs(ids, false)
    commit("setAsUnread", ids)
  },
  async removeNotification({ commit }, id) {
    await NotificationManage.remove(id)
    commit("removeNotification", id)
  }
}