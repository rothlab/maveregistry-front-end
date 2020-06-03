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
          MAVE Projects
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/teams' }"
        >
          Team Progress
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/nominations' }"
        >
          Nomination
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

    <!-- Log in panel -->
    <b-modal
      :active.sync="isLoginSignupModalActive"
      :width="500"
      @close="cleanupLoginSignup()"
    >
      <div class="card">
        <div class="card-content">
          <div class="section">
            <div class="content has-text-centered">
              <h2 class="subtitle">
                MAVE Registry Logo
              </h2>
            </div>

            <!-- Log in/Sign up tab -->
            <b-tabs
              position="is-centered"
              type="is-boxed"
              expanded
              class="login-tab is-marginless"
              :animated="false"
            >
              <!-- Log in tab -->
              <b-tab-item
                icon="mdil-login"
                label="Log in"
              >
                <ValidationObserver
                  ref="observer"
                  v-slot="{ passed }"
                >
                  <ValidationProvider
                    rules="required"
                    name="Username/Email"
                    v-slot="{ errors, valid }"
                  > 
                    <!-- Need to add class here because validation provider screws it up -->
                    <b-field
                      :message="errors"
                      class="field-margin"
                      :type="{ 'is-danger': errors[0], '': valid }"
                    >
                      <b-input
                        icon="mdil-account"
                        placeholder="Username/Email"
                        v-model="loginSignupProp.username"
                      />
                    </b-field>
                  </ValidationProvider>
                  <PasswordWithRevealAndValidation
                    v-model="loginSignupProp.password"
                  />
                  <p class="control">
                    <b-button
                      expanded
                      :disabled="!passed"
                      class="is-primary"
                      @click="login('password')"
                    >
                      Log in
                    </b-button>
                  </p>
                </ValidationObserver>
                <p class="forget-password has-text-right">
                  <router-link
                    :to="{ name: 'Reset Password'}"
                    target="_blank"
                  >
                    Forgot Password?
                  </router-link>
                </p>
                <div class="level">
                  <div class="level-left">
                    <p class="has-text-weight-medium has-text-centered">
                      Log in with
                    </p>
                  </div>
                  <div class="level-right oauth">
                    <div class="buttons is-space-between">
                      <b-button
                        icon-pack="mdi"
                        icon-left="google"
                        type="is-light"
                        @click="login('google')"
                      >
                        Google
                      </b-button>
                      <b-button
                        icon-pack="fab"
                        icon-left="orcid"
                        type="is-light"
                        @click="login('orcid')"
                      >
                        ORCID
                      </b-button>
                    </div>
                  </div>
                </div>
              </b-tab-item>
              <!-- Sign up tab -->
              <b-tab-item
                icon="mdil-file-plus"
                label="Sign up"
              >
                <ValidationObserver
                  ref="observer"
                  v-slot="{ passed }"
                >
                  <!-- Need to add class here because validation provider screws it up -->
                  <b-field
                    grouped
                    class="field-margin is-space-between"
                  >
                    <ValidationProvider
                      rules="required"
                      name="FirstName"
                      v-slot="{ errors, valid }"
                      class="name"
                    >
                      <b-field
                        :message="errors"
                        :type="{ 'is-danger': errors[0], '': valid }"
                      >
                        <b-input
                          type="text"
                          placeholder="First Name"
                          v-model="loginSignupProp.first_name"
                        />
                      </b-field>
                    </ValidationProvider>
                    <ValidationProvider
                      rules="required"
                      name="LastName"
                      v-slot="{ errors, valid }"
                      class="name"
                    >
                      <b-field
                        :message="errors"
                        :type="{ 'is-danger': errors[0], '': valid }"
                      >
                        <b-input
                          type="text"
                          placeholder="Last Name"
                          v-model="loginSignupProp.last_name"
                        />
                      </b-field>
                    </ValidationProvider>
                  </b-field>
                  <ValidationProvider
                    rules="required|alpha_dash"
                    name="Username"
                    v-slot="{ errors, valid }"
                  > 
                    <b-field
                      :message="errors"
                      class="field-margin"
                      :type="{ 'is-danger': errors[0], '': valid }"
                    >
                      <b-input
                        icon="mdil-account"
                        type="text"
                        placeholder="Username"
                        v-model="loginSignupProp.username"
                      />
                    </b-field>
                  </ValidationProvider>
                  <ValidationProvider
                    rules="required|email"
                    name="Email"
                    v-slot="{ errors, valid }"
                  > 
                    <b-field
                      :message="errors"
                      class="field-margin"
                      :type="{ 'is-danger': errors[0], '': valid }"
                    >
                      <b-input
                        icon="mdil-email"
                        type="email"
                        placeholder="Email"
                        v-model="loginSignupProp.email"
                      />
                    </b-field>
                  </ValidationProvider>
                  <PasswordWithRevealAndValidation
                    has-confirm
                    v-model="loginSignupProp.password"
                  />
                  <p class="control">
                    <b-button
                      expanded
                      class="is-primary"
                      :disabled="!passed"
                      :loading="isActionButtonLoading"
                      @click="signup('password')"
                    >
                      Sign up
                    </b-button>
                  </p>
                </ValidationObserver>
                
                <!-- Third party -->
                <div class="level oauth signup">
                  <div class="level-left">
                    <p class="has-text-weight-medium has-text-centered">
                      Sign up with
                    </p>
                  </div>
                  <div class="level-right oauth">
                    <div class="buttons is-space-between">
                      <b-button
                        icon-pack="mdi"
                        icon-left="google"
                        type="is-light"
                        @click="signup('google')"
                      >
                        Google
                      </b-button>
                      <b-button
                        icon-pack="fab"
                        icon-left="orcid"
                        type="is-light"
                        @click="signup('orcid')"
                      >
                        ORCID
                      </b-button>
                    </div>
                  </div>
                </div>
              </b-tab-item>
            </b-tabs>
            <div class="recaptcha-display">
              <p class="is-size-7 has-text-grey-light">
                This site is protected by reCAPTCHA and the Google
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >Privacy Policy</a> and
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >Terms of Service</a> apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <!-- Component injection -->
    <router-view />

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

