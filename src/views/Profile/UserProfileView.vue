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
                icon-left="mdil-pencil"
                type="is-warning"
                size="is-medium"
                class="small-shadow"
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
                Basics
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

              <p
                class="is-size-5"
                v-if="userInfo.social"
              >
                <b>Social Media</b> <br>
                <a
                  :href="`https://twitter.com/${userInfo.social.twitter}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter />
                  {{ userInfo.social.twitter }}
                </a>
              </p>
            </div>

            <hr v-if="hasAffiliation">

            <div
              class="project-header"
              v-if="hasAffiliation"
            >
              <p class="is-size-4 has-text-weight-bold">
                Affiliation
              </p>
            </div>

            <div
              class="project-content"
              v-if="hasAffiliation"
            >
              <p
                class="is-size-5"
                v-if="userInfo.team_aff"
              >
                <b>Team{{ userInfo.team_aff.length > 1 ? "s" : "" }}</b><br>

                <span
                  v-for="(team, id) in userInfo.team_aff"
                  :key="id"
                >
                  <router-link
                    :to="{ name: 'Team View', params: { id: team.id } }"
                    target="_blank"
                  >
                    <b-icon icon="mdil-link" />
                    <span class="is-capitalized">{{ team.first_name + " " + team.last_name }},</span>
                    {{ team.affiliation }}
                  </router-link>
                </span>
              </p>

              <div
                class="is-size-5"
                v-if="userInfo.funder"
              >
                <p>
                  <b>Funding Agency</b><br>
                  <span class="is-capitalized is-flex has-vcentered">
                    <span style="margin-right: 0.5rem">
                      {{ userInfo.funder.position }}, {{ userInfo.funder.funder_name }}, {{ countries[userInfo.funder.funder_country] }}
                    </span>
                    <b-tag
                      v-if="!userInfo.funder.approved_at"
                      type="is-warning-light"
                    >
                      <b-icon icon="mdil-clock" />
                      <span>Awaiting moderator approval</span>
                    </b-tag>
                    <b-tag
                      type="is-success"
                      style="margin: 0 0.5rem"
                      v-else
                    >
                      <b-icon
                        icon="mdil-check"
                        style="padding-right: 0.25rem"
                      />
                      Approved
                    </b-tag>
                  </span>
                </p>
              </div>
            </div>

            <hr v-if="hasProject || hasTeam">

            <div
              class="project-header"
              v-if="hasProject || hasTeam"
            >
              <p class="is-size-4 has-text-weight-bold">
                Ownership
              </p>
            </div>

            <div
              class="project-content project-container"
              v-if="hasProject || hasTeam"
            >
              <b-tabs
                v-model="activeTab"
                :animated="false"
                type="is-boxed"
                multiline
              >
                <b-tab-item v-if="hasProject">
                  <template #header>
                    <span id="projects"> Projects <b-tag rounded> {{ userInfo.projects.length }} </b-tag> </span>
                  </template>

                  <p class="is-size-5">
                    <span
                      v-for="(project, id) in userInfo.projects"
                      :key="id"
                      class="is-block project-item"
                    >
                      <router-link
                        :to="{ name: 'Project View', params: { id: project.id } }"
                        target="_blank"
                      >
                        <b-icon icon="mdil-link" />
                        {{ project.target.name.toUpperCase() }} ({{ project.target.type }}),
                        <i>{{ project.target.organism }}</i>
                      </router-link><br>
                      <span class="has-text-grey is-size-6" v-if="project.features.length > 0">Features: {{ project.features.join(", ") }}<br></span>
                      <span class="has-text-grey is-size-6">Last Update: {{ project.update_date.toLocaleString() }}</span>
                    </span>
                  </p>
                </b-tab-item>

                <b-tab-item v-if="hasTeam">
                  <template #header>
                    <span> Teams <b-tag rounded> {{ userInfo.teams.length }} </b-tag> </span>
                  </template>

                  <p class="is-size-5">
                    <span
                      v-for="(team, id) in userInfo.teams"
                      :key="id"
                      class="is-block project-item"
                    >
                      <router-link
                        :to="{ name: 'Team View', params: { id: team.id } }"
                        target="_blank"
                      >
                        <b-icon icon="mdil-link" />
                        <span class="is-capitalized">{{ team.first_name + " " + team.last_name }},</span>
                        {{ team.affiliation }}
                      </router-link><br>
                    </span>
                  </p>
                </b-tab-item>

                <b-tab-item v-if="hasNomination">
                  <template #header>
                    <span> Nominations <b-tag rounded> {{ userInfo.nominations.length }} </b-tag> </span>
                  </template>

                  <p class="is-size-5">
                    <span
                      v-for="(nomination, id) in userInfo.nominations"
                      :key="id"
                      class="is-block project-item"
                    >
                      <router-link
                        :to="{ name: 'Nominations', query: { id: nomination.id } }"
                        target="_blank"
                      >
                        <b-icon icon="mdil-link" />
                        {{ nomination.target.name.toUpperCase() }} ({{ nomination.target.type }}),
                        <i>{{ nomination.target.organism }}</i><br>
                      </router-link>
                    </span>
                  </p>
                </b-tab-item>
              </b-tabs>
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
              <img :src="getProfileImageFromUser(userInfo)">
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
                :object-count="objectCount"
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
import * as ProjectManage from "@/api/projectManage.js"
import * as TeamManage from "@/api/teamManage.js"
import * as NominationManage from "@/api/nominationManage.js"
import { handleError, displayErrorToast } from "@/api/errorHandler.js"
import Error from "@/components/Error.vue"
import UserProfileAction from "@/components/Action/UserProfileAction.vue"
import Twitter from 'vue-material-design-icons/Twitter.vue'
import * as FunderManage from "@/api/funderManage.js"

