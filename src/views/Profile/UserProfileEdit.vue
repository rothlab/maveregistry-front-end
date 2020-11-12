<template>
  <div>
    <!-- Header -->
    <div class="hero is-light">
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
                type="is-warning"
                size="is-medium"
                class="small-shadow"
                :loading="isLoading.save_edit"
                :disabled="isDisabled"
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
            <ValidationObserver ref="observer">
              <div class="project-header">
                <p class="is-size-4 has-text-weight-bold">
                  Personal Information
                </p>
              </div>

              <div class="project-content">
                <b-field
                  grouped
                  class="field-margin field-space-between"
                >
                  <ValidationProvider
                    rules="required"
                    name="FirstName"
                    v-slot="{ errors, valid }"
                    class="name"
                    immediate
                  >
                    <b-field
                      :message="errors"
                      :type="{ 'is-danger': errors[0], '': valid }"
                      label="First Name"
                    >
                      <b-input
                        type="text"
                        placeholder="First Name"
                        v-model.trim="userInfo.first_name"
                        custom-class="is-capitalized"
                      />
                    </b-field>
                  </ValidationProvider>
                  <ValidationProvider
                    rules="required"
                    name="LastName"
                    v-slot="{ errors, valid }"
                    class="name"
                    immediate
                  >
                    <b-field
                      :message="errors"
                      :type="{ 'is-danger': errors[0], '': valid }"
                      label="Last Name"
                    >
                      <b-input
                        type="text"
                        placeholder="Last Name"
                        v-model.trim="userInfo.last_name"
                        custom-class="is-capitalized"
                      />
                    </b-field>
                  </ValidationProvider>
                </b-field>
                <ValidationProvider
                  rules="required|alpha_dash"
                  name="Username"
                  v-slot="{ errors, valid }"
                  immediate
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
                      v-model.trim="userInfo.username"
                    />
                  </b-field>
                </ValidationProvider>
                <ValidationProvider
                  rules="required|email"
                  name="Email"
                  v-slot="{ errors, valid }"
                  immediate
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
                      v-model.trim="userInfo.email"
                    />
                  </b-field>
                </ValidationProvider>
                <ValidationProvider
                  :rules="{ regex: 
                    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ 
                  }"
                  name="Website"
                  v-slot="{ errors, valid }"
                  :immediate="userInfo.website != ''"
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
                      v-model.trim="userInfo.website"
                    />
                  </b-field>
                </ValidationProvider>
                <ValidationProvider
                  rules="twitter"
                  name="Twitter"
                  v-slot="{ errors, valid }"
                  v-if="userInfo.social"
                  :immediate="!!userInfo.social"
                > 
                  <b-field
                    :message="errors"
                    class="field-margin"
                    :type="{ 'is-danger': errors[0], '': valid }"
                    label="Twitter (Optional)"
                  >
                    <b-input
                      type="text"
                      placeholder="Twitter handle with @"
                      v-model.trim="userInfo.social.twitter"
                      @input="addTwitterAt"
                    />
                  </b-field>
                </ValidationProvider>
              </div>

              <hr>

              <div class="project-header">
                <p class="is-size-4 has-text-weight-bold">
                  Funder Role
                </p>
              </div>

              <div class="project-content">
                <b-checkbox
                  v-model="funder.hasRole"
                  class="field-margin"
                >
                  I am representing a funding agency and would like to request for
                  <b-tooltip
                    label="Once granted, you will be able view other members' funding need, if they choose to disclose it."
                    multilined
                    type="is-dark"
                  >
                    <span class="has-text-info">funder role (?)</span>.
                  </b-tooltip>
                </b-checkbox>

                <!-- Pending approval message -->
                <b-message
                  v-if="funder.hasRole && !funder.approved"
                  type="is-warning"
                  size="is-small"
                  class="activity-tip"
                >
                  <b-icon
                    icon="mdil-alert-circle"
                    custom-class="mdil-18px"
                  />
                  <span class="font-14px">
                    Your request needs to be reviewed and approved by moderators. 
                  </span>
                </b-message>

                <!-- Approved message -->
                <b-message
                  v-else-if="funder.hasRole && funder.approved"
                  type="is-success"
                  size="is-small"
                  class="activity-tip"
                >
                  <b-icon
                    icon="mdil-check"
                    custom-class="mdil-18px"
                  />
                  <span class="font-14px">
                    Your request was approved. <b>Changes to this section need to reviewed by moderators.</b>
                  </span>
                </b-message>

                <!-- Funding Agency -->
                <ValidationProvider
                  rules="required"
                  name="Funding Agency"
                  v-slot="{ errors, valid }"
                  v-if="funder.hasRole"
                >
                  <b-field
                    :message="errors"
                    class="field-margin"
                    :type="{ 'is-danger': errors[0], '': valid }"
                    label="Funding Agency"
                  >
                    <b-input
                      type="text"
                      v-model.trim="funder.agency"
                    />
                  </b-field>
                </ValidationProvider>

                <!-- Position -->
                <ValidationProvider
                  rules="required"
                  name="Position"
                  v-slot="{ errors, valid }"
                  v-if="funder.hasRole"
                >
                  <b-field
                    :message="errors"
                    class="field-margin"
                    :type="{ 'is-danger': errors[0], '': valid }"
                    label="Position"
                  >
                    <b-input
                      type="text"
                      v-model.trim="funder.position"
                    />
                  </b-field>
                </ValidationProvider>
              </div>
            </ValidationObserver>
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
              <img :src="getProfileImageFromUser(userInfo)">
              <div class="upload">
                <b-button
                  tag="a"
                  id="pick-image"
                  :loading="isLoading.save_profile_pic"
                  icon-left="mdil-upload"
                  type="is-white"
                />
              </div>
            </figure>
            <div class="content">
              <p class="is-size-7 has-text-grey has-text-right">
                Max file size: 2 MB. Format: jpg, png.
              </p>
            </div>
            <AvatarCropper
              trigger="#pick-image"
              mimes="image/png, image/jpeg, image/gif"
              :labels="{ submit: 'Submit', cancel: 'Cancel' }"
              :upload-handler="uploadProfileImg"
              output-mime="image/jpeg"
              :output-quality="0.8"
            />
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
import * as FileManage from "@/api/fileManage.js"
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Error from "@/components/Error.vue"
import { handleError, displayErrorToast } from "@/api/errorHandler.js"
import AvatarCropper from "vue-avatar-cropper"

