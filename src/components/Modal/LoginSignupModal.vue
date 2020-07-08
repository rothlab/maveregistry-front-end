<template>
  <b-modal
    :active.sync="isActive"
    :width="500"
  >
    <div class="card">
      <div class="card-content">
        <div class="section">
          <vue-hcaptcha
            sitekey="57b34ff1-21ab-4eee-b0f1-a16071d64d34"
            size="invisible"
            ref="captcha"
            @verify="onVerifyCaptcha"
            @expired="onErrorCaptcha('Captcha Expired')"
            @error="onErrorCaptcha"
          />
          <!-- <div class="content has-text-centered">
            <h2 class="subtitle">
              MAVE Registry
            </h2>
          </div> -->

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
                      v-model="username"
                    />
                  </b-field>
                </ValidationProvider>
                <PasswordField v-model="password" />
                <p class="control">
                  <b-button
                    expanded
                    :disabled="!passed"
                    class="is-primary"
                    :loading="isLoading"
                    @click="login('password')"
                  >
                    Log in
                  </b-button>
                </p>
              </ValidationObserver>
              <p class="forget-password has-text-right">
                <router-link
                  :to="{ name: 'Reset Password' }"
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
                        v-model="firstName"
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
                        v-model="lastName"
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
                      v-model="username"
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
                      v-model="email"
                    />
                  </b-field>
                </ValidationProvider>
                <PasswordField
                  has-confirm
                  v-model="password"
                />
                <p class="control">
                  <b-button
                    expanded
                    class="is-primary"
                    :disabled="!passed"
                    :loading="isLoading"
                    @click="executeCaptcha"
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
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { handleError } from "@/api/errorHandler.js";
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import PasswordField from "@/components/Field/PasswordField.vue"
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'

function oauth(url, component) {
  // Bring up OAuth window
  window.open(url,
    "targetWindow",
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
  let timer = setInterval(() => {
    if (component.hasLoggedIn) {
      component.isActive = false;
      clearInterval(timer);
    }
  }, 1000)
}

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    PasswordField,
    VueHcaptcha
  },
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    isActive(val) {
      if (val !== this.active) {
        this.$emit("update:active", val)
      }

      if (val) this.cleanup()
    },
    active(val) {
      if (val != this.isActive) {
        this.isActive = val
      }
    }
  },
  data() {
    return {
      isLoading: false,
      isActive: false,
      captchaAction: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: ""
    };
  },
  computed: {
    hasLoggedIn() {
      return this.$store.getters.hasLoggedIn
    }
  },
  methods: {
    cleanup() {
      this.firstName = "";
      this.lastName = "";
      this.username = "";
      this.email = "";
      this.password = "";
    },
    async executeCaptcha() {
      // Execute hCaptcha
      this.$refs.captcha.execute()
    },
    async onVerifyCaptcha(response) {
      await this.signup("password", response)
    },
    onErrorCaptcha(err) {
      this.$buefy.toast.open({
        duration: 5000,
        message: err,
        type: "is-danger",
        queue: false
      })
    },
    async signup(method, response = undefined) {
      // Sign up user
      let params
      switch (method) {
        // With password
        case "password":
          // Loading
          this.isLoading = true;

          try {
            await this.$store.dispatch(
              "signupUserPassword",
              {
                first_name: this.firstName,
                last_name: this.lastName,
                username: this.username,
                email: this.email,
                password: this.password,
                captcha_token: response
              }
            )

            this.isActive = false;
          } catch (e) {
            // Handle error
            this.$buefy.toast.open({
              duration: 5000,
              message: await handleError(e),
              type: "is-danger",
              queue: false
            })
            return
          } finally {
            this.isLoading = false
          }

          break
        case "google":
          // With Google
          params = {
            id: "637030175210-gdtjb7kd3kalhovg25sm3d2ns8mu67o5.apps.googleusercontent.com",
            url: "https://accounts.google.com/o/oauth2/v2/auth",
            redirect_url: window.location.origin + "/callback/Google/login",
          }
          oauth(`${params.url}?client_id=${params.id}&response_type=token&scope=profile email&redirect_uri=${params.redirect_url}`, this)
          this.isLoading = false;
          break
        case "orcid":
          params = {
            id: "APP-TNM3Y1CPZI5HS7WJ",
            url: "https://orcid.org/oauth/authorize",
            redirect_url: window.location.origin + "/callback/ORCID/signup",
          }
          oauth(`${params.url}?client_id=${params.id}&response_type=token&scope=openid&redirect_uri=${params.redirect_url}`, this)
          this.isLoading = false
          break
        default:
          break
      }

      // Get roles
      await this.$store.dispatch("getRoles")
    },
    async login(method) {
      // Loading
      this.isLoading = true;

      // Authenticate user
      let params
      switch (method) {
        case "password":
          // With password
          try {
            await this.$store.dispatch(
              "loginUserPassword",
              {
                username: this.username,
                password: this.password
              }
            );

            this.isActive = false;
          } catch (e) {
            // Handle error
            this.$buefy.toast.open({
              duration: 5000,
              message: await handleError(e),
              type: "is-danger",
              queue: false
            });
            return
          } finally {
            this.isLoading = false;
          }
          break;
        case "google":
          // With Google
          params = {
            id: "637030175210-gdtjb7kd3kalhovg25sm3d2ns8mu67o5.apps.googleusercontent.com",
            url: "https://accounts.google.com/o/oauth2/v2/auth",
            redirect_url: window.location.origin + "/callback/Google/login",
          }
          oauth(`${params.url}?client_id=${params.id}&response_type=token&scope=profile email&redirect_uri=${params.redirect_url}`, this)
          this.isLoading = false;
          break;
        case "orcid":
          params = {
            id: "APP-TNM3Y1CPZI5HS7WJ",
            url: "https://orcid.org/oauth/authorize",
            redirect_url: window.location.origin + "/callback/ORCID/login",
          }
          oauth(`${params.url}?client_id=${params.id}&response_type=token&scope=openid&redirect_uri=${params.redirect_url}`, this)
          this.isLoading = false;
          break;
        default:
          break;
      }

      // Get roles
      await this.$store.dispatch("getRoles")
    }
  }
};
</script>

<style lang="sass">
@import "@/assets/style/variables.sass"

.login-tab .tab-content
  padding: 1rem 0 !important
.oauth
  @media screen and (max-width: $break-mobile)
    margin-top: 1rem !important
  &.signup
    margin-top: 1rem
.forget-password
  padding: 0.25rem 0 1rem 0
</style>