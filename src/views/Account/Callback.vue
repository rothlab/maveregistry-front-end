<template>
  <div class="section callback">
    <div class="content">
      <h1 class="title has-text-centered">
        Authenticate with {{ authMethod }}
      </h1>
      <b-loading :active="isLoading" />
      
      <div
        class="section"
        v-if="isSignup || !hasEmail"
      >
        <div class="content">
          <p class="is-size-5">
            Please provide your email address
            <b-tooltip
              multilined
              position="is-left"
              type="is-dark"
              label="Unable to retrieve email address due to your ORCID privacy setting"
            >
              <b-icon icon="mdil-alert-circle" />
            </b-tooltip>
          </p>
        </div>
        <ValidationObserver
          ref="observer"
          v-slot="{ passed }"
        >
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
                v-model.trim="userInfo.email"
              />
            </b-field>
          </ValidationProvider>
          <p class="control">
            <b-button
              expanded
              class="is-primary"
              :disabled="!passed"
              @click="validateOrcid(userInfo.email)"
            >
              Proceed with Sign Up
            </b-button>
          </p>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { displayErrorToast } from "@/api/errorHandler.js"

function getFullSize(url) {
  // Cover these two types of links:
  // 1) https://lh3.googleusercontent.com/a-/imageid-tUc=s96
  // 2) https://lh3.googleusercontent.com/imageid/imageid/imageid/imageid/s96-c/photo.jpg
  return url.replace(/(=.+|\/s96-c)/, "")
}

function getInfoFromToken(token) {
  return JSON.parse(atob(token.split('.')[1]))
}

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  computed: {
    authMethod () {
      if (this.$route.params) {
        return this.$route.params.method
      }

      return undefined
    },
    isSignup () {
      if (this.$route.params) {
        return this.$route.params.action == 'signup'
      }

      return false
    }
  },
  data () {
    return {
      userInfo: {
        first_name: "",
        last_name: "",
        email: "",
        auth: {}
      },
      isLoading: false,
      hasEmail: true,
      firstTry: true
    }
  },
  methods: {
    async validateOrcid(email) {
      this.isLoading = true

      // Get auth payload
      const params = new URLSearchParams(this.$route.hash)
      const payload = {
        access_token: params.get("#access_token"),
        id_token: params.get("id_token"),
      }

      // Get user information from ID token
      const info = getInfoFromToken(payload.id_token)
      this.userInfo.first_name = info.given_name
      this.userInfo.last_name = info.family_name

      // Get auth data
      this.userInfo.auth = {
        id: info.sub,
        id_token: payload.id_token
      }
      
      // If signing up, prompt the user to provide an email
      if (!email && this.isSignup) {
        this.isLoading = false
        return
      }

      // Otherwise, either response has email or email has been filled
      // Now, sign up user
      let ret
      try {
        ret = await this.$store.dispatch('signupLoginUserOrcid', this.userInfo)

        if (ret === "resend_email") return
      } catch (e) {
        await displayErrorToast(e)
        return
      } finally {
        this.isLoading = false
      }

      // If email is missing from the returned user,
      // it means we were registering and if the router is /login
      // we still need to collect user email
      this.hasEmail = ret.email && ret.email !== ""
      if (!this.hasEmail && this.firstTry) {
        this.firstTry = false
        return
      } else if (!this.hasEmail) {
        let userUpdate = this.userInfo
        delete userUpdate.auth

        try {
          await this.$store.dispatch('updateUserProfile', userUpdate)

          window.close()
        } catch (e) {
          await displayErrorToast(e)
          return
        }
      }

      window.close()
    },
    async validateGoogle() {
      this.isLoading = true

      // Get auth payload
      const params = new URLSearchParams(this.$route.hash)
      const token = params.get("#id_token")
      // Get user profile
      try {
        if (!token) throw new Error("Missing ID Token.")

        const response = getInfoFromToken(token)

        // Check nonce
        const nonce = this.$store.getters.getNonce
        if (!response.nonce || nonce !== response.nonce) throw new Error("ID token is compromised.")

        if (!response) throw new Error("Empty response.")
        this.userInfo.first_name = response.given_name
        this.userInfo.last_name = response.family_name
        this.userInfo.email = response.email
        this.userInfo.profile_image = getFullSize(response.picture)
        this.userInfo.auth = {
          id: response.sub,
          id_token: token,
        }
        await this.$store.dispatch("signupLoginUserGoogle", this.userInfo)
        window.close()
      } catch (error) {
        this.$buefy.toast.open({
          duration: 5000,
          message: "Authentication failed with Google",
          type: 'is-danger',
          queue: false
        })
        throw error
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    switch (this.authMethod) {
      case "ORCID":
        await this.validateOrcid()
        break
      case "Google":
        await this.validateGoogle()
        break
      default:
        break
    }
  }
}
</script>