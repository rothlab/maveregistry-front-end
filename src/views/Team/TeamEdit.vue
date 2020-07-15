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
                  Edit Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <!-- Loading -->
      <b-loading
        :is-full-page="false"
        :active="isLoading.page"
      />

      <Error
        v-if="!isLoading.page && errorMessage !== ''"
        :message="errorMessage"
      />

      <div
        class="content"
        v-else-if="!isLoading.page && errorMessage === ''"
      >
        <ValidationObserver
          ref="observer"
          v-slot="{ passed }"
        >
          <div class="columns">
            <div class="column is-7">
              <div class="project-header">
                <p class="is-size-4 has-text-weight-bold">
                  People
                </p>
              </div>

              <div
                class="project-content"
                v-if="principalInvestigator"
              >
                <div class="columns">
                  <div class="column is-3">
                    <span class="is-size-5">
                      Principal Investigator (*)
                    </span>
                  </div>

                  <div class="column is-9">
                    <PIInfoField v-model="principalInvestigator" />
                  </div>
                </div>

                <div class="columns">
                  <div class="column is-3">
                    <span class="is-size-5">
                      Members
                    </span>
                  </div>

                  <div class="column is-9">
                    <figure
                      v-for="(member, id) in members"
                      :key="id"
                      class="image is-48x48 is-inline-block member-icons"
                    >
                      <router-link
                        :to="{ name: 'User Profile View', params: { username: member.username } }"
                        target="_blank"
                        class="is-capitalized"
                      >
                        <b-tooltip
                          :label="`${member.first_name} ${member.last_name}`"
                          type="is-dark"
                        >
                          <img
                            :src="getProfileImage(member.profile_image)"
                            class="is-rounded"
                          >
                        </b-tooltip>
                      </router-link>
                      <button
                        class="delete right-corner"
                        @click="confirmRemoveMember(member.username)"
                      />
                    </figure>
                  </div>
                </div> 
              </div>
            </div>

            <div class="column is-5">
              <b-notification :closable="false">
                <div class="content">
                  <b-icon
                    class="header-icon"
                    type="is-primary"
                    custom-size="mdil-48px"
                    icon="mdil-information"
                  />

                  <div class="field-margin">
                    <div class="has-text-white has-round-title has-background-primary is-inline-block">
                      <b-icon icon="mdil-lightbulb" />
                      About
                    </div>

                    <p>
                      <span v-if="creator">
                        <b-icon icon="mdil-account" />
                        Creator: 
                        <router-link
                          :to="{ name: 'User Profile View', params: { username: creator.username } }"
                          target="_blank"
                          class="is-capitalized"
                        >
                          {{ creator.first_name }} {{ creator.last_name }}
                        </router-link>
                      </span>
                      <br>

                      <b-icon icon="mdil-clock" />
                      Last Update Date: {{ updatedDate.toLocaleString() }}
                    </p>
                  </div>
                </div>
              </b-notification>
            </div>
          </div>

          <hr>

          <div class="columns">
            <div class="column is-4 is-offset-8">
              <b-button
                :disabled="!passed"
                expanded
                type="is-primary"
                size="is-medium"
                icon-left="mdil-content-save"
                :loading="isLoading.submit"
                @click="editTeam"
              >
                Edit Team
              </b-button>
            </div>
          </div>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import * as TeamManage from "@/api/teamManage.js"
import PIInfoField from '@/components/Field/PIInfoField.vue'
import { handleError } from '@/api/errorHandler.js'
import { ValidationObserver } from 'vee-validate'

export default {
  components: {
    PIInfoField,
    ValidationObserver
  },
  data() {
    return {
      isLoading: {
        page: false,
        submit: false
      },
      errorMessage: "",
      principalInvestigator: undefined,
      members: [],
      creator: undefined,
      updatedDate: new Date()
    }
  },
  computed: {
    teamId() {
      return this.$route.params.id
    },
    isOwner() {
      return this.creator && this.creator.username && this.$store.getters.isOwner(this.creator.username)
    }
  },
  async mounted() {
    this.isLoading.page = true

    // Fetch team
    if (this.isAction('edit')) await this.fetchTeam()

    // If invalid action jump to view page
    if (!this.isAction('edit') || !this.isOwner) {
      this.$router.push({ name: 'Team View', params: { id: this.teamId } })
      return
    }

    this.isLoading.page = false
  },
  methods: {
    async fetchTeam() {
      // Fetch team
      let team
      try {
        team = await TeamManage.queryById(this.teamId, true, false)
      } catch (error) {
        this.errorMessage = await handleError(error)
        return
      }
      
      // Format PI
      this.principalInvestigator = {
        first_name: team.first_name,
        last_name: team.last_name,
        email: team.email,
        affiliation: team.affiliation
      }
      if (team.website && team.website.length > 0) this.principalInvestigator.website = team.website

      // Format members
      if (team.members) this.members = team.members

      // Format creator and update date
      this.creator = team.creator
      this.updatedDate = team.update_date
      
      return team
    },
    async editTeam() {
      this.isLoading.submit = true

      try {
        await TeamManage.updateTeam(this.teamId, this.principalInvestigator)
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
      }

      // Jump to view
      this.$router.push({ name: 'Team View', params: { id: this.teamId } })
    },
    getProfileImage(url) {
      return url ? url : require("@/assets/image/blank-profile.png")
    },
    confirmRemoveMember(username) {
      this.$buefy.dialog.confirm({
        title: "Remove member",
        message: "Are you sure you want to remove this member?<br>They will be notified.",
        confirmText: "Remove",
        type: "is-danger",
        hasIcon: true,
        iconPack: "mdi",
        onConfirm: async () => {
          try {
            await TeamManage.removeMember(this.teamId, username)
          } catch (error) {
            this.$buefy.toast.open({
              duration: 5000,
              message: await handleError(error),
              type: 'is-danger',
              queue: false
            })
            return
          }

          this.$buefy.toast.open({
            duration: 5000,
            message: "Member removed",
            type: 'is-success',
            queue: false
          })
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/style/variables.sass"

.header-icon
  position: absolute
  right: 1.25rem
.member-icons
  margin: 0.5rem 0 0 0 !important
  &:not(:first-of-type)
    margin-left: 0.25rem !important
  img
    width: 48px
    height: 48px
  .right-corner
    position: absolute
    right: -0.5rem
    &:hover
      background-color: $danger
</style>