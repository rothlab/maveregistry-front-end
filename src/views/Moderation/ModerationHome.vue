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
                  Moderate
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

        <div
          class="project-content"
        >
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
            detailed
            detail-key="id"
          >
            <!-- Filter -->
            <template slot="top-left">
              <!-- Filter by name -->
              <b-field style="margin-left: 0.5em">
                <b-input
                  v-model="userFilter"
                  placeholder="Search Name"
                  type="search"
                  icon="mdil-magnify"
                />
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

            <template
              slot="detail"
            >
              <div class="columns">
                <div class="column">
                  <p>Projects</p>
                </div>
                <div class="column">
                  <p>Teams</p>
                </div>
                <div class="column">
                  <p>Nominations</p>
                </div>
              </div>
            </template>

            <!-- Username with link -->
            <b-table-column
              field="username"
              label="Username"
              v-slot="props"
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
            >
              <span class="is-capitalized">
                {{ props.row.first_name }} {{ props.row.last_name }}
              </span>
            </b-table-column>
            <!-- Name -->
            <b-table-column
              field="creation_date"
              label="Creation Date"
              v-slot="props"
            >
              {{ props.row.created_at.toLocaleString() }}
            </b-table-column>
            <!-- Projects -->
            <b-table-column
              field="projects"
              label="Projects"
              v-slot="props"
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
      </div>
    </div>
  </div>
</template>

<script>
import Error from '@/components/Error.vue'
import * as ModerationHandler from "@/api/moderationHandler.js"
import { handleError, displayErrorToast } from "@/api/errorHandler.js"

export default {
  title: "Moderation",
  components: {
    Error
  },
  watch: {
    async userFilter() {
      await this.fetchUsers()
    }
  },
  data() {
    return {
      errorMessage: "",
      isLoading: {
        users: false
      },
      userFilter: "",
      userPagination: {
        count: 0,
        limit: 10,
        current: 1
      },
      users: undefined,
      userInAction: undefined,
      isConfirmDeleteUserModalActive: false
    }
  },
  async mounted() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      this.isLoading.users = true

      // Calculate skip
      const skip = (this.userPagination.current - 1) * this.userPagination.limit

      try {
        // Load users
        const response = await ModerationHandler.listUsers(this.userFilter, this.userPagination.limit, skip)
        this.users = response.results
        this.userPagination.count = response.count
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.users = false
      }
    },
    async blockUnblockUser(user, state) {
      try {
        await ModerationHandler.blockUnblockUser(user.id, state)

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
        await ModerationHandler.grantModeratorRole(user.id, state)

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
    }
  }
}
</script>

<style lang="sass" scoped>
td
  vertical-align: middle
</style>