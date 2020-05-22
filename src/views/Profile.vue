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
                :loading="isActionLoading"
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
            <h2 class="subtitle">
              Basic Information
            </h2>
            <div class="columns">
              <!-- Display profile -->
              <div
                class="column"
                v-if="!isEditing"
              >
                <p class="is-size-5">
                  <b>Username</b> <br>
                  {{ userInfo.username }}
                </p>
                <p class="is-size-5">
                  <b>Name</b> <br>
                  {{ userInfo.first_name }} {{ userInfo.last_name }}
                </p>
                <p class="is-size-5">
                  <b>Email</b> <br>
                  {{ userInfo.email }}
                </p>
                <p
                  class="is-size-5"
                  v-if="userInfo.website"
                >
                  <b>Website</b> <br>
                  {{ userInfo.website }}
                </p>
                <div
                  class="is-size-5"
                  v-if="userInfo.social"
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
              <!-- Edit profile -->
              <div
                class="column is-6"
                v-else
              >
                <ValidationObserver
                  ref="observer"
                >
                  <b-field
                    grouped
                    class="field-margin is-space-between"
                  >
                    <ValidationProvider
                      rules="required|alpha_dash"
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
                      rules="required|alpha_dash"
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
                        icon-pack="mdi"
                        icon="twitter"
                        type="text"
                        placeholder="Twitter Handle"
                        v-model="userInfo.social.twitter"
                      />
                    </b-field>
                  </ValidationProvider>
                </ValidationObserver>
              </div>
              <div class="column is-3 is-offset-3">
                <!-- Profile image -->
                <div class="profile-image">
                  <figure class="image is-square is-marginless">
                    <img src="https://bulma.io/images/placeholders/256x256.png">
                    <div class="upload">
                      <b-button
                        icon-left="mdil-upload"
                        rounded
                        type="is-white"
                        v-if="isOwner"
                      />
                    </div>
                  </figure>
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
          <div class="content">
            <h2 class="subtitle">
              Actions
            </h2>
            <div class="action-buttons">
              <b-button
                icon-left="mdil-lock"
                type="is-light"
                expanded
              >
                Change Password
              </b-button>
              <b-button
                icon-left="mdil-delete"
                type="is-light"
                expanded
              >
                Delete Account
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as UserManage from "../api/userManage"
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data () {
    return {
      userInfo: {},
      showProfile: false,
      isOwner: true,
      isEditing: false,
      isActionLoading: false
    }
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
      // Get user info using username
      const res = await UserManage.fetchUserInfo(username)

      if (!res.error) {
        this.showProfile = true

        return res.user
      }

      return undefined
    },
    async saveProfile() {
      this.isActionLoading = true

      // Update user
      await this.$store.dispatch('updateUserProfile', this.userInfo)

      // Handle UI changes
      this.isActionLoading = false
      this.isEditing = false

      // Refresh user info
      this.$router.replace('/profile/' + this.userInfo.username)
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