<template>
  <div>
    <!-- Header -->
    <div class="hero is-light is-bold">
      <div class="hero-body has-page-header-padding">
        <div class="container">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="content">
                <p class="is-size-3 has-text-weight-medium">
                  User Profile
                </p>
              </div>
            </div>
            <div class="level-right">
              <!-- Edit project -->
              <b-button
                icon-left="mdil-pencil"
                type="is-primary"
                size="is-medium"
              >
                Edit
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <div class="columns">
        <!-- Display profile -->
        <div class="column">
          <div
            class="content"
            v-if="showProfile"
          >
            <h2 class="subtitle">
              Basic Information
            </h2>
            <div class="columns">
              <div class="column">
                <p class="is-size-5">
                  <b>Username</b> <br>
                  {{ userInfo.username }}
                </p>
                <p class="is-size-5">
                  <b>Name</b> <br>
                  {{ userInfo.first_name }} {{ userInfo.last_name }}
                </p>
                <p class="is-size-5">
                  <b>Email</b> <br>
                  {{ userInfo.email }}
                </p>
              </div>
              <div class="column is-3">
                <!-- Profile image -->
                <div class="profile-image">
                  <figure class="image is-square is-marginless">
                    <img src="https://bulma.io/images/placeholders/256x256.png">
                    <div class="upload">
                      <b-button
                        icon-left="mdil-upload"
                        rounded
                        type="is-white"
                      />
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile image and actions -->
        <div class="column is-3">
          <!-- Actions -->
          <div class="content">
            <h2 class="subtitle">
              Actions
            </h2>
            <div class="action-buttons">
              <b-button
                icon-left="mdil-lock"
                type="is-light"
                expanded
              >
                Change Password
              </b-button>
              <b-button
                icon-left="mdil-delete"
                type="is-light"
                expanded
              >
                Delete Account
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as UserManage from "../api/userManage"

export default {
  data () {
    return {
      userInfo: {},
      showProfile: false
    }
  },
  async mounted () {
    const username = this.$route.params.username
    this.userInfo = await this.fetchUserInfo(username)
  },
  methods: {
    async fetchUserInfo(username) {
      // Get user info using username
      const res = await UserManage.fetchUserInfo(username)

      if (!res.error) {
        this.showProfile = true

        return res.user
      }

      return undefined
    }
  }
}
</script>

<style lang="sass" scoped>
.profile-image
  margin-bottom: 1rem
  .upload
    position: absolute
    top: 0.5rem
    right: 0.5rem
.action-buttons
  .button
    margin-bottom: 0.5rem
</style>