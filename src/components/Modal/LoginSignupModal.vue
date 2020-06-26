<template>
  <b-modal
    :active.sync="isActive"
    :width="500"
  >
    <div class="card">
      <div class="card-content">
        <div class="section">
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
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { handleError } from "@/api/errorHandler.js";
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import PasswordField from "@/components/Field/PasswordField.vue"

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    PasswordField
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

      // Display recaptcha badge
      this.recaptchaBadge(val)
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
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: ""
    };
  },
  computed: {
    hasLoggedIn() {
      return this.$store.state.hasLoggedIn
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
    recaptchaBadge(active) {
      const recaptcha = this.$recaptchaInstance
      
      if (active) {
        recaptcha.showBadge()
      } else {
        recaptcha.hideBadge()
      }
    },
    parseGoogleSigninError(e, authCode) {
      let message = "";

      if (e) return;

      if (!e) {
        message = "Something went wrong with Google Sign-in.";
      } else if (!authCode) {
        message = "Authentication failed.";
      }

      this.$buefy.toast.open({
        duration: 5000,
        message: message,
        type: "is-danger",
        queue: false
      });
    },
    parseGoogleSigninRes(googleUser) {
      const basicProfile = googleUser.getBasicProfile();

      if (!googleUser) return;

      // TODO: move profile image resizing to the backend
      let imgUrl = basicProfile.getImageUrl();
      if (imgUrl) imgUrl = imgUrl.substring(0, imgUrl.lastIndexOf("=")); // Get original size image

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
      let timer
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
                password: this.password
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
          try {
            // Bring up Google Sign-in
            const googleUser = await this.$gAuth.signIn();
            user = this.parseGoogleSigninRes(googleUser);
          } catch (e) {
            this.parseGoogleSigninError(e, user);
            return;
          }

          // Handle Sign up in the backend
          try {
            await this.$store.dispatch("signupLoginUserGoogle", user);

            this.isActive = false;
          } catch (e) {
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
        case "orcid":
          // Bring up ORCID window
          window.open(
            `https://orcid.org/oauth/authorize?client_id=APP-TNM3Y1CPZI5HS7WJ&response_type=token&scope=openid&redirect_uri=${window.location.origin}/callback/ORCID/signup`,
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
          timer = setInterval(() => {
            if (this.hasLoggedIn) {
              this.isActive = false;
              clearInterval(timer);
            }
          }, 1000)

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
      let user = undefined;
      let timer
      switch (method) {
        case "password":
          // With password
          try {
            await this.$store.dispatch(
              "loginUserPassword",
              {
                first_name: this.firstName,
                last_name: this.lastName,
                username: this.username,
                email: this.email,
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
          try {
            // Bring up Google Sign-in
            const googleUser = await this.$gAuth.signIn();
            user = this.parseGoogleSigninRes(googleUser);
          } catch (e) {
            this.parseGoogleSigninError(e, user);
            return;
          }

          // Handle verification in the backend
          try {
            await this.$store.dispatch("signupLoginUserGoogle", user);

            this.isActive = false;
          } catch (e) {
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
        case "orcid":
          // Bring up ORCID window
          window.open(
            `https://orcid.org/oauth/authorize?client_id=APP-TNM3Y1CPZI5HS7WJ&response_type=token&scope=openid&redirect_uri=${window.location.origin}/callback/ORCID/login`,
            "targetWindow",
            `toolbar=no,
               location=no,
               status=no,
               menubar=no,
               scrollbars=yes,
               resizable=yes,
               width=500px,
               height=600px`
          );

          // Handle results
          timer = setInterval(() => {
            if (this.hasLoggedIn) {
              this.isActive = false;
              clearInterval(timer);
            }
          }, 1000);

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
.grecaptcha-badge
  z-index: 50
</style>