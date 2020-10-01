<template>
  <b-modal
    :active.sync="isActive"
    :width="500"
    :can-cancel="['escape', 'outside']"
    class="card-modal"
  >
    <div class="card">
      <div class="card-content login-card">
        <vue-hcaptcha
          sitekey="57b34ff1-21ab-4eee-b0f1-a16071d64d34"
          size="invisible"
          ref="captcha"
          @verify="onVerifyCaptcha"
          @expired="onErrorCaptcha('Captcha Expired')"
          @error="onErrorCaptcha"
        />
        <div class="level is-mobile">
          <div class="level-left">
            <img
              width="200"
              src="@/assets/image/logo.png"
              alt="Mave Registry Logo"
            >
          </div>
          <div class="level-right">
            <button
              class="delete"
              aria-label="close"
              @click="isActive = false"
            />
          </div>
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
                    v-model.trim="username"
                  />
                </b-field>
              </ValidationProvider>
              <PasswordField
                v-model="password"
                enter-to-submit
                @submit="login('password')"
              />
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
                  Sign in with
                </p>
              </div>
              <div class="level-right oauth">
                <div class="buttons is-space-between">
                  <button
                    class="button google-signin"
                    @click="login('google')"
                  />
                  <button
                    class="button orcid-signin"
                    @click="login('orcid')"
                  >
                    <img
                      src="@/assets/image/orcid_logo.png"
                      alt="ORCID logo"
                    >
                    <span class="has-text-grey">ORCID</span>
                  </button>
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
                class="field-margin field-space-between"
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
                      v-model.trim="firstName"
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
                      v-model.trim="lastName"
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
                    v-model.trim="username"
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
                    v-model.trim="email"
                  />
                </b-field>
              </ValidationProvider>
              <PasswordField
                has-confirm
                v-model="password"
                enter-to-submit
                @submit="executeCaptcha"
              />
              <ValidationProvider
                :rules="{ required: { allowFalse: false } }"
                name="Consent"
                v-slot="{ errors }"
              >
                <b-checkbox v-model="hasConsent">
                  I agree to the 
                  <a
                    href="/policy/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Terms</a> 
                  and
                  <a
                    href="/policy/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Privacy Policy</a>.
                </b-checkbox>
                <p
                  class="has-text-danger is-size-7"
                  v-if="errors[0]"
                >
                  You have to agree to these linked agreements before signing up.
                </p>
              </ValidationProvider>
              <p
                class="control"
                style="padding-top: 0.5rem"
              >
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
                  <button
                    class="button google-signin"
                    @click="login('google')"
                  />
                  <button
                    class="button orcid-signin"
                    @click="login('orcid')"
                  >
                    <img
                      src="@/assets/image/orcid_logo.png"
                      alt="ORCID logo"
                    >
                    <span class="has-text-grey">ORCID</span>
                  </button>
                </div>
              </div>
            </div>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { displayErrorToast } from "@/api/errorHandler.js"
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
  let timer = setInterval(async () => {
    if (component.hasLoggedIn) {
      component.isActive = false;
      clearInterval(timer);

      // Get roles and reload page
      await component.$store.dispatch("getRoles")
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
      password: "",
      hasConsent: false
    };
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

            // Get roles and reload page
            await this.$store.dispatch("getRoles")
          } catch (e) {
            // Handle error
            await displayErrorToast(e)
            return
          } finally {
            this.isLoading = false
          }

          break
        case "google":
          await this.$store.dispatch("generateNonce")

          params = {
            id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
            url: "https://accounts.google.com/o/oauth2/v2/auth",
            redirect_url: window.location.origin + "/callback/Google/login",
            nonce: this.$store.getters.getNonce
          }
          oauth(`${params.url}?client_id=${params.id}&nonce=${params.nonce}&response_type=id_token&scope=profile email&redirect_uri=${params.redirect_url}`, this)
          this.isLoading = false;
          break
        case "orcid":
          await this.$store.dispatch("generateNonce")

          params = {
            id: process.env.VUE_APP_ORCID_CLIENT_ID,
            url: "https://orcid.org/oauth/authorize",
            redirect_url: window.location.origin + "/callback/ORCID/signup",
            nonce: this.$store.getters.getNonce
          }
          oauth(`${params.url}?client_id=${params.id}&nonce=${params.nonce}&response_type=token&scope=openid&redirect_uri=${params.redirect_url}`, this)
          this.isLoading = false
          break
        default:
          break
      }
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

            // Get roles and reload page
            await this.$store.dispatch("getRoles")
          } catch (e) {
            // Handle error
            await displayErrorToast(e)
            return
          } finally {
            this.isLoading = false;
          }
          break;
        case "google":
          await this.$store.dispatch("generateNonce")

          params = {
            id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
            url: "https://accounts.google.com/o/oauth2/v2/auth",
            redirect_url: window.location.origin + "/callback/Google/login",
            nonce: this.$store.getters.getNonce
          }
          oauth(`${params.url}?client_id=${params.id}&nonce=${params.nonce}&response_type=id_token&scope=profile email&redirect_uri=${params.redirect_url}`, this)
          this.isLoading = false;
          break;
        case "orcid":
          await this.$store.dispatch("generateNonce")

          params = {
            id: process.env.VUE_APP_ORCID_CLIENT_ID,
            url: "https://orcid.org/oauth/authorize",
            redirect_url: window.location.origin + "/callback/ORCID/login",
            nonce: this.$store.getters.getNonce
          }
          oauth(`${params.url}?client_id=${params.id}&nonce=${params.nonce}&response_type=token&scope=openid&redirect_uri=${params.redirect_url}`, this)
          this.isLoading = false;
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="sass">
@import "@/assets/style/variables.sass"

.login-card
  padding: 3rem 3rem 2rem 3rem
.login-tab .tab-content
  padding: 1rem 0 !important
.oauth
  @media screen and (max-width: $break-mobile)
    margin-top: 1rem !important
  &.signup
    margin-top: 1rem
.forget-password
  padding: 0.25rem 0 1rem 0
button
  &.google-signin
    background-image: url("../../assets/image/google_signin_normal.png")
    &:focus
      background-image: url("../../assets/image/google_signin_focus.png")
      box-shadow: unset
    &:active
      background-image: url("../../assets/image/google_signin_active.png")
    background-size: auto 40px
    padding: 0
    border: unset
    height: 40px
    width: 167px
  &.orcid-signin
    border: unset
    box-shadow: 0 1px 1px 0 rgba(0,0,0,.25)
    border-radius: 2px
    height: 34px
    &:active
      background-color: #eeeeee
    &:focus
      box-shadow: 0 0 0 0.25em rgba(62, 146, 204, 0.25) !important
    img
      height: 18px
      padding-right: 18px
    span
      font-size: 12px
      font-weight: bold
</style>