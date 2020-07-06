<template>
  <div class="action-buttons">
    <b-button
      icon-left="mdil-lock"
      type="is-light"
      expanded
      @click="resetPassword"
      :loading="isLoading"
    >
      Reset Password
    </b-button>
    <b-button
      icon-left="mdil-email"
      type="is-light"
      expanded
      @click="setEmailPreference"
      :loading="isLoading"
    >
      Set Email Preference
    </b-button>
    <b-button
      icon-left="mdil-delete"
      type="is-light"
      expanded
      disabled
    >
      Delete Account (Under Dev.)
    </b-button>

    <!-- Email frequency modal -->
    <b-modal
      :active.sync="isActive"
      :can-cancel="['escape', 'outside']"
      :width="600"
    >
      <div class="card">
        <div class="card-content manage-follower">
          <!-- Title -->
          <header class="level is-mobile">
            <div class="level-left">
              <p class="is-capitalized is-size-5">
                Email Preference
              </p>
            </div>
            <div class="level-right">
              <button
                class="delete"
                aria-label="close"
                @click="isActive = false"
              />
            </div>
          </header>

          <div class="content">
            <div class="columns is-mobile">
              <div class="column">
                <span class="is-size-6 has-text-primary">Follow requests</span>
                <span class="is-size-7 help">You will be notified for requests to follow your projects or team.</span>
              </div>
              <div class="column is-narrow">
                <b-select
                  placeholder="Frequency"
                  expanded
                >
                  <option value="off">
                    Off
                  </option>
                  <option value="immediately">
                    When available
                  </option>
                  <option value="daily">
                    Daily
                  </option>
                  <option value="weekly">
                    Weekly
                  </option>
                </b-select>
              </div>
            </div>
            <div class="columns is-mobile">
              <div class="column">
                <span class="is-size-6 has-text-primary">Project updates</span>
                <span class="is-size-7 help">You will be notified for updates of projects you follow.</span>
              </div>
              <div class="column is-narrow">
                <b-select
                  placeholder="Frequency"
                  expanded
                >
                  <option value="off">
                    Off
                  </option>
                  <option value="immediately">
                    When available
                  </option>
                  <option value="daily">
                    Daily
                  </option>
                  <option value="weekly">
                    Weekly
                  </option>
                </b-select>
              </div>
            </div>
            <div class="columns is-mobile">
              <div class="column">
                <span class="is-size-6 has-text-primary">Team updates</span>
                <span class="is-size-7 help">You will be notified for updates of teams you follow.</span>
              </div>
              <div class="column is-narrow">
                <b-select
                  placeholder="Frequency"
                  expanded
                >
                  <option value="off">
                    Off
                  </option>
                  <option value="immediately">
                    When available
                  </option>
                  <option value="daily">
                    Daily
                  </option>
                  <option value="weekly">
                    Weekly
                  </option>
                </b-select>
              </div>
            </div>
            <div class="columns is-mobile">
              <div class="column">
                <span class="is-size-6 has-text-primary">Newsletters</span>
                <span class="is-size-7 help">We may send you infrequent newsletters about Mave Registry.</span>
              </div>
              <div class="column is-narrow">
                <b-select
                  placeholder="Frequency"
                  expanded
                >
                  <option value="off">
                    Off
                  </option>
                  <option value="immediately">
                    When available
                  </option>
                  <option value="quarterly">
                    Quarterly
                  </option>
                  <option value="yearly">
                    Yearly
                  </option>
                </b-select>
              </div>
            </div>
          </div>

          <footer>
            <div class="content has-text-right">
              <b-button
                icon-left="mdil-content-save"
                type="is-primary"
              >
                Save Preference
              </b-button>
            </div>
          </footer>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as UserManage from "@/api/userManage.js"
import { handleError } from "@/api/errorHandler.js"

export default {
  props: {
    email: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      isActive: false,
    }
  },
  methods: {
    async resetPassword() {
      try {
        this.isLoading = true

        await UserManage.resetPassword(this.email)

        // Confirmation
        this.$buefy.toast.open({
          duration: 5000,
          message: "A password reset email is sent. Please check your mailbox.",
          type: 'is-success',
          queue: false
        })
      } catch (error) {
        this.$buefy.toast.open({
          duration: 5000,
          message: await handleError(error),
          type: 'is-danger',
          queue: false
        })
      }

      this.isLoading = false
    },
    setEmailPreference() {
      this.isActive = true
    }
  }
}
</script>

<style lang="sass" scoped>
.action-buttons
  .button
    margin-bottom: 0.5rem
</style>