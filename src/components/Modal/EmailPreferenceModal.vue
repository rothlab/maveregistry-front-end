<template>
  <div>
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
                  v-model="follow_request"
                >
                  <option value="off">
                    Off
                  </option>
                  <option value="when available">
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
                  v-model="project_update"
                >
                  <option value="off">
                    Off
                  </option>
                  <option value="when available">
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
                  v-model="team_update"
                >
                  <option value="off">
                    Off
                  </option>
                  <option value="when available">
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
                  v-model="newsletter"
                >
                  <option value="off">
                    Off
                  </option>
                  <option value="when available">
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
                :loading="isLoading.submit"
                @click="setPreference"
              >
                Save Preference
              </b-button>
            </div>
          </footer>
        </div>
      </div>

      <b-loading
        :active="isLoading.page"
        :is-full-page="false"
      />
    </b-modal>
  </div>
</template>

<script>
import * as UserManage from "@/api/userManage.js"
import { handleError } from "@/api/errorHandler.js"

export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    email: {
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
      id: "",
      follow_request: "",
      project_update: "",
      team_update: "",
      newsletter: ""
    }
  },
  methods: {
    async getPreference() {
      this.isLoading.page = true
      let preference

      try {
        preference = await UserManage.getEmailPreference(this.email)
      } catch (error) {
        this.$buefy.toast.open({
          duration: 5000,
          message: await handleError(error),
          type: 'is-danger',
          queue: false
        })
        this.isActive = false
        return
      } finally {
        this.isLoading.page = false
      }

      if (preference) {
        this.id = preference.id
        this.follow_request = preference.follow_request
        this.project_update = preference.project_update
        this.team_update = preference.team_update
        this.newsletter = preference.newsletter
      }
    },
    async setPreference() {
      this.isLoading.submit = true

      if (this.id !== "") {
        try {
          await UserManage.setEmailPreference(this.id, {
            follow_request: this.follow_request,
            project_update: this.project_update,
            team_update: this.team_update,
            newsletter: this.newsletter
          })
        } catch (error) {
          this.$buefy.toast.open({
            duration: 5000,
            message: await handleError(error),
            type: 'is-danger',
            queue: false
          })
          return
        } finally {
          this.isLoading.submit = false
          this.isActive = false
        }

        this.$buefy.toast.open({
          duration: 5000,
          message: `Successfully updated email preference`,
          type: 'is-success',
          queue: false
        })
      }
    }
  }
}
</script>