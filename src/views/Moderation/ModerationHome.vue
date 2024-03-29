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
                  Moderation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <Error
        v-if="errorMessage !== ''"
        :message="errorMessage"
      />

      <!-- Moderate display -->
      <div v-else-if="errorMessage === ''">
        <div
          class="project-header"
        >
          <p class="is-size-4 has-text-weight-bold is-flex has-vcentered">
            <b-tag
              size="is-medium"
              type="is-info"
              style="margin-right: 0.5rem"
            >
              {{ userPagination.count }}
            </b-tag>
            Users
          </p>
        </div>

        <div class="project-content">
          <b-table
            :data="users"
            :loading="isLoading.users"
            hoverable
            icon-pack="mdil"
            paginated
            pagination-position="top"
            backend-pagination
            :per-page="userPagination.limit"
            :total="userPagination.count"
            :current-page="userPagination.current"
            @page-change="(change) => { userPagination.current = change; fetchUsers() }"
          >
            <!-- Filter -->
            <template slot="top-left">
              <!-- Filter by name -->
              <b-field
                style="margin-left: 0.5em"
                grouped
              >
                <b-input
                  v-model="userFilter"
                  placeholder="Name"
                  type="search"
                  icon="mdil-magnify"
                />
                <p class="control buttons">
                  <b-button
                    :type="funderRequests > 0 ? 'is-warning' : 'is-light'"
                    icon-left="mdil-clipboard-text"
                    :loading="isLoading.funder_request"
                    @click="isFunderModalActive = true"
                  >
                    Manage Funders
                    <span v-if="funderRequests > 0">
                      ({{ funderRequests > 1 ? funderRequests + " new requests" : funderRequests + " new request" }})
                    </span>
                  </b-button>
                  <b-button
                    type="is-light"
                    icon-left="mdil-download"
                    :loading="isLoading.users || isLoading.download_users"
                    :disabled="userPagination.count < 1"
                    @click="downloadUserInfo"
                  >
                    Download {{userFilter ? "Filtered" : ""}} User Info
                  </b-button>
                </p>
              </b-field>
            </template>

            <!-- No results -->
            <template slot="empty">
              <div
                class="no-project has-vcentered"
                v-if="!isLoading.users"
              >
                <div class="info-icon">
                  <b-icon
                    icon="mdil-clipboard"
                    custom-size="mdil-48px"
                    type="is-grey-light"
                  />
                </div>
                <div class="info-content">
                  <p class="has-text-grey">
                    <span class="is-size-5">Sorry, we couldn't find any results.</span>
                  </p>
                </div>
              </div>
            </template>

            <!-- Username with link -->
            <b-table-column
              field="username"
              label="Username"
              v-slot="props"
              cell-class="vertical-center"
            >
              <router-link
                :to="{ path: `/user/${props.row.username}`}"
                target="_blank"
                class="is-flex"
              >
                <span
                  class="image is-24x24 is-inline-block"
                  style="margin-right: 0.5rem"
                >
                  <img
                    class="is-rounded"
                    :src="getProfileImageFromUser(props.row)"
                  >
                </span>
                {{ props.row.username }}
              </router-link>
            </b-table-column>

            <!-- Name -->
            <b-table-column
              field="name"
              label="Name"
              v-slot="props"
              cell-class="vertical-center"
            >
              <a :href="`mailto:${props.row.email}`">
                <b-icon icon="mdil-email" />
              </a>
              <span class="is-capitalized">
                {{ props.row.first_name }} {{ props.row.last_name }}
              </span>
            </b-table-column>
            <!-- Creation Date -->
            <b-table-column
              field="creation_date"
              label="Creation Date"
              v-slot="props"
              cell-class="vertical-center"
            >
              {{ props.row.created_at.toLocaleString() }}
            </b-table-column>

            <!-- Projects -->
            <b-table-column
              field="projects"
              label="Projects"
              v-slot="props"
              cell-class="vertical-center"
            >
              <!-- As owner -->
              <b-tooltip
                :label="`Owns ${props.row.counts.project_owner} project(s)`"
                type="is-dark"
                style="margin-right: 0.25rem"
              >
                <b-icon icon="mdil-account" />
                {{ props.row.counts.project_owner }}
              </b-tooltip>
              <!-- As follower -->
              <b-tooltip
                :label="`Follows ${props.row.counts.project_follower} project(s)`"
                type="is-dark"
              >
                <b-icon icon="mdil-rss" />
                {{ props.row.counts.project_follower }}
              </b-tooltip>
            </b-table-column>
            <!-- Teams -->
            <b-table-column
              field="teams"
              label="Teams"
              v-slot="props"
              cell-class="vertical-center"
            >
              <!-- As owner -->
              <b-tooltip
                :label="`Owns ${props.row.counts.team_owner} team(s)`"
                type="is-dark"
                style="margin-right: 0.25rem"
              >
                <b-icon icon="mdil-account" />
                {{ props.row.counts.team_owner }}
              </b-tooltip>
              <!-- As follower -->
              <b-tooltip
                :label="`Follows ${props.row.counts.team_follower} team(s)`"
                type="is-dark"
              >
                <b-icon icon="mdil-rss" />
                {{ props.row.counts.team_follower }}
              </b-tooltip>
            </b-table-column>

            <!-- Nominations -->
            <b-table-column
              field="nominations"
              label="Nominations"
              v-slot="props"
              cell-class="vertical-center"
            >
              <!-- As owner -->
              <b-tooltip
                :label="`Nominated ${props.row.counts.nomination_owner} target(s)`"
                type="is-dark"
                style="margin-right: 0.25rem"
              >
                <b-icon icon="mdil-account" />
                {{ props.row.counts.nomination_owner }}
              </b-tooltip>
              <!-- As follower -->
              <b-tooltip
                :label="`Voted for ${props.row.counts.nomination_vote} target(s)`"
                type="is-dark"
              >
                <b-icon icon="mdil-thumbs-up-down" />
                {{ props.row.counts.nomination_vote }}
              </b-tooltip>
            </b-table-column>

            <!-- Notification -->
            <b-table-column
              field="email-notification"
              label="Email Notification"
              v-slot="props"
              cell-class="vertical-center"
            >
              <span v-if="props.row.email_opt_out" class="has-text-danger">Opted out of all emails</span>
              <span v-else>
                Newsletter: {{ props.row.email_newsletter_frequency }}
              </span>
            </b-table-column>

            <!-- Actions -->
            <b-table-column
              field="actions"
              label="Actions"
              v-slot="props"
            >
              <b-field>
                <p class="control action-button">
                  <b-tooltip
                    v-if="props.row.is_blocked"
                    label="Unblock User"
                    type="is-warning"
                  >
                    <b-button
                      icon-right="mdil-circle"
                      type="is-warning"
                      @click="blockUnblockUser(props.row, 'unblocked')"
                    />
                  </b-tooltip>
                  <b-tooltip
                    v-else
                    label="Block User"
                    type="is-warning"
                  >
                    <b-button
                      icon-right="mdil-cancel"
                      type="is-light"
                      @click="blockUnblockUser(props.row, 'blocked')"
                    />
                  </b-tooltip>
                </p>
                <p class="control action-button">
                  <b-tooltip
                    v-if="props.row.is_moderator"
                    label="Remove moderator role"
                    type="is-info"
                  >
                    <b-button
                      icon-right="mdil-eye-off"
                      type="is-info"
                      @click="grantModeratorRole(props.row, 'unset')"
                    />
                  </b-tooltip>
                  <b-tooltip
                    v-else
                    label="Assign moderator role"
                    type="is-info"
                  >
                    <b-button
                      icon-right="mdil-eye"
                      type="is-light"
                      @click="grantModeratorRole(props.row, 'set')"
                    />
                  </b-tooltip>
                </p>
              </b-field>
            </b-table-column>
          </b-table>
        </div>

        <hr>

        <div
          class="project-header"
        >
          <p class="is-size-4 has-text-weight-bold is-flex has-vcentered">
            <b-tag
              size="is-medium"
              type="is-info"
              style="margin-right: 0.5rem"
            >
              {{ projectPagination.count }}
            </b-tag>
            Projects
          </p>
        </div>

        <div class="project-content">
          <b-table
            :data="projects"
            :loading="isLoading.projects"
            hoverable
            icon-pack="mdil"
            paginated
            pagination-position="top"
            backend-pagination
            :per-page="projectPagination.limit"
            :total="projectPagination.count"
            :current-page="projectPagination.current"
            @page-change="(change) => { projectPagination.current = change; fetchProjects() }"
          >
            <!-- Filter -->
            <template slot="top-left">
              <!-- Filter by name -->
              <b-field style="margin-left: 0.5em">
                <b-input
                  v-model="projectFilter"
                  placeholder="Target"
                  type="search"
                  icon="mdil-magnify"
                />
              </b-field>
            </template>

            <!-- No results -->
            <template slot="empty">
              <div
                class="no-project has-vcentered"
                v-if="!isLoading.projects"
              >
                <div class="info-icon">
                  <b-icon
                    icon="mdil-clipboard"
                    custom-size="mdil-48px"
                    type="is-grey-light"
                  />
                </div>
                <div class="info-content">
                  <p class="has-text-grey">
                    <span class="is-size-5">Sorry, we couldn't find any results.</span>
                  </p>
                </div>
              </div>
            </template>

            <!-- Target Name -->
            <b-table-column
              field="target"
              label="Target"
              v-slot="props"
              cell-class="vertical-center is-uppercase"
            >
              {{ props.row.target.name }}
            </b-table-column>

            <!-- Target Type and Organism-->
            <b-table-column
              field="type_organism"
              label="Type and Organism"
              v-slot="props"
              cell-class="vertical-center is-capitalized"
            >
              {{ props.row.target.type }}, <i>{{ props.row.target.organism }}</i>
            </b-table-column>

            <!-- Owner with link -->
            <b-table-column
              field="owner"
              label="Owner"
              v-slot="props"
              cell-class="vertical-center is-capitalized"
            >
              <router-link
                :to="{ path: `/user/${props.row.creator.username}`}"
                target="_blank"
                class="is-flex"
                v-if="props.row.creator"
              >
                <span
                  class="image is-24x24 is-inline-block"
                  style="margin-right: 0.5rem"
                >
                  <img
                    class="is-rounded"
                    :src="getProfileImageFromUser(props.row.creator)"
                  >
                </span>
                {{ props.row.creator.first_name }} {{ props.row.creator.last_name }}
              </router-link>
              <div v-else>
                Not available
              </div>
            </b-table-column>

            <!-- Creation Date -->
            <b-table-column
              field="creation_date"
              label="Creation Date"
              v-slot="props"
              cell-class="vertical-center"
            >
              {{ props.row.created_at.toLocaleString() }}
            </b-table-column>

            <!-- Following -->
            <b-table-column
              field="followers"
              label="Followers"
              v-slot="props"
              cell-class="vertical-center"
            >
              <!-- Followers -->
              <b-tooltip
                label="Followers"
                type="is-dark"
                style="margin-right: 0.25rem"
              >
                <b-icon icon="mdil-bell" />
                {{ props.row.counts.followers }}
              </b-tooltip>
              <!-- Requests -->
              <b-tooltip
                label="Requests"
                type="is-dark"
              >
                <b-icon icon="mdil-clock" />
                {{ props.row.counts.requests }}
              </b-tooltip>
            </b-table-column>
          </b-table>
        </div>
      </div>

      <ManageFunderModal
        :active.sync="isFunderModalActive"
        @change="fetchFunderRequest"
      />
    </div>
  </div>
