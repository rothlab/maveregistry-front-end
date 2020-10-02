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
                  Teams
                </p>
              </div>
            </div>
            <div
              class="level-right"
              v-if="hasLoggedIn"
            >
              <!-- Register new team -->
              <!-- Non-mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-warning"
                size="is-medium"
                class="is-hidden-mobile small-shadow"
                @click="addTeam"
              >
                New Team
              </b-button>
              <!-- Mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-warning"
                size="is-medium"
                class="is-hidden-tablet small-shadow"
                @click="addTeam"
              >
                New
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <Error
        v-if="!isLoading.fetch_team && errorMessage !== ''"
        :message="errorMessage"
      />

      <!-- Team table -->
      <div v-else>
        <b-table
          :data="teams"
          :loading="isLoading.fetch_team"
          hoverable
          paginated
          pagination-position="top"
          backend-pagination
          icon-pack="mdil"
          :per-page="pagination.limit"
          :total="pagination.count"
          :current-page="pagination.current"
          @page-change="(change) => { pagination.current = change; fetchTeams() }"
        >
          <!-- Filter -->
          <!-- These filters will be on the same line -->
          <template slot="top-left">
            <div class="filter-same-line">
              <!-- Filter by conditions -->
              <b-dropdown
                v-if="hasLoggedIn"
                :triggers="['hover', 'click']"
                v-model="filter.conditions"
                multiple
                :mobile-modal="false"
                position="is-bottom-right"
                @input="fetchTeams()"
                class="filter-item"
              >
                <b-button
                  slot="trigger"
                  slot-scope="{ active }"
                  :type="filter.conditions.length > 0 ? 'is-info' : 'is-light'"
                >
                  <FilterOutline
                    class="filter-icon icon-18px"
                  />
                  <span style="margin-left: 0.25rem">Condition</span>
                  <b-icon :icon="active ? 'mdil-chevron-up' : 'mdil-chevron-down'" />
                </b-button>

                <b-dropdown-item
                  v-if="filter.conditions.length > 0"
                  value="clear"
                  class="has-text-info"
                >
                  Clear Filter
                </b-dropdown-item>
                <b-dropdown-item
                  v-for="(key, id) in Object.keys(conditions)"
                  :key="id"
                  :value="key"
                >
                  <b-icon
                    :class="`circle-icon ${conditions[key].icon_class}`"
                    :icon="conditions[key].icon"
                  />
                  {{ conditions[key].name }}
                </b-dropdown-item>
              </b-dropdown>

              <!-- Filter by creation date -->
              <b-datepicker
                v-model="filter.created_after"
                placeholder="Created Since"
                icon="mdil-calendar"
                icon-prev="mdil-chevron-left"
                icon-next="mdil-chevron-right"
                :class="{ 'highlight-filter': filter.created_after }"
                :max-date="new Date()"
                :mobile-native="false"
                @input="fetchTeams()"
                class="filter-item"
              >
                <template v-slot:trigger>
                  <b-tooltip
                    label="Team created on or after this date"
                    type="is-dark"
                  >
                    <b-button
                      :type="filter.created_after ? 'is-info' : 'is-light'"
                    >
                      <FilterOutline
                        class="filter-icon icon-18px"
                      />
                      <span>
                        {{ filter.created_after ? filter.created_after.toLocaleDateString() : "Date" }}
                      </span>
                    </b-button>
                  </b-tooltip>
                </template>
                <b-button
                  type="is-info"
                  outlined
                  @click="filter.created_after = undefined; fetchTeams()"
                  expanded
                  v-if="filter.created_after"
                >
                  Clear Filter
                </b-button>
              </b-datepicker>

              <!-- Filter by PI -->
              <b-field
                class="filter-item"
                style="width: 15rem"
              >
                <b-input
                  v-model="filter.pi"
                  placeholder="Search Investigator"
                  icon="mdil-magnify"
                  :icon-right="filter.pi ? 'mdil-delete': ''"
                  icon-right-clickable
                  @icon-right-click="filter.pi = ''; fetchTeams()"
                  :class="{ 'highlight-filter': filter.pi }"
                  @input="debouncedFetchTeams()"
                />
              </b-field>
            </div>
          </template>

          <!-- No results -->
          <template slot="empty">
            <div
              class="no-project has-vcentered"
              v-if="!isLoading.fetch_team"
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

          <!-- Principal Investigator -->
          <b-table-column
            field="principal_investigator"
            label="Principal Investigator"
            v-slot="props"
          >
            <div class="level is-mobile is-paddingless">
              <div class="level-left">
                <p>
                  <router-link
                    :to="{ path: `/team/${props.row.id}`}"
                    target="_blank"
                    class="is-capitalized"
                  >
                    {{ props.row.first_name }} {{ props.row.last_name }}
                  </router-link>
                  <b-tooltip
                    label="Team you created"
                    type="is-success"
                    v-if="hasLoggedIn && props.row.creator.username === currentUser.username"
                  >
                    <b-icon
                      icon="mdil-account"
                      class="circle-icon has-background-success has-text-light"
                    />
                  </b-tooltip>
                </p>
              </div>

              <div class="level-right">
                <!-- Email link -->
                <a
                  v-if="props.row.website"
                  :href="props.row.website"
                  target="_blank"
                >
                  <b-icon icon="mdil-link" />
                </a>

                <!-- Website icon -->
                <a
                  v-if="props.row.email"
                  :href="`mailto:${props.row.email}`"
                >
                  <b-icon icon="mdil-email" />
                </a>
              </div>
            </div>
          </b-table-column>

          <!-- Affiliation -->
          <b-table-column
            field="affiliation"
            label="Affiliation"
            v-slot="props"
          >
            {{ props.row.affiliation }}
          </b-table-column>

          <!-- Project Progress -->
          <b-table-column
            field="progress"
            label="Project"
            v-slot="props"
          >
            <div class="has-text-left">
              <!-- If not member, show this panel to indicate that nothing is available -->
              <div
                v-if="!props.row.projects || props.row.projects < 1"
                class="card project-card has-background-light"
              >
                <div class="card-header">
                  <p class="card-header-title is-capitalized">
                    <b-icon icon="mdil-play" />
                    Under Investigation
                  </p>
                </div>
              </div>
              <b-collapse
                v-else
                class="card project-card has-background-light"
                animation="slide"
                v-for="(project, index) in props.row.projects"
                :key="index"
                :open="false"
              >
                <div
                  slot="trigger"
                  class="card-header"
                  role="button"
                >
                  <div class="card-header-title is-capitalized">
                    <router-link
                      :to="{ path: `/project/${project.id}`}"
                      target="_blank"
                    >
                      <b-icon icon="mdil-link" />
                      {{ project.target.name.toUpperCase() }}
                      ({{ project.target.type }}, <i>{{ project.target.organism }}</i>):
                      {{ project.features.join(",") }}
                    </router-link>
                  </div>
                    
                  <div class="card-header-icon">
                    <b-tooltip
                      label="Seeking Funding"
                      v-if="project.open_for_funding"
                      type="is-warning"
                    >
                      <b-icon
                        class="circle-icon has-background-warning"
                        icon="mdil-currency-usd"
                      />
                    </b-tooltip>
                  </div>
                </div>
              </b-collapse>
            </div>
          </b-table-column>

          <!-- Action -->
          <b-table-column
            field="action"
            label="Action"
            width="5vw"
            v-slot="props"
          >
            <div
              class="action-button is-flex"
              v-if="hasLoggedIn && props.row.creator.username !== currentUser.username"
            >
              <b-button
                v-if="props.row.follow_status && props.row.follow_status.id"
                :icon-left="props.row.follow_status.status === 'pending' ? 'mdil-clock' : 'mdil-bell'"
                :type="props.row.follow_status.status === 'pending' ? 'is-warning' : 'is-info'"
                @click="confirmUnfollow(props.row.follow_status.id)"
                @change="fetchTeams()"
                expanded
              >
                <b-tooltip
                  v-if="props.row.follow_status.status === 'pending'"
                  label="Pending Approval."
                  type="is-dark"
                >
                  Pending
                </b-tooltip>
                <span v-else>Following</span>
              </b-button>
              <b-button
                v-else
                icon-left="mdil-bell"
                type="is-light"
                @click="confirmFollow(props.row.id, props.row.creator)"
                @change="fetchTeams()"
                expanded
              >
                Follow
              </b-button>
            </div>
          </b-table-column>
        </b-table>
      </div>
    </div>

    <!-- New Team Modal -->
    <NewTeamModal
      :active.sync="isNewTeamModalActive"
      @change="fetchTeams()"
    />

    <!-- Follow Team Modal -->
    <FollowModal
      :active.sync="isFollowModelActive"
      :source="followProp.source"
      :creator="followProp.creator"
      :type="followProp.type"
      @change="fetchTeams()"
    />

    <!-- Unfollow Team Modal -->
    <UnfollowModal
      :active.sync="isUnfollowModelActive"
      :follow="followProp.follow"
      :type="followProp.type"
      @change="fetchTeams()"
    />
  </div>
