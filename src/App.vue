<template>
  <div id="app">
    <b-navbar
      fixed-top
      shadow
      spaced
      type="is-primary"
      :is-active.sync="isOpenedBurger"
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
          v-if="hasLoggedIn && isMember"
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
          :to="{ path: '/moderation' }"
        >
          Moderation
        </b-navbar-item>
      </template>

      <!-- Right side: user functions when logged in -->
      <template
        slot="end"
        v-if="hasLoggedIn"
      >
        <!-- Notification -->
        <b-navbar-item
          v-if="!isOpenedBurger"
          tag="div"
          @mouseover="isNotificationHoverActive = true"
          @mouseleave="isNotificationHoverActive = false"
        >
          <NotificationAction :is-hover="isNotificationHoverActive" />
        </b-navbar-item>

        <b-navbar-dropdown
          :hoverable="!isOpenedBurger"
          right
          :collapsible="isOpenedBurger"
        >
          <template slot="label">
            <div class="is-flex">
              <figure
                class="image is-24x24 profile-image is-inline-block"
              >
                <img
                  class="is-rounded"
                  :src="profileImageUrl(currentUser)"
                  alt="Profile Image"
                >
              </figure>
              <span
                v-if="isOpenedBurger"
                style="padding-left: 0.5rem"
              >User</span>
            </div>
          </template>

          <b-navbar-item
            tag="router-link"
            :to="{ name: 'User Profile View', params: { username: currentUser.username } }"
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
            type="is-warning"
            :loading="isLoading"
            expanded
            @click="isLoginSignupModalActive = true"
          >
            Log in
          </b-button>
        </b-navbar-item>
      </template>

      <!-- If mobile burget is triggered, draw a separate notification bell -->
      <template
        slot="burger"
        v-if="hasLoggedIn"
      >
        <b-navbar-item
          tag="div"
          class="navbar-notification"
          @mouseover="isNotificationHoverActive = true"
          @mouseleave="isNotificationHoverActive = false"
        >
          <NotificationAction :is-hover="isNotificationHoverActive" />
        </b-navbar-item>
        <a
          role="button"
          class="navbar-burger burger"
          :class="{ 'is-active': isOpenedBurger }"
          aria-label="menu"
          :aria-expanded="isOpenedBurger"
          @click="isOpenedBurger = !isOpenedBurger"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </template>    
    </b-navbar>

    <!-- Log in/Sign up panel -->
    <LoginSignupModal
      :active.sync="isLoginSignupModalActive"
    />

    <!-- Component injection -->
    <router-view @login="isLoginSignupModalActive = true" />

    <footer
      class="footer is-dark is-bold has-text-light"
      v-if="!$route.meta.hideFooter"
    >
      <div class="container">
        <div class="level">
          <div class="level-left">
            <p>Copyright © 2020 MAVE Registry. All rights reserved. Ver. {{ appVersion }}.</p>
          </div>
          <div class="level-right">
            <p class="footer-links is-flex has-vcentered">
              <router-link
                :to="{ name: 'About' }"
                target="_blank"
                class="has-text-light"
              >
                About
              </router-link>
              <span class="divider" />
              <router-link
                :to="{ name: 'Contact' }"
                target="_blank"
                class="has-text-light"
              >
                Contact Us
              </router-link>
              <span class="divider" />
              <router-link
                :to="{ name: 'Terms' }"
                target="_blank"
                class="has-text-light"
              >
                Terms
              </router-link>
              <span class="divider" />
              <router-link
                :to="{ name: 'Privacy' }"
                target="_blank"
                class="has-text-light"
              >
                Privacy
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="sass">
@import "@/assets/style/variables.sass"

.dropdown
  .dropdown-menu
    display: block !important
    pointer-events: none
    opacity: 0
  &.is-hoverable:not(.is-active)
    .dropdown-menu
      transform: translateY(-5px)
      transition-duration: 86ms
      transition-property: opacity, transform
  &.is-hoverable
    &:hover, &.is-active
      .dropdown-menu
        transform: translateY(0)
        opacity: 1
        pointer-events: auto
.navbar-notification
  @media screen and (min-width: $break-mobile)
  .dropdown-menu
    position: fixed
    padding: 0
    top: 3.25rem
    left: 0
    .dropdown-content
      border-radius: 0
</style>

<style lang="sass" scoped>
@import "@/assets/style/variables.sass"

.footer
  padding: 3rem 1.5rem
.navbar-brand .is-active // Remove active style for the logo
  background-color: transparent !important
.icon-margin-right
  margin-right: 0.1rem !important
.profile-image
  border-radius: 24px
  border: 2px solid $light
.navbar-burger
  margin-left: unset
.navbar-notification
  margin-left: auto
  @media screen and (min-width: $break-mobile)
    display: none
.footer-links
  .divider
    display: inline-block
    margin: 0 1rem
    border-left: 1px solid $grey-light
    width: 0
    height: 0.75rem
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
    this.isLoading = true

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
    } finally {
      this.isLoading = false
    }

    // If user has logged in but hasn't verified email,
    // show notification
    if (this.hasLoggedIn && this.currentUser && !this.currentUser.email_validated) {
      const isInProfile = this.$route.name === "User Profile View"
      this.snackBarComponent = this.$buefy.snackbar.open({
        message: "Please verify your email address.<br>Access to the registry is limited until the email is verified.",
        type: "is-danger",
        position: "is-top",
        actionText: isInProfile ? "Dismiss" : "Verify Email",
        indefinite: true,
        onAction: () => {
          if (!isInProfile)
            this.$router.push({ name: 'User Profile View', params: { username: this.currentUser.username } })
        }
      })
    }
  },
  data () {
    return {
      isLoginSignupModalActive: false,
      isNotificationHoverActive: false,
      isLoading: false,
      isOpenedBurger: false,
      appVersion: process.env.VUE_APP_VERSION,
      snackBarComponent: undefined
    }
  },
  watch: {
    currentUser: {
      deep: true,
      handler: function (val) {
        if (this.snackBarComponent && val.email_validated) {
          this.snackBarComponent.close()
        }
      }
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