</template>

<script>
import Error from '@/components/Error.vue'
import ManageFunderModal from '@/components/Modal/ManageFunderModal.vue'
import * as ModerationManage from "@/api/moderationManage.js"
import * as FunderManage from "@/api/funderManage.js"
import { handleError, displayErrorToast } from "@/api/errorHandler.js"
import debounce from 'lodash/debounce'
import { unparse } from "papaparse";
import { saveAs } from "file-saver";

export default {
  title: "Moderation",
  components: {
    Error,
    ManageFunderModal
  },
  watch: {
    userFilter() {
      this.debouncedFetchUsers()
    },
    projectFilter() {
      this.debouncedFetchProjects()
    }
  },
  data() {
    return {
      errorMessage: "",
      isLoading: {
        users: false,
        download_users: false,
        funder_request: false,
        projects: false
      },
      userFilter: "",
      userPagination: {
        count: 0,
        limit: 10,
        current: 1
      },
      users: undefined,
      userInAction: undefined,
      projectPagination: {
        count: 0,
        limit: 10,
        current: 1
      },
      funderRequests: 0,
      isFunderModalActive: false,
      projects: undefined,
      projectFilter: ""
    }
  },
  mounted() {
    if(this.hasDeepLink("#review-funders")) this.isFunderModalActive = true

    this.fetchUsers()
    this.fetchFunderRequest()
    this.fetchProjects()
  },
  methods: {
    debouncedFetchUsers: debounce(async function() {
      return await this.fetchUsers()
    }, 500),
    debouncedFetchProjects: debounce(async function() {
      return await this.fetchProjects()
    }, 500),
    async fetchUsers() {
      this.isLoading.users = true

      // Calculate skip
      const skip = (this.userPagination.current - 1) * this.userPagination.limit

      try {
        // Load users
        const response = await ModerationManage.listUsers(this.userFilter, this.userPagination.limit, skip)
        this.users = response.results
        this.userPagination.count = response.count
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.users = false
      }
    },
    async fetchFunderRequest() {
      this.isLoading.funder_request = true

      try {
        this.funderRequests = await FunderManage.countFunderRequest()
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.funder_request = false
      }
    },
    async fetchProjects() {
      this.isLoading.projects = true

      // Calculate skip
      const skip = (this.projectPagination.current - 1) * this.projectPagination.limit

      try {
        // Load projects
        const response = await ModerationManage.listProjects(this.projectFilter, this.projectPagination.limit, skip)
        this.projects = response.results
        this.projectPagination.count = response.count
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.projects = false
      }
    },
    async blockUnblockUser(user, state) {
      try {
        await ModerationManage.blockUnblockUser(user.id, state)

        // Confirmation
        this.$buefy.toast.open({
          duration: 5000,
          message: `User ${state}`,
          type: 'is-success',
          queue: false
        })

        // Set block state
        user.is_blocked = state === "blocked"
      } catch (error) {
        await displayErrorToast(error)
      }
    },
    async grantModeratorRole(user, state) {
      try {
        await ModerationManage.grantModeratorRole(user.id, state)

        // Confirmation
        this.$buefy.toast.open({
          duration: 5000,
          message: `Moderator role ${state}`,
          type: 'is-success',
          queue: false
        })

        // Set block state
        user.is_moderator = state === "set"
      } catch (error) {
        await displayErrorToast(error)
      }
    },
    async downloadUserInfo() {
      this.isLoading.download_users = true

      try {
        // Load all users
        let response = await ModerationManage.listUsers(this.userFilter)
        response = response.results
        
        // Flatten user data and convert to CSV
        let csv = response.map(user => {
          return {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            has_validated_email: user.email_validated,
            email_opt_out: Boolean(user.email_opt_out),
            email_newsletter_frequency: user.email_newsletter_frequency,
            is_blocked: user.is_blocked,
            is_moderator: Boolean(user.is_moderator),
            num_projects_owned: user.counts.project_owner,
            num_projects_followed: user.counts.project_follower,
            num_team_owned: user.counts.team_owner,
            num_team_followed: user.counts.team_follower,
            num_nomination_owned: user.counts.nomination_owner,
            num_nomination_voted: user.counts.nomination_vote,
          }
        })
        csv = unparse(csv)
        csv = "\ufeff" + csv; // Set UTF-8 encoding
        let blob = new Blob([csv], {
          type: "application/csvcharset=" + this.encoding
        });
        saveAs(blob, "user_info.csv");
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.download_users = false
      }
    },
  }
}
</script>

<style lang="sass" scoped>
td
  vertical-align: middle
</style>