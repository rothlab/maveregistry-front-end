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
                icon-left="mdil-content-save"
                type="is-primary"
                size="is-medium"
                :loading="isLoading.save_edit"
                @click="saveProfile"
              >
                Save
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
        <div class="column is-6">
          <div
            class="content"
          >
            <div class="project-header">
              <p class="is-size-4 has-text-weight-bold">
                Personal Information
              </p>
            </div>

            <div class="project-content">
              <ValidationObserver ref="observer">
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
                      label="First Name"
                    >
                      <b-input
                        type="text"
                        placeholder="First Name"
                        v-model="userInfo.first_name"
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
                      label="Last Name"
                    >
                      <b-input
                        type="text"
                        placeholder="Last Name"
                        v-model="userInfo.last_name"
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
                    label="Username"
                  >
                    <b-input
                      icon="mdil-account"
                      type="text"
                      placeholder="Username"
                      v-model="userInfo.username"
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
                    label="Email"
                  >
                    <b-input
                      icon="mdil-email"
                      type="email"
                      placeholder="Email"
                      v-model="userInfo.email"
                    />
                  </b-field>
                </ValidationProvider>
                <ValidationProvider
                  :rules="{ regex: 
                    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ 
                  }"
                  name="Website"
                  v-slot="{ errors, valid }"
                > 
                  <b-field
                    :message="errors"
                    class="field-margin"
                    :type="{ 'is-danger': errors[0], '': valid }"
                    label="Website (Optional)"
                  >
                    <b-input
                      icon="mdil-link"
                      type="website"
                      placeholder="http:// or https://"
                      v-model="userInfo.website"
                    />
                  </b-field>
                </ValidationProvider>
                <ValidationProvider
                  rules="alpha_num"
                  name="Twitter"
                  v-slot="{ errors, valid }"
                  v-if="userInfo.social"
                > 
                  <b-field
                    :message="errors"
                    class="field-margin"
                    :type="{ 'is-danger': errors[0], '': valid }"
                    label="Twitter (Optional)"
                  >
                    <b-input
                      type="text"
                      placeholder="Twitter Handle without @"
                      v-model="userInfo.social.twitter"
                    />
                  </b-field>
                </ValidationProvider>
              </ValidationObserver>
            </div>

            <div class="project-header">
              <p class="is-size-4 has-text-weight-bold">
                Team
              </p>
            </div>

            <div
              class="project-content"
            >
              <TeamInfoField v-model="team" />
            </div>
          </div>
        </div>

        <!-- Profile image and actions -->
        <div
          class="column is-3 is-offset-3"
          v-if="isOwner"
        >
          <!-- Profile image -->
          <div class="profile-image">
            <figure class="image is-square is-marginless">
              <img :src="profileImageUrl">
              <div class="upload">
                <b-upload
                  accept="image/png, image/jpeg"
                  @input="uploadProfileImg"
                >
                  <a class="button is-white">
                    <b-icon
                      icon="mdil-upload"
                      type="is-primary"
                    />
                  </a>
                </b-upload>
              </div>
            </figure>
            <div class="content">
              <p class="is-size-7 has-text-grey has-text-right">
                Max file size: 2 MB. Format: jpg, png.
              </p>
            </div>
          </div>
          <!-- Actions -->
          <div class="project-header">
            <p class="is-size-4 has-text-weight-bold">
              Actions
            </p>
          </div>

          <div class="project-content">
            <div class="action-buttons">
              <b-button
                icon-left="mdil-lock"
                type="is-light"
                expanded
                @click="resetPassword"
                :loading="isLoading.reset_pass"
              >
                Reset Password
              </b-button>
              <b-button
                icon-left="mdil-delete"
                type="is-light"
                expanded
                disabled
              >
                Delete Account (Under Dev.)
              </b-button>
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
// eslint-disable-next-line no-unused-vars
import * as FileManage from "@/api/fileManage.js"
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Error from "@/components/Error.vue"
import { handleError } from "@/api/errorHandler.js"
import TeamInfoField from '@/components/Field/TeamInfoField.vue'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    Error,
    TeamInfoField
  },
  computed: {
    profileImageUrl() {
      // Set url as placeholder
      let url = require("@/assets/image/blank-profile.png")

      if (this.userInfo && this.userInfo.profile_image) url = this.userInfo.profile_image

      return url
    },
    isEditing() {
      return this.$route.params.action && this.$route.params.action === "edit"
    }
  },
  data () {
    return {
      userInfo: {},
      team: "",
      showProfile: false,
      isOwner: false,
      isLoading: {
        page: true,
        reset_pass: false,
        save_edit: false,
        save_profile_pic: false
      },
      errorMessage: "",
    }
  },
  async mounted () {
    const username = this.$route.params.username
    this.isOwner = this.$store.state.hasLoggedIn && (username === this.$store.state.user.username)

    // If not a valid action or not the owner, jump to view
    if (!this.isEditing || !this.isOwner) {
      this.$router.push({ name: 'User Profile View', params: { username: username } })
      return
    }

    this.userInfo = await this.fetchUserInfo(username)

    if (this.userInfo) {
      this.userInfo.social = {}
    }
  },
  methods: {
    async fetchUserInfo(username) {
      this.isLoading.page = true
      
      // Get user info using username
      let res
      try {
        res = await UserManage.fetchUserInfo(username)
      } catch (error) {
        this.errorMessage = await handleError(error)
        this.isLoading.page = false
        return undefined
      }

      // Handle UI changes
      this.showProfile = true
      this.isLoading.page = false
      return res
    },
    async saveProfile() {
      this.isLoading.save_edit = true

      // Update user
      try {
        this.userInfo.team = this.team
        await this.$store.dispatch('updateUserProfile', this.userInfo)
      } catch (e) {
        this.$buefy.toast.open({
          duration: 5000,
          message: await handleError(e),
          type: 'is-danger',
          queue: false
        })

        this.isLoading.save_edit = false
        return
      }

      // Handle UI changes
      this.isLoading.save_edit = false

      // Redirect to view layout
      this.$router.push({ name: 'User Profile View', params: { username: this.userInfo.username } })
    },
    async uploadProfileImg(file) {
      if (!file || file.length < 1) return

      // Check file size
      if (file.size > 2048 * 1000) {
        this.$buefy.toast.open({
          duration: 5000,
          message: "File size exceeds limit of 2 MB",
          type: 'is-danger',
          queue: false
        })

        return
      }

      this.isLoading.save_profile_pic = true

      // TODO: Check file size in the backend
      const res = await FileManage.uploadFile(file)

      if (res.error) {
        this.$buefy.toast.open({
          duration: 5000,
          message: res.error.message,
          type: 'is-danger',
          queue: false
        })

        this.isLoading.save_profile_pic = false
        return
      }

      this.userInfo.profile_image = res.file.url()
      this.isLoading.save_profile_pic = false
    },
    async resetPassword() {
      if (!this.userInfo.email) {
        throw new Error("Missing email")
      }
      
      try {
        this.isLoading.reset_pass = true

        await UserManage.resetPassword(this.userInfo.email)

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

      this.isLoading.reset_pass = false
    }
  }
}
</script>

<style lang="sass" scoped>
.profile-image
  margin-bottom: 1rem
  .upload
    position: absolute
    top: 0.5rem
    right: 0.5rem
.action-buttons
  .button
    margin-bottom: 0.5rem
.social-media
  margin-top: 0.5rem
</style>