const countries = require("@/assets/script/countries.json")

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
    activeTab: 0,
    errorMessage: "",
    isRoleBeingReviewed: false,
    hasInitLoad: false,
    countries: countries
  }
}

export default {
  title: "View User Profile",
  components: {
    Error,
    UserProfileAction,
    Twitter
  },
  computed: {
    isOwner() {
      return this.userInfo && this.userInfo.username && this.$store.getters.isOwner(this.userInfo.username)
    },
    username() {
      return this.$route.params.username
    },
    hasAffiliation() {
      return this.userInfo.team_aff || this.userInfo.funder
    },
    hasProject() {
      return this.userInfo.projects && this.userInfo.projects.length > 0
    },
    hasTeam() {
      return this.userInfo.teams && this.userInfo.teams.length > 0
    },
    hasNomination() {
      return this.userInfo.nominations && this.userInfo.nominations.length > 0
    },
    objectCount() {
      let sum = 0
      if (this.hasProject) sum += this.userInfo.projects.length
      if (this.hasTeam) sum += this.userInfo.teams.length
      if (this.hasNomination) sum += this.userInfo.nominations.length

      return sum
    }
  },
  watch: {
    async $route() {
      // Reset parameters
      Object.assign(this.$data, initialState())

      // Fetch and store user information
      this.userInfo = await this.fetchUserInfo(this.username)
      this.hasInitLoad = true
    },
    async currentUser() {
      if (!this.hasInitLoad) return

      // Fetch and store user information
      this.userInfo = await this.fetchUserInfo(this.username)
    }
  },
  data () {
    return initialState()
  },
  async mounted () {
    this.userInfo = await this.fetchUserInfo(this.username)
    this.hasInitLoad = true
  },
  updated() {
    // Check if should scroll to projects
    if (this.hasDeepLink("#projects") & this.hasProject) this.$scrollTo('#projects')
  },
  methods: {
    async fetchUserInfo(username) {
      this.isLoading.page = true
      
      // Get user info using username
      let res
      try {
        res = await UserManage.fetchUserInfo(username, true)

        if (res) {
          // Fetch team
          const teamAff = await TeamManage.fetchTeamAffiliationsByUserId(res.id)
          if (teamAff && teamAff.length > 0) res.team_aff = teamAff

          // Fetch funding agency
          const funders = await FunderManage.fetchFunderInfo(this.username)
          if (funders.length > 2) throw new Error("Invalid funder entries")
          
          for (const funder of funders) {
            if (!funder.approved_at) {
              this.isRoleBeingReviewed = true
              res.funder = funder
            } else if (!res.funder) {
              res.funder = funder
            }
          }

          // Fetch projects
          res.projects = await ProjectManage.fetchProjectsByUserId(res.id)
          
          // Fetch teams the user own
          res.teams = await TeamManage.fetchTeamOwnershipsByUserId(res.id)

          // Fetch nominations
          res.nominations = await NominationManage.fetchNominationsByUserId(res.id)
        }
      } catch (error) {
        this.isLoading.page = false
        this.errorMessage = await handleError(error)
        throw error
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
        await UserManage.resendValidationEmail()
      } catch (error) {
        await displayErrorToast(error)
        return
      } finally {
        this.isLoading.resend_email = false
      }

      this.$buefy.toast.open({
        duration: 5000,
        message: "Validation Email Sent",
        type: 'is-success',
        queue: false
      })
      this.isDisabled.resend_email = true
    }
  }
}
</script>

<style lang="sass">
.project-container
  ul
    margin: 0 !important
</style>

<style lang="sass" scoped>
@import "@/assets/style/variables.sass"

.profile-image
  margin-bottom: 1rem
.social-media
  margin-top: 0.5rem
.resend-email
  @media screen and (max-width: $break-mobile)
    margin-top: 0.5rem
.project-item
  &:not(:last-child)
    padding-bottom: 0.5rem
</style>