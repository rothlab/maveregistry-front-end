<template>
  <div id="app">
    <b-navbar
      fixed-top
      spaced
      shadow
      type="is-white"
      v-if="!$route.meta.hideNav"
    >
      <!-- Logo -->
      <template slot="brand">
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/' }"
        >
          MAVE Registry
        </b-navbar-item>
      </template>

      <!-- Left side: main functions -->
      <template slot="start">
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/projects' }"
        >
          Projects
        </b-navbar-item>
        <b-navbar-item
          v-if="hasLoggedIn"
          tag="router-link"
          :to="{ path: '/teams' }"
        >
          Teams
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/nominations' }"
        >
          Nominations
        </b-navbar-item>
        <b-navbar-item
          v-if="hasLoggedIn && isModerator"
          tag="router-link"
          :to="{ path: '/moderate' }"
        >
          Moderate
        </b-navbar-item>
        <b-navbar-dropdown label="Info">
          <b-navbar-item
            tag="router-link"
            :to="{ path: '/about' }"
          >
            About
          </b-navbar-item>
          <b-navbar-item
            tag="router-link"
            :to="{ path: '/contact' }"
          >
            Contact
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <!-- Right side: user functions when logged in -->
      <template
        slot="end"
        v-if="hasLoggedIn"
      >
        <!-- Notification -->
        <b-navbar-item
          tag="div"
          @mouseover="isNotificationHoverActive = true"
          @mouseleave="isNotificationHoverActive = false"
        >
          <NotificationAction :is-hover="isNotificationHoverActive" />
        </b-navbar-item>

        <b-navbar-dropdown
          hoverable
          right
        >
          <template slot="label">
            <figure
              class="image is-24x24"
            >
              <img
                class="is-rounded"
                :src="profileImageUrl"
                alt="Profile Image"
              >
            </figure>
          </template>

          <b-navbar-item
            tag="router-link"
            :to="{ name: 'User Profile View', params: { username: user.username } }"
            :key="$route.path"
          >
            <div class="is-flex">
              <b-icon
                icon="mdil-account"
                class="icon-margin-right"
              />
              User Profile
            </div>
          </b-navbar-item>
          <b-navbar-item
            tag="a"
            @click.prevent="logout"
          >
            <div class="is-flex">
              <b-icon
                icon="mdil-logout"
                class="icon-margin-right"
              />
              Log out
            </div>
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <!-- Log in or sign up -->
      <template
        slot="end"
        v-else
      >
        <b-navbar-item
          tag="div"
        >
          <b-button
            type="is-primary"
            @click="isLoginSignupModalActive = true"
          >
            Log in
          </b-button>
        </b-navbar-item>
      </template>
    </b-navbar>

    <!-- Log in/Sign up panel -->
    <LoginSignupModal
      :active.sync="isLoginSignupModalActive"
    />

    <!-- Component injection -->
    <router-view @login="isLoginSignupModalActive = true" />

    <footer
      class="footer has-background-dark has-text-light"
      v-if="!$route.meta.hideFooter"
    >
      <div class="container">
        <div class="level">
          <div class="level-left">
            <p>Copyright © 2020 MAVE Registry. All rights reserved. Ver. {{ appVersion }}.</p>
          </div>
          <div class="level-right">
            <p>About | Contact Us | Terms | Privacy</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="sass" scoped>
.footer
  padding: 3rem 1.5rem
.navbar-brand .is-active // Remove active style for the logo
  background-color: transparent !important
.icon-margin-right
  margin-right: 0.1rem !important
</style>

<script>
import { handleError } from "@/api/errorHandler.js";
import NotificationAction from '@/components/Action/NotificationAction.vue'

const LoginSignupModal = () => import('@/components/Modal/LoginSignupModal.vue')

export default {
  // title: "Mave Registry",
  components: {
    LoginSignupModal,
    NotificationAction
  },
  async mounted () {
    // Check if an user has logged in, if so, use it
    try {
      await this.$store.dispatch("loginUserCache")
      await this.$store.dispatch("getRoles")
    } catch (e) {
      this.$buefy.toast.open({
        duration: 5000,
        message: await handleError(e),
        type: "is-danger",
        queue: false
      })
    }
  },
  data () {
    return {
      isLoginSignupModalActive: false,
      isNotificationHoverActive: false,
      appVersion: process.env.VUE_APP_VERSION,
    }
  },
  computed: {
    hasLoggedIn() {
      return this.$store.getters.hasLoggedIn
    },
    isModerator() {
      return this.$store.getters.hasRole("moderator")
    },
    user() {
      return this.$store.getters.getUser
    },
    profileImageUrl() {
      // Set url as placeholder
      let url = require("@/assets/image/blank-profile.png")

      if (this.user && this.user.profile_image) url = this.user.profile_image

      return url
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logoutUser')
      this.$router.go(0)
    },
  }
}
</script>