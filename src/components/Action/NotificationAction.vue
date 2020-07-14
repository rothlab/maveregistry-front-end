<template>
  <div>
    <b-dropdown
      hoverable
      position="is-bottom-left"
      aria-role="menu"
      @active-change="refreshTimeElapsed"
    >
      <a
        slot="trigger"
        role="button"
      >
        <span
          class="badge"
          v-if="unreadCount > 0"
        >{{ unreadCount }}</span>
        <b-icon
          pack="mdi"
          icon="bell"
          type="is-grey-light"
        />
      </a>

      <b-dropdown-item
        custom
        paddingless
        :focusable="false"
        class="notification-center"
      >
        <div
          class="card"
        >
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
            class="card-content"
            v-if="count > 0"
          >
            <div
              class="item"
              v-for="(notification, id) in notifications"
              :key="id"
            >
              <div
                class="columns"
                :class="{ 'has-background-warning-light' : !notification.is_read}"
              >
                <figure class="column is-1">
                  <p
                    class="image is-24x24"
                    v-if="notification.by"
                  >
                    <img
                      class="is-rounded"
                      :src="profileImageUrl(notification.by.profile_image)"
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
                        position="is-left"
                        type="is-dark"
                        @click.native="markAs(notification.id, !notification.is_read)"
                        style="cursor: pointer; padding-left: 0.5rem"
                      >
                        <b-icon
                          :icon="notification.is_read ? 'mdil-email' : 'mdil-email-open'"
                          type="is-info"
                        />
                      </b-tooltip>
                      <!-- Delete notification -->
                      <b-tooltip
                        label="Delete"
                        position="is-left"
                        type="is-dark"
                        @click.native="removeNotification(notification.id)"
                        style="cursor: pointer; padding-left: 0.5rem"
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
const variables = require("@/assets/script/variables.json")

export default {
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
    profileImageUrl(image) {
      // Set url as placeholder
      let url = require("@/assets/image/blank-profile.png")
      if (image) url = image.url()

      return url
    },
    timeSince(time) {
      const seconds = Math.floor((Date.now() - time) / 1000);
      if (seconds < 1) return "right now"

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
  border: 2px solid transparent
  border-radius: 14px
  box-shadow: 0 0 0 2px #fff
  color: #fff
  font-size: .65rem
  height: 14px
  line-height: 8px
  min-width: 14px
  overflow: hidden
  padding: .05rem .15rem
  position: absolute
  right: 0
  text-overflow: ellipsis
  top: 0
  transform: translate(50%,-50%)
  white-space: nowrap
.notification-center
  width: 28rem
  .card
    box-shadow: unset
    border-radius: 6px
  .card-content
    padding: 0
    border-radius: 4px
    .item:not(:last-of-type)
      border-bottom: 1px dashed $grey-lighter
    .no-notification
      padding: 1.5rem 0
</style>