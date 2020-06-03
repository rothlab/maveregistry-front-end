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
                v-if="!isEditing"
                icon-left="mdil-pencil"
                type="is-primary"
                size="is-medium"
                outlined
                @click="isEditing = true"
              >
                Edit
              </b-button>
              <b-button
                v-else
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
        <div class="column">
          <div
            class="content"
          >
            <div class="project-header">
              <p class="is-size-4 has-text-weight-bold">
                Personal Information
              </p>
            </div>

            <div class="project-content">
              <div class="columns">
                <!-- Display profile -->
                <div
                  class="column"
                  v-if="!isEditing"
                >
                  <p
                    class="is-size-5"
                    v-if="userInfo.username"
                  >
                    <b>Username</b> <br>
                    {{ userInfo.username }}
                  </p>
                  <p
                    class="is-size-5"
                    v-if="userInfo.first_name && userInfo.last_name"
                  >
                    <b>Name</b> <br>
                    {{ userInfo.first_name }} {{ userInfo.last_name }}
                  </p>
                  <p
                    class="is-size-5"
                    v-if="userInfo.email"
                  >
                    <b>Email</b> <br>
                    {{ userInfo.email }}
                  </p>
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
                    v-if="userInfo.social && Object.keys(userInfo.social).length"
                  >
                    <span><b>Social Media</b></span>
                    <br>
                    <div
                      class="buttons"
                    >
                      <b-button
                        icon-left="twitter"
                        icon-pack="mdi"
                        v-if="userInfo.social.twitter"
                      >
                        @{{ userInfo.social.twitter }}
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

                <div class="column is-3 is-offset-3">
                  <!-- Profile image -->
                  <div class="profile-image">
                    <figure class="image is-square is-marginless">
                      <img :src="profileImageUrl">
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile image and actions -->
        <div
          class="column is-3"
          v-if="isOwner"
        >
          <!-- Actions -->
          <div class="project-header">
            <p class="is-size-4 has-text-weight-bold">
              Actions
            </p>
          </div>

          <div class="project-content">
            <UserProfileAction :email="userInfo.email" />
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
import * as UserManage from "@/api/userManage"
import * as FileManage from "@/api/fileManage"
import Error from "@/components/Error"
import UserProfileAction from "@/components/UserProfileAction"

function initialState (){
  return {
    userInfo: {},
    showProfile: false,
    isOwner: false,
    isEditing: false,
    isLoading: {
      page: true,
      reset_pass: false,
      save_edit: false,
      save_profile_pic: false
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
    profileImageUrl() {
      // Set url as placeholder
      let url = require("@/assets/blank-profile.png")

      if (this.userInfo && this.userInfo.profile_image) url = this.userInfo.profile_image

      return url
    }
  },
  watch: {
    async $route() {
      // Reset parameters
      Object.assign(this.$data, initialState())

      // Fetch and store user information
      const username = this.$route.params.username
      this.userInfo = await this.fetchUserInfo(username)
      if (this.userInfo) this.userInfo.social = {}
    }
  },
  data () {
    return initialState()
  },
  async mounted () {
    const username = this.$route.params.username
    this.userInfo = await this.fetchUserInfo(username)

    if (this.userInfo) {
      this.userInfo.social = {}
    }
  },
  methods: {
    async fetchUserInfo(username) {
      this.isLoading.page = true
      
      // Get user info using username
      const res = await UserManage.fetchUserInfo(username)

      // Handle error
      if (res.error) {
        this.errorMessage = res.error.message
        this.isLoading.page = false
        return undefined
      }

      // Check if owning the account.
      // Only the owner can make changes
      this.showProfile = true
      this.isOwner = this.$store.state.hasLoggedIn && (res.user.username === this.$store.state.user.username)
      this.isLoading.page = false
      return res.user
    },
    async saveProfile() {
      this.isLoading.save_edit = true

      // Update user
      try {
        await this.$store.dispatch('updateUserProfile', this.userInfo)
      } catch (e) {
        this.$buefy.toast.open({
          duration: 5000,
          message: e.message,
          type: 'is-danger',
          queue: false
        })

        this.isLoading.save_edit = false
        return
      }

      // Handle UI changes
      this.isLoading.save_edit = false
      this.isEditing = false

      // Refresh user info
      if (this.userInfo.username === this.$route.params.username) {
        this.userInfo = await this.fetchUserInfo(this.userInfo.username)
      } else {
        this.$router.replace('/profile/' + this.userInfo.username)
      }
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