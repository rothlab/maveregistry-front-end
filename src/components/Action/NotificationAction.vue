<template>
  <div>
    <b-dropdown
      :triggers="['hover', 'click']"
      position="is-bottom-left"
      aria-role="menu"
      animation="fadeInDown"
      :mobile-modal="false"
      @active-change="refreshTimeElapsed"
    >
      <a
        slot="trigger"
        role="button"
      >
        <bell-icon
          title="Notification icon"
          class="has-text-light icon-24px"
        />
        <span
          class="badge is-danger is-bold"
          v-show="unreadCount > 0"
        >{{ unreadCount }}</span>
      </a>

      <b-dropdown-item
        custom
        paddingless
        :focusable="false"
        class="notification-center"
      >
        <div class="card">
          <div class="card-header has-background-light">
            <div class="card-header-title">
              <span>
                <b-tag
                  type="is-info"
                  style="margin-right: 0.25rem"
                >{{ count }}</b-tag>
                {{ `Notification${count > 1 ? 's' : ''}` }}
              </span>
            </div>
            <div
              class="card-header-icon has-text-info"
              v-if="unreadCount > 0"
            >
              <span @click="markAllAsRead()">Mark all as read</span>
            </div>
          </div>
          <div
            class="card-content notification-scroll"
            v-if="count > 0"
          >
            <div
              class="item"
              v-for="(notification, id) in notifications"
              :key="id"
            >
              <div
                class="columns is-mobile"
                :class="{ 'has-background-warning-light' : !notification.is_read}"
              >
                <figure class="column is-1">
                  <p
                    class="image is-24x24"
                    v-if="notification.by"
                  >
                    <img
                      class="is-rounded"
                      :src="getProfileImageFromUser(notification.by)"
                    >
                  </p>
                  <p
                    class="has-text-centered"
                    v-else
                  >
                    <b-icon
                      type="is-white"
                      icon="mdil-pencil"
                      custom-size="mdil-18px"
                      class="item-icon circle-icon has-background-grey"
                    />
                  </p>
                </figure>
                <div class="column is-7">
                  <div class="content">
                    <p>
                      <span
                        v-if="notification.by"
                        class="is-capitalized"
                      >
                        <router-link
                          :to="{ path: `/user/${notification.by.username}`}"
                          target="_blank"
                        >
                          <b>{{ notification.by.first_name }} {{ notification.by.last_name }}</b>
                        </router-link>
                      </span>
                      <span> {{ notification.message }} </span>
                      <span
                        v-if="notification.target"
                        class="is-capitalized"
                      >
                        <router-link
                          :to="{ path: `/${notification.target.type}/${notification.target.id}`}"
                          target="_blank"
                        >
                          <b>{{ notification.target.type }}</b>
                        </router-link>
                      </span>
                      <span>.</span>
                    </p>
                  </div>
                </div>
                <div class="column is-4 has-text-right">
                  <div class="has-text-grey">
                    <span :key="`${notification.id}_${refreshIndex}`">{{ timeSince(notification.time) }}<br>
                      <!-- Mark as read/unread -->
                      <b-tooltip
                        :label="`Mark as ${notification.is_read ? 'un' : ''}read`"
                        type="is-dark"
                        @click.native="markAs(notification.id, !notification.is_read)"
                        style="cursor: pointer; padding-left: 0.5rem"
                        position="is-left"
                      >
                        <b-icon
                          :icon="notification.is_read ? 'mdil-email' : 'mdil-email-open'"
                          type="is-info"
                        />
                      </b-tooltip>
                      <!-- Delete notification -->
                      <b-tooltip
                        label="Delete"
                        type="is-dark"
                        @click.native="removeNotification(notification.id)"
                        style="cursor: pointer; padding-left: 0.5rem"
                        position="is-left"
                      >
                        <b-icon
                          icon="mdil-delete"
                          type="is-info"
                        />
                      </b-tooltip>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="card-content"
            v-else
          >
            <div class="content has-text-centered has-text-grey no-notification">
              No notifications
            </div>
          </div>
        </div>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import BellIcon from 'vue-material-design-icons/Bell.vue'

const variables = require("@/assets/script/variables.json")

export default {
  components: {
    BellIcon
  },
  props: {
    isHover: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    isHover(val) {
      if (val) this.refreshTimeElapsed(val)
    }
  },
  computed: {
    count() {
      return this.$store.getters.countNotifications
    },
    unreadCount() {
      return this.$store.getters.countUnreadNotifications
    },
    notifications() {
      return this.$store.getters.getNotifications
    }
  },
  data() {
    return {
      refreshIndex: 0
    }
  },
  async mounted() {
    await this.$store.dispatch("subscribeToNotifications")
  },
  methods: {
    timeSince(time) {
      const seconds = Math.floor((Date.now() - time) / 1000);
      if (seconds <= 1) return "right now"

      const interval = variables.intervals.find(i => i.seconds < seconds);
      const count = Math.floor(seconds / interval.seconds);
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    },
    refreshTimeElapsed(isActive) {
      this.refreshIndex += isActive
    },
    async markAs(id, asRead) {
      if (asRead) {
        await this.$store.dispatch("markAsRead", [id])
      } else {
        await this.$store.dispatch("markAsUnread", [id])
      }
    },
    async markAllAsRead() {
      const ids = this.notifications.map(e => e.id)
      await this.$store.dispatch("markAsRead", ids, true)
    },
    async removeNotification(id) {
      await this.$store.dispatch("removeNotification", id)
    }
  }
}
</script>

<style lang="sass">
.dropdown-content
  padding: 0 !important
  .notification-center
    .card-content
      .columns
        margin: 0
        border-bottom-left-radius: 6px
        border-bottom-right-radius: 6px
.item-icon
  margin-left: 0 !important
</style>

<style lang="sass" scoped>
@import "@/assets/style/variables.sass"

.badge
  background-color: $danger
  border-radius: 14px
  color: #fff
  font-size: .65rem
  height: 14px
  line-height: 11px
  min-width: 14px
  overflow: hidden
  padding: .05rem .2rem
  position: absolute
  right: 0
  text-overflow: ellipsis
  text-align: center
  top: 0
  transform: translate(25%,-25%)
  white-space: nowrap
.notification-scroll
  max-height: 300px
  overflow-y: auto
.notification-center
  @media screen and (min-width: $break-mobile)
    width: 28rem
  @media screen and (max-width: $break-mobile)
    max-width: 100vw
  .card
    box-shadow: unset
    border-radius: 6px
    overflow: hidden
  .card-header
    border-radius: 6px 6px 0 0
  .card-content
    padding: 0
    border-radius: 4px
    .item:not(:last-of-type)
      border-bottom: 1px dashed $grey-lighter
    .no-notification
      padding: 1.5rem 0
</style>