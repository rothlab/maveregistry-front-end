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
                Invitation
              </h2>

              <div v-if="invitation">
                <p class="is-capitalized">
                  Hi {{ invitation.to.first_name }} {{ invitation.to.last_name }},
                </p>

                <p class="is-flex field-margin">
                  <router-link
                    class="is-inline-flex has-vcentered"
                    :to="{ name: 'User Profile View', params: { username: invitation.from.username } }"
                    target="_blank"
                  >
                    <figure
                      class="image is-24x24 is-inline-flex"
                      style="margin: 0 0.5rem 0 0"
                    >
                      <img
                        class="is-rounded"
                        :src="getProfileImageFromUser(invitation.from)"
                        alt="Profile Image"
                      >
                    </figure>
                    <span class="is-capitalized">
                      {{ invitation.from.first_name }}
                      {{ invitation.from.last_name }}
                    </span>
                  </router-link>
                  <span style="margin-left: 0.5rem">invites you to {{ action ? `${action} a` : `${action} their` }} {{ invitation.target.type }}.</span>
                </p>

                <b-message
                  v-if="invitation.message || (invitation.target && invitation.target.details)"
                  class="field-margin"
                  type="is-info"
                >
                  <!-- Message -->
                  <div
                    v-if="invitation.message"
                    class="invitation-detail"
                  >
                    <p class="is-size-5">
                      <b-icon icon="mdil-message-text" />
                      <span>Message</span>
                    </p>
                    <p class="has-white-space-pre">
                      {{ invitation.message.trim() }}
                    </p>
                  </div>
                  <!-- Team detail -->
                  <div
                    v-if="invitation.target && invitation.target.details"
                    class="invitation-detail"
                  >
                    <p class="is-size-5">
                      <b-icon icon="mdil-information" />
                      <span class="is-capitalized">{{ invitation.target.type }} detail</span>
                    </p>
                    <p
                      v-for="(detail, id) in invitation.target.details"
                      :key="id"
                      class="is-capitalized"
                    >
                      {{ detail }}
                    </p>
                  </div>
                </b-message>

                <div v-if="!isAccepted">
                  <p>Would you like to accept this invitation?</p>

                  <footer>
                    <b-button
                      type="is-success"
                      icon-left="mdil-check"
                      expanded
                      :loading="isLoading.accept"
                      @click="acceptInvitation"
                    >
                      Accept Invitation
                    </b-button>
                  </footer>
                </div>

                <div v-else>
                  <footer>
                    <div class="buttons">
                      <b-button
                        type="is-success"
                        icon-left="mdil-check"
                        disabled
                        expanded
                      >
                        Invitation Accepted
                      </b-button>

                      <b-button
                        tag="router-link"
                        v-if="invitation.target && invitation.target.type && invitation.target.id"
                        type="is-primary-light"
                        icon-left="mdil-link"
                        expanded
                        :to="`/${invitation.target.type}/${invitation.target.id}`"
                      >
                        View {{ invitation.target.type }}
                      </b-button>

                      <b-button
                        tag="router-link"
                        v-if="invitation.target && invitation.target.type && !invitation.target.id"
                        type="is-primary-light"
                        icon-left="mdil-link"
                        expanded
                        :to="`/${invitation.target.type}s#create`"
                        class="is-capitalized"
                      >
                        {{ action }} a {{ invitation.target.type }}
                      </b-button>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Log in/Sign up panel -->
      <LoginSignupModal
        :active.sync="isLoginSignupModalActive"
      />
    </div>
  </div>
</template>

<script>
import * as InviteManage from "@/api/inviteManage.js"
import { handleError, displayErrorToast } from "@/api/errorHandler.js"
import Error from '@/components/Error.vue'
import LoginSignupModal from "@/components/Modal/LoginSignupModal.vue"

export default {
  components: {
    Error,
    LoginSignupModal
  },
  data() {
    return {
      isLoading: {
        page: false,
        accept: false
      },
      isLoginSignupModalActive: false,
      isAccepted: false,
      errorMessage: "",
      invitation: undefined
    }
  },
  computed: {
    inviteId() {
      return this.$route.params.id
    },
    action() {
      if (this.invitation.target && this.invitation.target.id) return "join"
      return "create"
    }
  },
  async mounted() {
    await this.loadInvitation()
  },
  methods: {
    async loadInvitation() {
      this.isLoading.page = true

      try {
        this.invitation = await InviteManage.queryInvitation(this.inviteId)
        this.isAccepted = !!this.invitation.accept_date

        // If internal invitation and object specific, jump to corresponding page
        if (this.invitation.type === "internal" && this.invitation.target && this.invitation.target.id) {
          this.$router.push({
            path: `/${this.invitation.target.type}/${this.invitation.target.id}#review-invite-request`
          })
        }
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.page = false
      }
    },
    async acceptInvitation() {
      // If not logged in, prompt login panel
      if (!this.hasLoggedIn) {
        this.isLoginSignupModalActive = true
        return
      }

      this.isLoading.accept = true

      try {
        await InviteManage.acceptInvitation(this.inviteId)
        this.isAccepted = true

        this.$buefy.toast.open({
          duration: 5000,
          message: `Invitation accepted`,
          type: 'is-success',
          queue: false
        })
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.accept = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.invitation-detail  
  margin-bottom: 1rem
  &:last-child
    margin-bottom: 0
  p
    margin-bottom: 0.25rem
</style>