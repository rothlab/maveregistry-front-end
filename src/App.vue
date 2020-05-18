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

      <!-- Right side: user functions -->
      <template slot="end">
        <b-navbar-item tag="div">
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
              :animated="false"
            >
              <!-- Log in tab -->
              <b-tab-item
                icon="mdil-login"
                label="Log in"
              >
                <b-field>
                  <b-input
                    type="email"
                    icon="mdil-email"
                    placeholder="Email"
                  />
                </b-field>
                <b-field>
                  <b-input
                    type="password"
                    icon="mdil-lock"
                    placeholder="Password"
                  />
                </b-field>
                <p class="control">
                  <b-button
                    expanded
                    class="is-primary"
                  >
                    Log in
                  </b-button>
                </p>
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
                <b-field>
                  <b-input
                    type="email"
                    icon="mdil-email"
                    placeholder="Email"
                  />
                </b-field>
                <b-field>
                  <b-input
                    type="password"
                    icon="mdil-lock"
                    placeholder="Password"
                  />
                </b-field>
                <p class="control">
                  <b-button
                    expanded
                    class="is-primary"
                  >
                    Sign up
                  </b-button>
                </p>
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

<style lang="sass" scoped>
@import "@/assets/variables.sass"

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
export default {
  data () {
    return {
      isLoginSignupModalActive: false,
      loginSignupProp: {
        email: "",
        password: "",
        method: ""
      }
    }
  },
  methods: {
    cleanupLoginSignup() {
      this.loginSignupProp = {
        email: "",
        password: "",
        method: ""
      }
    }
  }
}
</script>