<template>
  <div>
    <div class="container has-fullheight-no-header has-top-padding has-touch-container-padding">
      <div class="columns is-centered has-vcentered-page">
        <div class="column is-5">
          <div class="card">
            <div class="card-content content">
              <h2 class="title">
                Change Password
              </h2>

              <div
                class="reset-region"
                key="email"
              >
                <ValidationObserver
                  ref="observer"
                  v-slot="{ passed }"
                >
                  <form
                    :action="apiEndPoint"
                    method="post"
                  >
                    <b-field label="Username">
                      <span>{{ token.username }}</span>
                    </b-field>
                    <p class="has-text-weight-semibold">
                      Please choose a new password
                    </p>
                    <PasswordField
                      has-confirm
                      v-model="password"
                    />
                    <p class="control">
                      <b-button
                        expanded
                        :disabled="!passed"
                        class="is-primary"
                        :loading="isActionLoading"
                        native-type="submit"
                      >
                        Update Password
                      </b-button>
                    </p>

                    <!-- Hidden submission -->
                    <input
                      name="username"
                      type="hidden"
                      :value="token.username"
                    >
                    <input
                      name="token"
                      type="hidden"
                      :value="token.token"
                    >
                    <input
                      name="new_password"
                      type="hidden"
                      :value="password"
                    >
                    <input
                      name="confirm_new_password"
                      type="hidden"
                      :value="password"
                    >
                  </form>
                </ValidationObserver>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import PasswordField from '@/components/Field/PasswordField.vue'
import { Parse } from "@/api/parseConnect.js"

export default {
  title: "Change Password",
  components: {
    ValidationObserver,
    PasswordField
  },
  computed: {
    token() {
      return {
        token: this.$route.query.token,
        username: this.$route.query.username
      }
    },
    error() {
      return this.$route.query.error
    }
  },
  data () {
    return {
      isActionLoading: false,
      password: "",
      apiEndPoint: Parse.serverURL + 'apps/' + Parse.applicationId + '/request_password_reset'
    }
  },
  mounted() {
    if (this.error) {
      this.$buefy.toast.open({
        duration: 5000,
        message: this.error,
        type: 'is-danger',
        queue: false
      })
    }
  }
}
</script>