</template>

<script>
import * as TeamManage from "@/api/teamManage.js"
import NewTeamModal from "@/components/Modal/NewTeamModal.vue"
import FollowModal from '@/components/Modal/FollowModal.vue'
import UnfollowModal from '@/components/Modal/UnfollowModal.vue'
import { handleError } from "@/api/errorHandler.js"
import Error from '@/components/Error.vue'
import debounce from 'lodash/debounce'
import FilterOutline from "vue-material-design-icons/FilterOutline.vue"

export default {
  title: "Teams",
  components: {
    NewTeamModal,
    FollowModal,
    UnfollowModal,
    Error,
    FilterOutline
  },
  computed: {
    hasLoggedIn() {
      return this.$store.getters.hasLoggedIn
    }
  },
  data() {
    return {
      isNewTeamModalActive: false,
      isFollowModelActive: false,
      isUnfollowModelActive: false,
      isLoading: {
        fetch_team: false,
        new_team: false
      },
      teams: [],
      pagination: {
        count: 0,
        limit: 10,
        current: 1
      },
      followProp: {
        source: "",
        follow: "",
        creator: {},
        type: "team"
      },
      conditions: {
        "creator": { 
          name: "Teams you created", 
          icon: "mdil-account",
          icon_class: "has-background-success has-text-light"
        }
      },
      filter: {
        pi: "",
        created_after: undefined,
        conditions: []
      },
      errorMessage: "",
      hasInitLoad: false
    }
  },
  watch: {
    async currentUser() {
      if (this.hasInitLoad) await this.fetchTeams()
    }
  },
  async mounted() {
    // If filter queries are supplied, process them
    if (this.$route.query) {
      if (this.$route.query.pi) this.filter.pi = this.$route.query.pi
      if (this.$route.query.created_after) {
        const convertedDate = new Date(this.$route.query.created_after)
        if (Object.prototype.toString.call(convertedDate) === '[object Date]' && isFinite(convertedDate)) {
          this.filter.created_after = convertedDate
        }
      }
    }

    await this.fetchTeams()
    this.hasInitLoad = true
  },
  methods: {
    confirmFollow(id, creator) {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login")
        return
      }

      this.followProp.source = id
      this.followProp.creator = creator
      this.isFollowModelActive = true
    },
    confirmUnfollow(id) {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login")
        return
      }

      this.followProp.follow = id
      this.isUnfollowModelActive = true
    },
    async fetchTeams() {
      // Loading
      this.isLoading.fetch_team = true

      // Calculate skip
      const skip = (this.pagination.current - 1) * this.pagination.limit
      
      // Reset filter if clear is set
      if (this.filter.conditions.length > 0 && this.filter.conditions.includes("clear"))
        this.filter.conditions = []

      // Update targets
      try {
        const teams = await TeamManage.fetchTeams(this.pagination.limit, skip, this.filter, ["project", "follow", "creator"])
        this.teams = teams.results

        // Update pagination
        this.pagination.count = teams.count
      } catch (error) {
        this.errorMessage = await handleError(error)
        throw error
      } finally {
        this.isLoading.fetch_team = false
      }
    },
    debouncedFetchTeams: debounce(async function() {
      return await this.fetchTeams()
    }, 500),
    addTeam() {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login")
        return
      }

      this.isNewTeamModalActive = true
    },
    trimKeyword(string, keyword) {
      if (keyword.length <= 0 || !string.startsWith(keyword)) return this.capitalize(string)
      return string.replace(keyword, '')
    }
  }
}
</script>