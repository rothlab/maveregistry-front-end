<template>
  <div id="app">
    <b-navbar
      fixed-top
      spaced
      shadow
      type="is-white"
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
        <b-navbar-item tag="p">
          Hello, {{ user.first_name }}!
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/profile/' + user.username }"
        >
          Profile
        </b-navbar-item>
        <b-navbar-item tag="div">
          <b-button
            @click="logout"
          >
            Log out
          </b-button>
        </b-navbar-item>
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
              class="login-tab"
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
                        v-model="loginSignupProp.email"
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
                      @click="loginSignupProp.method = 'password'; login()"
                    >
                      Log in
                    </b-button>
                  </p>
                </ValidationObserver>
                <p class="forget-password has-text-right">
                  Forget Password?
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
                      >
                        Google
                      </b-button>
                      <b-button
                        icon-pack="fab"
                        icon-left="orcid"
                        type="is-light"
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
                  <ValidationProvider
                    rules="required|email"
                    name="Email"
                    v-slot="{ errors, valid }"
                  > 
                    <!-- Need to add class here because validation provider screws it up -->
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
                      @click="loginSignupProp.method = 'password'; signup()"
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
                      >
                        Google
                      </b-button>
                      <b-button
                        icon-pack="fab"
                        icon-left="orcid"
                        type="is-light"
                      >
                        ORCID
                      </b-button>
                    </div>
                  </div>
                </div>
              </b-tab-item>
            </b-tabs>
          </div>
        </div>
      </div>
    </b-modal>
    <!-- Component injection -->
    <router-view />

    <footer class="footer has-background-dark has-text-light">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <p>Copyright © 2020 MAVE Registry. All rights reserved.</p>
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
.login-tab .tab-content
  padding: 1rem 0 !important
</style>

<style lang="sass" scoped>
@import "@/assets/variables.sass"

.field-margin
  margin-bottom: 0.75rem
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
  data () {
    return {
      isLoginSignupModalActive: false,
      loginSignupProp: {
        email: "",
        password: "",
        method: ""
      },
      isActionButtonLoading: false,
    }
  },
  computed: {
    hasLoggedIn() {
      return this.$store.state.hasLoggedIn
    },
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    cleanupLoginSignup() {
      this.loginSignupProp = {
        email: "",
        password: "",
        method: ""
      }
    },
    signup() {
      // Loading
      this.isActionButtonLoading = true

      switch (this.loginSignupProp.method) {
        case "password":
          // Password sign up
          break;
      
        default:
          break;
      }

    },
    async login() {
      // Loading
      this.isActionButtonLoading = true

      // Authenticate user
      try {
        await this.$store.dispatch('loginUser', this.loginSignupProp)

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
    },
    logout() {
      this.$store.dispatch('logoutUser')
    }
  }
}
</script>