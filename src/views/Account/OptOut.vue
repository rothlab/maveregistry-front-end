<template>
  <div>
    <div class="container has-fullheight-no-header has-top-padding has-touch-container-padding">
      <b-loading
        v-model="isLoading.page"
        :is-full-page="false"
      />

      <Error
        v-if="!isLoading.page && errorMessage !== ''"
        :message="errorMessage"
      />

      <div
        v-else
        class="columns is-centered has-vcentered-page"
      >
        <div class="column is-5">
          <div class="card">
            <div class="card-content content">
              <h2 class="title">
                Opt-{{ optedOut ? "in" : "out" }}
              </h2>

              <p>
                <span v-if="optedOut">You have opted out from all email communications.<br>Would you like to opt back in?</span>
                <span v-else>Would you like to opt out from all email communications?</span>
              </p>

              <footer>
                <vue-hcaptcha
                  v-if="useCaptcha"
                  sitekey="57b34ff1-21ab-4eee-b0f1-a16071d64d34"
                  size="invisible"
                  ref="captcha"
                  @verify="onVerifyCaptcha"
                  @expired="onErrorCaptcha('Captcha Expired')"
                  @error="onErrorCaptcha"
                />
                <b-button
                  :type="optedOut ? 'is-success' : 'is-warning'"
                  expanded
                  :loading="isLoading.optout"
                  @click="executeCaptcha"
                >
                  {{ optedOut ? "Opt in to email communications" : "Opt out of email communications" }}
                </b-button>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as NotificationManage from "@/api/notificationManage.js"
import { handleError, displayErrorToast } from "@/api/errorHandler.js"
import Error from '@/components/Error.vue'
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'

export default {
  components: {
    Error,
    VueHcaptcha
  },
  computed: {
    email() {
      return this.$route.params.email
    },
    useCaptcha() {
      return !this.currentUser || this.currentUser.email !== this.email
    }
  },
  data() {
    return {
      isLoading: {
        page: false,
        optout: false
      },
      optedOut: false,
      errorMessage: ""
    }
  },
  async mounted() {
    if (!this.email) this.errorMessage = "Missing email"

    // Fetch status
    await this.fetchStatus()
  },
  methods: {
    executeCaptcha() {
      // If opt-in, no need to run captcha
      if (this.optedOut || !this.useCaptcha) {
        this.optOut()
      } else {
        this.$refs.captcha.execute()
      }
    },
    async onVerifyCaptcha(response) {
      await this.optOut(response)
    },
    async onErrorCaptcha(err) {
      await displayErrorToast(err)
    },
    async fetchStatus() {
      this.isLoading.page = true

      try {
        this.optedOut = !!await NotificationManage.fetchOptOutStatus(this.email)
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.page = false
      }
    },
    async optOut(response) {
      this.isLoading.optout = true 

      try {
        await NotificationManage.optOutEmail(this.email, response)
        this.optedOut = !this.optedOut

        this.$buefy.toast.open({
          duration: 5000,
          message: `Opted ${this.optedOut ? 'out' : 'in'}`,
          type: 'is-success',
          queue: false
        })
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.optout = false
      }
    }
  }
}
</script>