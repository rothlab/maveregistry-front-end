<template>
  <div>
    <!-- Header -->
    <div class="hero is-light is-bold">
      <div class="hero-body has-page-header-padding">
        <div class="container">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="content">
                <p class="is-size-3 has-text-weight-medium">
                  User Profile
                </p>
              </div>
            </div>
            <div
              class="level-right"
              v-if="isOwner"
            >
              <!-- Edit project -->
              <b-button
                icon-left="mdil-pencil"
                type="is-primary"
                size="is-medium"
                @click="editProject"
              >
                Edit
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <div
        class="columns"
        v-if="showProfile"
      >
        <div class="column is-7">
          <div
            class="content"
          >
            <div class="project-header">
              <p class="is-size-4 has-text-weight-bold">
                Personal
              </p>
            </div>

            <div class="project-content">
              <p
                class="is-size-5"
                v-if="userInfo.username"
              >
                <b>Username</b> <br>
                {{ userInfo.username }}
              </p>

              <p
                class="is-size-5 is-capitalized"
                v-if="userInfo.first_name && userInfo.last_name"
              >
                <b>Name</b> <br>
                {{ userInfo.first_name }} {{ userInfo.last_name }}
              </p>

              <div
                class="is-size-5 p-margin"
                v-if="userInfo.email"
              >
                <b>Email</b> <br>
                <div class="level is-paddingless">
                  <div class="level-left">
                    <span class="is-flex has-vcentered">
                      {{ userInfo.email }}
                      <b-tag
                        type="is-success"
                        style="margin: 0 0.5rem"
                        v-if="userInfo.email_validated"
                      >
                        <b-icon
                          icon="mdil-check"
                          style="padding-right: 0.25rem"
                        />
                        Validated
                      </b-tag>
                      <b-tag
                        type="is-danger"
                        style="margin: 0 0.5rem"
                        v-else
                      >
                        <b-icon
                          icon="mdil-alert"
                          style="padding-right: 0.25rem"
                        />
                        Not Validated
                      </b-tag>
                    </span>
                  </div>
                  <div
                    class="level-right resend-email"
                    v-if="!userInfo.email_validated"
                  >
                    <b-button
                      class="is-capitalized has-text-info"
                      icon-left="mdil-refresh"
                      type="is-light"
                      size="is-small"
                      style="border-radius: 4px; height: 1.5rem"
                      expanded
                      :loading="isLoading.resend_email"
                      :disabled="isDisabled.resend_email"
                      @click="resendValidationEmail"
                    >
                      Resend validation Email
                    </b-button>
                  </div>
                </div>
              </div>

              <p
                class="is-size-5"
                v-if="userInfo.website"
              >
                <b>Website</b> <br>
                <a
                  :href="userInfo.website"
                  target="_blank"
                  rel="noopener noreferrer"
                >{{ userInfo.website }}</a>
              </p>

              <div
                class="is-size-5"
                v-if="userInfo && userInfo.social"
              >
                <b>Social Media</b><br>

                <div
                  class="buttons"
                  style="margin-top: 0.25rem"
                >
                  <b-button
                    type="is-twitter"
                    tag="a"
                    :href="`https://twitter.com/${userInfo.social.twitter}`"
                    target="_blank"
                    rel="noreferrer"
                    icon-left="twitter"
                    icon-pack="mdi"
                    v-if="userInfo.social.twitter"
                  >
                    {{ userInfo.social.twitter }}
                  </b-button>
                  <b-button
                    icon-left="twitter"
                    icon-pack="mdi"
                    v-if="userInfo.social.linkedin"
                  >
                    {{ userInfo.social.linkedin }}
                  </b-button>
                </div>
              </div>
            </div>

            <hr v-if="hasProject">

            <div
              class="project-header"
              v-if="hasProject"
            >
              <p class="is-size-4 has-text-weight-bold">
                Project
              </p>
            </div>

            <div
              class="project-content"
              v-if="hasProject"
            >
              <p class="is-size-5">
                <span v-if="userInfo.team">
                  <b>Team</b> <br>
                  <a
                    :href="'mailto:' + userInfo.team.email"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <b-icon icon="mdil-email" />
                  </a>
                  <span class="is-capitalized">{{ userInfo.team.first_name + " " + userInfo.team.last_name }},</span>
                  {{ userInfo.team.affiliation }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- Profile image and actions -->
        <div
          class="column is-3 is-offset-2"
        >
          <!-- Profile image -->
          <div class="profile-image">
            <figure class="image is-square is-marginless">
              <img :src="profileImageUrl(userInfo)">
            </figure>
          </div>

          <!-- Actions -->
          <div v-if="isOwner">
            <div class="project-header">
              <p class="is-size-4 has-text-weight-bold">
                Actions
              </p>
            </div>

            <div
              class="project-content"
              v-if="userInfo.email && userInfo.notification_preference_id"
            >
              <UserProfileAction
                :email="userInfo.email"
                :notification="userInfo.notification_preference_id"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Error message display -->
      <Error
        v-else-if="errorMessage !== ''"
        :message="errorMessage"
      />

      <!-- Loading -->
      <b-loading
        :active="isLoading.page"
        :is-full-page="false"
      />
    </div>
  </div>
</template>

<script>
import * as UserManage from "@/api/userManage.js"
import * as TeamManage from "@/api/teamManage.js"
import { handleError } from "@/api/errorHandler.js"
import Error from "@/components/Error.vue"
import UserProfileAction from "@/components/Action/UserProfileAction.vue"

function initialState (){
  return {
    userInfo: {},
    showProfile: false,
    isLoading: {
      page: true,
      reset_pass: false,
      save_edit: false,
      save_profile_pic: false,
      resend_email: false
    },
    isDisabled: {
      resend_email: false
    },
    errorMessage: "",
  }
}

export default {
  components: {
    Error,
    UserProfileAction
  },
  computed: {
    isOwner() {
      return this.userInfo && this.userInfo.username && this.$store.getters.isOwner(this.userInfo.username)
    },
    hasProject() {
      return this.userInfo.team
    }
  },
  watch: {
    async $route() {
      // Reset parameters
      Object.assign(this.$data, initialState())

      // Fetch and store user information
      const username = this.$route.params.username
      this.userInfo = await this.fetchUserInfo(username)
    }
  },
  data () {
    return initialState()
  },
  async mounted () {
    const username = this.$route.params.username
    this.userInfo = await this.fetchUserInfo(username)
  },
  methods: {
    async fetchUserInfo(username) {
      this.isLoading.page = true
      
      // Get user info using username
      let res
      try {
        res = await UserManage.fetchUserInfo(username, true)

        if (res && res.team) {
          // Fetch team
          res.team = await TeamManage.queryById(res.team)
        }
      } catch (error) {
        this.errorMessage = await handleError(error)
        this.isLoading.page = false
        return undefined
      }

      // Check if owning the account.
      // Only the owner can make changes
      this.showProfile = true
      this.isLoading.page = false
      return res
    },
    editProject() {
      this.$router.push({ name: 'User Profile Edit', params: { username: this.userInfo.username, action: 'edit' } })
    },
    async resendValidationEmail() {
      this.isLoading.resend_email = true
      try {
        await UserManage.resendValidationEmail(this.userInfo.username)
      } catch (error) {
        this.$buefy.toast.open({
          duration: 5000,
          message: await handleError(error),
          type: 'is-danger',
          queue: false
        })
        return
      } finally {
        this.isLoading.resend_email = false
      }

      this.$buefy.toast.open({
        duration: 5000,
        message: "Validation email sent",
        type: 'is-success',
        queue: false
      })
      this.isDisabled.resend_email = true
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/style/variables.sass"

.profile-image
  margin-bottom: 1rem
.social-media
  margin-top: 0.5rem
.resend-email
  @media screen and (max-width: $break-mobile)
    margin-top: 0.5rem
</style>