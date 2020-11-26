<template>
  <b-modal
    :active.sync="isActive"
    :can-cancel="['escape', 'outside']"
    :width="600"
    class="card-modal"
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

        <div class="container">
          <b-message type="is-warning">
            <div class="level">
              <div class="level-left">
                Opt out from all email communications
              </div>
              <div class="level-right">
                <b-button
                  icon-left="mdil-logout"
                  type="is-warning-light"
                  tag="router-link"
                  :to="{ name: 'Opt Out', params: {email: this.currentUser.email } }"
                >
                  Opt out
                </b-button>
              </div>
            </div>
          </b-message>

          <b-tabs
            position="is-centered"
            type="is-boxed"
          >
            <b-tab-item label="Request">
              <div
                class="columns is-mobile"
              >
                <div class="column">
                  <span class="is-size-6 has-text-primary">Follow</span>
                  <span class="is-size-7 help">Email me requests to follow my projects and teams.</span>
                </div>
                <div class="column is-4">
                  <b-select
                    placeholder="Frequency"
                    expanded
                    v-model="follow_request"
                  >
                    <option value="off">
                      Off
                    </option>
                    <option value="immediately">
                      Immediately
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

              <div
                class="columns is-mobile"
              >
                <div class="column">
                  <span class="is-size-6 has-text-primary">Join Team</span>
                  <span class="is-size-7 help">Email me requests to join my teams.</span>
                </div>
                <div class="column is-4">
                  <b-select
                    placeholder="Frequency"
                    expanded
                    v-model="join_team_request"
                  >
                    <option value="off">
                      Off
                    </option>
                    <option value="immediately">
                      Immediately
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
            </b-tab-item>

            <b-tab-item label="Update">
              <div class="columns is-mobile">
                <div class="column">
                  <span class="is-size-6 has-text-primary">Target</span>
                  <span class="is-size-7 help">Email me updates concerning targets I follow.</span>
                </div>
                <div class="column is-4">
                  <b-select
                    placeholder="Frequency"
                    expanded
                    v-model="target_update"
                  >
                    <option value="off">
                      Off
                    </option>
                    <option value="immediately">
                      Immediately
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
                  <span class="is-size-6 has-text-primary">Project</span>
                  <span class="is-size-7 help">Email me updates concering projects I follow.</span>
                </div>
                <div class="column is-4">
                  <b-select
                    placeholder="Frequency"
                    expanded
                    v-model="project_update"
                  >
                    <option value="off">
                      Off
                    </option>
                    <option value="immediately">
                      Immediately
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
                  <span class="is-size-6 has-text-primary">Team</span>
                  <span class="is-size-7 help">Email me updates concerning teams I follow.</span>
                </div>
                <div class="column is-4">
                  <b-select
                    placeholder="Frequency"
                    expanded
                    v-model="team_update"
                  >
                    <option value="off">
                      Off
                    </option>
                    <option value="immediately">
                      Immediately
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
                  <span class="is-size-6 has-text-primary">Registry status</span>
                  <span class="is-size-7 help">Email me status updates of the Registry.</span>
                </div>
                <div class="column is-4">
                  <b-select
                    placeholder="Frequency"
                    expanded
                    v-model="status_update"
                  >
                    <option value="off">
                      Off
                    </option>
                    <option value="weekly">
                      Weekly
                    </option>
                    <option value="monthly">
                      Monthly
                    </option>
                    <option value="quarterly">
                      Quarterly
                    </option>
                  </b-select>
                </div>
              </div>
            </b-tab-item>

            <b-tab-item label="Communication">
              <div class="columns is-mobile">
                <div class="column">
                  <span class="is-size-6 has-text-primary">Newsletters</span>
                  <span class="is-size-7 help">Email me infrequent newsletters about the Registry.</span>
                </div>
                <div class="column is-4">
                  <b-select
                    placeholder="Frequency"
                    expanded
                    v-model="newsletter"
                  >
                    <option value="off">
                      Off
                    </option>
                    <option value="immediately">
                      Immediately
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
            </b-tab-item>
          </b-tabs>

          <!-- If opted out, show notice -->
          <b-loading
            :is-full-page="false"
            v-model="optedOut"
            class="overlay"
          >
            <b-icon icon="mdil-blank" />
          </b-loading>
        </div>
        
        <footer>
          <div
            class="content has-text-right"
            v-if="!optedOut"
          >
            <b-button
              icon-left="mdil-content-save"
              type="is-primary"
              :loading="isLoading.submit"
              @click="setPreference"
            >
              Save Preference
            </b-button>
          </div>
          <div v-else>
            <b-notification
              :closable="false"
              type="is-primary-light"
              role="alert"
            >
              <div class="level">
                <div class="level-left">
                  <div class="level-item">
                    You have opted out from all email notifications.
                  </div>
                </div>
                <div class="level-right">
                  <div class="level-item">
                    <b-button
                      type="is-primary"
                      :loading="isLoading.submit"
                      @click="optIn"
                    >
                      Opt back in
                    </b-button>
                  </div>
                </div>
              </div>
            </b-notification>
          </div>
        </footer>
      </div>
    </div>

    <b-loading
      :active="isLoading.page"
      :is-full-page="false"
    />
  </b-modal>
</template>

<script>
import * as UserManage from "@/api/userManage.js"
import * as NotificationManage from "@/api/notificationManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"

export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  watch: {
    isActive(val) {
      if (val !== this.active) {
        this.$emit("update:active", val)
      }
    },
    async active(val) {
      if (val != this.isActive) {
        this.isActive = val
      }

      // Fetch preference if active
      if (val) {
        await this.getPreference()
      }
    }
  },
  data() {
    return {
      isActive: false,
      isLoading: {
        page: false,
        submit: false
      },
      optedOut: false,
      follow_request: "",
      join_team_request: "",
      target_update: "",
      project_update: "",
      team_update: "",
      status_update: "",
      newsletter: ""
    }
  },
  methods: {
    async getPreference() {
      this.isLoading.page = true
      let preference

      try {
        this.optedOut = !!await NotificationManage.fetchOptOutStatus(this.currentUser.email)
        preference = await UserManage.getEmailPreference(this.id)
      } catch (error) {
        this.isActive = false
        await displayErrorToast(error)
        return
      } finally {
        this.isLoading.page = false
      }

      if (preference) {
        this.follow_request = preference.follow_request
        this.join_team_request = preference.join_team_request
        this.target_update = preference.target_update
        this.project_update = preference.project_update
        this.team_update = preference.team_update
        this.status_update = preference.status_update
        this.newsletter = preference.newsletter
      }
    },
    async setPreference() {
      this.isLoading.submit = true

      if (this.id !== "") {
        try {
          await UserManage.setEmailPreference(this.id, {
            follow_request: this.follow_request,
            join_team_request: this.join_team_request,
            target_update: this.target_update,
            project_update: this.project_update,
            team_update: this.team_update,
            status_update: this.status_update,
            newsletter: this.newsletter
          })
        } catch (error) {
          await displayErrorToast(error)
          return
        } finally {
          this.isLoading.submit = false
          this.isActive = false
        }

        this.$buefy.toast.open({
          duration: 5000,
          message: `Email Preference Updated`,
          type: 'is-success',
          queue: false
        })
      }
    },
    async optIn() {
      this.isLoading.submit = true 

      try {
        await NotificationManage.optOutEmail(this.currentUser.email)
        await this.getPreference()

        this.$buefy.toast.open({
          duration: 5000,
          message: `Opted ${this.optedOut ? 'out' : 'in'}`,
          type: 'is-success',
          queue: false
        })
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.submit = false
      }
    }
  }
}
</script>