export default {
  title: "Edit User Profile",
  components: {
    ValidationProvider,
    ValidationObserver,
    Error,
    AvatarCropper
  },
  computed: {
    isOwner() {
      const username = this.$route.params.username
      return this.hasLoggedIn && username && this.$store.getters.isOwner(username)
    }
  },
  data () {
    return {
      userInfo: {},
      showProfile: false,
      isLoading: {
        page: true,
        save_edit: false,
        save_profile_pic: false
      },
      errorMessage: "",
      isDisabled: false,
      hasInitLoad: false,
      funder: {
        hasRole: false,
        approved: false,
        agency: "",
        position: ""
      }
    }
  },
  watch: {
    async currentUser() {
      const username = this.$route.params.username
      if (this.hasInitLoad && !this.isOwner) 
        this.$router.push({ name: 'User Profile View', params: { username: username } })
    }
  },
  async mounted () {
    const username = this.$route.params.username

    // If not a valid action or not the owner, jump to view
    if (!this.isAction('edit') || !this.isOwner) {
      this.$router.push({ name: 'User Profile View', params: { username: username } })
      return
    }

    this.userInfo = await this.fetchUserInfo(username)
    this.hasInitLoad = true

    if (this.userInfo) {
      if (!this.userInfo.social) this.userInfo.social = {}
    }

    this.$watch(
      () => {
        return this.$refs.observer.flags.passed
      },
      (val) => {
        this.isDisabled = !val
      }
    )
  },
  methods: {
    async fetchUserInfo(username) {
      this.isLoading.page = true
      
      // Get user info using username
      let res
      try {
        res = await UserManage.fetchUserInfo(username)
      } catch (error) {
        this.isLoading.page = false
        this.errorMessage = await handleError(error)
        throw error
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
        await this.$store.dispatch('updateUserProfile', this.userInfo)
      } catch (e) {
        this.isLoading.save_edit = false
        await displayErrorToast(e)
        return
      }

      // Handle UI changes
      this.isLoading.save_edit = false

      // Redirect to view layout
      this.$router.push({ name: 'User Profile View', params: { username: this.userInfo.username } })
    },
    async uploadProfileImg(canvas) {
      if (!canvas) return

      // Get base 64 image data
      const croppedCanvasUrl = canvas.getCroppedCanvas({ width: 512, height: 512 }).toDataURL("image/jpeg")
      if (!croppedCanvasUrl) return

      this.isLoading.save_profile_pic = true
      try {
        const res = await FileManage.uploadFile(this.userInfo.id, { base64: croppedCanvasUrl })

        this.userInfo.profile_image = res
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.save_profile_pic = false
      }
    },
    addTwitterAt() {
      if (!this.userInfo.social || !this.userInfo.social.twitter) return

      if (!this.userInfo.social.twitter.startsWith("@")) {
        this.userInfo.social.twitter = "@" + this.userInfo.social.twitter
      }
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