<style lang="sass">
@import "@/assets/bulma-customization.sass"

.login-tab .tab-content
  padding: 1rem 0 !important
.help
  margin-top: 0
</style>

<style lang="sass" scoped>
@import "@/assets/variables.sass"

.profile-tag
  padding-right: 0.5rem
.password-strength
  margin-top: -1.5rem
  margin-bottom: -0.25rem !important
.oauth
  @media screen and (max-width: $break-mobile)
    margin-top: 1rem !important
  &.signup
    margin-top: 1rem
.footer
  padding: 3rem 1.5rem
.navbar-brand .is-active // Remove active style for the logo
  background-color: transparent !important
.forget-password
  padding: 0.25rem 0 1rem 0
.icon-margin-right
  margin-right: 0.1rem !important
</style>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'

// Lazy loading
const PasswordWithRevealAndValidation = () => import('./components/PasswordWithRevealAndValidation.vue')

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    PasswordWithRevealAndValidation
  },
  async mounted () {
    // Check if an user has logged in, if so, use it
    this.login("cache")
  },
  data () {
    return {
      isLoginSignupModalActive: false,
      loginSignupProp: {
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
      },
      isActionButtonLoading: false,
      appVersion: process.env.VUE_APP_VERSION
    }
  },
  computed: {
    hasLoggedIn() {
      return this.$store.state.hasLoggedIn
    },
    user() {
      return this.$store.state.user
    },
    profileImageUrl() {
      // Set url as placeholder
      let url = require("./assets/blank-profile.png")

      if (this.user && this.user.profile_image) url = this.user.profile_image

      return url
    }
  },
  methods: {
    cleanupLoginSignup() {
      this.loginSignupProp = {
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
      }
      this.isActionButtonLoading = false
    },
    parseGoogleSigninError(e, authCode) {
      let message = ""

      if (e) return

      if (!e) {
        message = 'Something went wrong with Google Sign-in.'
      } else if (!authCode) {
        message = 'Authentication failed.'
      } 

      this.$buefy.toast.open({
        duration: 5000,
        message: message,
        type: 'is-danger',
        queue: false
      })
    },
    parseGoogleSigninRes(googleUser) {
      const basicProfile = googleUser.getBasicProfile()
  
      if (!googleUser) return

      // TODO: move profile image resizing to the backend
      let imgUrl = basicProfile.getImageUrl()
      if (imgUrl) imgUrl = imgUrl.substring(0, imgUrl.lastIndexOf("=")) // Get original size image

      return {
        email: basicProfile.getEmail(),
        first_name: basicProfile.getGivenName(),
        last_name: basicProfile.getFamilyName(),
        profile_image: imgUrl,
        auth: {
          id: googleUser.getId(),
          access_token: googleUser.getAuthResponse().access_token
        }
      }
    },
    async signup(method) {
      // Sign up user
      let user = undefined
      let authWindow, timer;
      switch (method) {
        // With password
        case "password":
          // Loading
          this.isActionButtonLoading = true

          try {
            await this.$store.dispatch('signupUserPassword', this.loginSignupProp)

            this.isLoginSignupModalActive = false
            this.cleanupLoginSignup()
          } catch (e) {
            // Handle error
            this.$buefy.toast.open({
              duration: 5000,
              message: e.message,
              type: 'is-danger',
              queue: false
            })
          } finally {
            this.isActionButtonLoading = false
          }

          break;
        case "google":
          // With Google
          try {
            // Bring up Google Sign-in
            const googleUser = await this.$gAuth.signIn()
            user = this.parseGoogleSigninRes(googleUser)
          } catch (e) {
            this.parseGoogleSigninError(e, user)
            return
          }

          // Handle Sign up in the backend
          try {
            await this.$store.dispatch('signupLoginUserGoogle', user)

            this.isLoginSignupModalActive = false
            this.cleanupLoginSignup()
          } catch (e) {
            this.$buefy.toast.open({
              duration: 5000,
              message: e.message,
              type: 'is-danger',
              queue: false
            })
          }
          break;
        case "orcid":
          // Bring up ORCID window
          authWindow = window.open(
            `https://orcid.org/oauth/authorize?client_id=APP-TNM3Y1CPZI5HS7WJ&response_type=token&scope=openid&redirect_uri=${window.location.origin}/callback/ORCID/signup`,
            'targetWindow',
            `toolbar=no,
             location=no,
             status=no,
             menubar=no,
             scrollbars=yes,
             resizable=yes,
             width=500px,
             height=600px`
          )

          // Handle results
          timer = setInterval(() => { 
            if(authWindow.closed) {
              clearInterval(timer);

              if (this.hasLoggedIn) {
                this.isLoginSignupModalActive = false
                this.cleanupLoginSignup()
              }
            }
          }, 1000);
          break;
        default:
          break;
      }
    },
    async login(method) {
      // Loading
      this.isActionButtonLoading = true

      // Authenticate user
      let user = undefined
      let authWindow, timer;
      switch (method) {
        case "password":
          // With password
          try {
            await this.$store.dispatch('loginUserPassword', this.loginSignupProp)

            this.isLoginSignupModalActive = false
            this.cleanupLoginSignup()
          } catch (e) {
            // Handle error
            this.$buefy.toast.open({
              duration: 5000,
              message: e.message,
              type: 'is-danger',
              queue: false
            })
          }
          break;
        case "google":
          // With Google
          try {
            // Bring up Google Sign-in
            const googleUser = await this.$gAuth.signIn()
            user = this.parseGoogleSigninRes(googleUser)
          } catch (e) {
            this.parseGoogleSigninError(e, user)
            return
          }

          // Handle verification in the backend
          try {
            await this.$store.dispatch('signupLoginUserGoogle', user)

            this.isLoginSignupModalActive = false
            this.cleanupLoginSignup()
          } catch (e) {
            this.$buefy.toast.open({
              duration: 5000,
              message: e.message,
              type: 'is-danger',
              queue: false
            })
          }
          break;
        case "orcid":
          // Bring up ORCID window
          authWindow = window.open(
            `https://orcid.org/oauth/authorize?client_id=APP-TNM3Y1CPZI5HS7WJ&response_type=token&scope=openid&redirect_uri=${window.location.origin}/callback/ORCID/login`,
            'targetWindow',
            `toolbar=no,
             location=no,
             status=no,
             menubar=no,
             scrollbars=yes,
             resizable=yes,
             width=500px,
             height=600px`
          )

          // Handle results
          timer = setInterval(() => { 
            if(authWindow.closed) {
              clearInterval(timer);

              if (this.hasLoggedIn) {
                this.isLoginSignupModalActive = false
                this.cleanupLoginSignup()
              }
            }
          }, 1000);
          break;
        case "cache":
          await this.$store.dispatch('loginUserCache')
          break;
        default:
          break;
      }

      this.isActionButtonLoading = false
    },
    logout() {
      this.$store.dispatch('logoutUser')
    }
  }
}
</script>