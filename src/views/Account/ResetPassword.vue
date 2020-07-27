<template>
  <div>
    <div class="container has-fullheight-no-header has-top-padding has-touch-container-padding">
      <div class="columns is-centered has-vcentered-page">
        <div class="column is-5">
          <div
            v-if="!showSuccess"
            class="card"
          >
            <div class="card-content content">
              <h2 class="title">
                Reset Password
              </h2>
              <p class="subtitle is-size-6">
                Don't worry, happens to the best of us 😜
              </p>
              
              <transition
                name="slide-fade"
                mode="out-in"
              >
                <div
                  v-if="!hasReset"
                  class="reset-region"
                  key="email"
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
                      <b-field
                        :message="errors"
                        class="field-margin"
                        :type="{ 'is-danger': errors[0], '': valid }"
                        label="Please provide your email address"
                      >
                        <b-input
                          icon="mdil-email"
                          type="email"
                          placeholder="Email"
                          v-model.trim="email"
                        />
                      </b-field>
                    </ValidationProvider>
                    <p class="control">
                      <b-button
                        expanded
                        :disabled="!passed"
                        class="is-primary"
                        @click="resetPass"
                        :loading="isActionLoading"
                      >
                        Email me a recovery link
                      </b-button>
                    </p>
                  </ValidationObserver>
                </div>

                <!-- Reset successful -->
                <div
                  v-else
                  class="reset-region"
                  key="success"
                >
                  <p class="has-text-success has-text-centered">
                    <b-icon
                      type="is-success"
                      icon="mdil-check"
                    />
                    <span>A recovery link will be sent if the email address is on file.</span>
                  </p>
                  <p>
                    For security reasons, <b>the link is valid for 2 hours.</b> <br>
                    If you do not receive an email within 5 minutes, check spam folder.
                  </p>
                </div>
              </transition>
            </div>
          </div>

          <div v-else>
            <Success message="Your password has been reset" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as UserManage from "@/api/userManage.js"
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Success from "@/components/Success.vue"
import { displayErrorToast } from "@/api/errorHandler.js"

export default {
  title: "Reset Password",
  props: {
    showSuccess: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    Success
  },
  data () {
    return {
      email: "",
      isActionLoading: false,
      hasReset: false
    }
  },
  methods: {
    async resetPass() {
      if (!this.email !== "") {
        this.isActionLoading = true

        // Reset password
        try {
          await UserManage.resetPassword(this.email)

          this.hasReset = true
        } catch (error) {
          await displayErrorToast(error)
        }

        this.isActionLoading = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.reset-region
  padding-top: 1rem
.slide-fade-enter-active, .slide-fade-leave-active
  transition: all .3s ease
.slide-fade-enter, .slide-fade-leave-to
  transform: translateX(10px)
  opacity: 0
</style>