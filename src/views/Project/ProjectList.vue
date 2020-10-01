<template>
  <div class="page-card">
    <!-- Header -->
    <div class="hero is-light">
      <div class="hero-body has-page-header-padding">
        <div class="container">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="content">
                <p class="is-size-3 has-text-weight-medium">
                  Projects
                </p>
              </div>
            </div>
            <div class="level-right">
              <!-- Register new project -->
              <!-- Non-mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-warning"
                size="is-medium"
                class="is-hidden-mobile small-shadow"
                @click="handleNewTargetModal()"
              >
                New Project
              </b-button>
              <!-- Mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-warning"
                size="is-medium"
                class="is-hidden-tablet small-shadow"
                @click="handleNewTargetModal()"
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
        :message="errorMessage"
        v-if="errorMessage !== ''"
      />

      <!-- Project table -->
      <div v-else>
        <!-- Tip -->
        <!-- Make sure you added the tip to the preferenceModule store -->
        <TipAction tip="why_follow">
          <p
            class="has-text-weight-bold field-margin"
            style="padding-right: 1rem"
          >
            What do I get by
            <span class="has-text-info">following a project</span>
            ?
          </p>
          Once your request to follow a project is apporved by the project owner, you will be able to:
          <p style="margin: 0.5rem 0 0.75rem 0">
            <b-icon
              icon="mdil-check"
              class="circle-icon has-background-success has-text-white"
            />
            Access project details such as activities
          </p>
          <p>
            <b-icon
              icon="mdil-check"
              class="circle-icon has-background-success has-text-white"
            />
            Receive on-site and email notifications of project update
          </p>
        </TipAction>

        <b-table
          :key="JSON.stringify(currentUser)"
          :data="targets"
          :loading="isLoading.fetch_targets"
          hoverable
          paginated
          pagination-position="top"
          backend-pagination
          icon-pack="mdil"
          :per-page="pagination.limit"
          :total="pagination.count"
          :current-page="pagination.current"
          @page-change="(change) => { pagination.current = change; fetchTargets() }"
        >
          <!-- Filter -->
          <!-- These filters will be on the same line -->
          <template slot="top-left">
            <div class="filter-same-line">
              <!-- Filter by type -->
              <b-dropdown
                :triggers="['hover', 'click']"
                v-model="filter.type"
                :mobile-modal="false"
                @input="fetchTargets()"
                class="filter-item"
              >
                <b-button
                  slot="trigger"
                  slot-scope="{ active }"
                  :type="filter.type ? 'is-info' : 'is-light'"
                >
                  <FilterOutline
                    class="filter-icon icon-18px"
                  />
                  <span style="margin-left: 0.25rem">Type</span>
                  <b-icon :icon="active ? 'mdil-chevron-up' : 'mdil-chevron-down'" />
                </b-button>

                <b-dropdown-item
                  v-if="filter.type !== ''"
                  value=""
                  class="has-text-info"
                >
                  Clear Filter
                </b-dropdown-item>
                <b-dropdown-item
                  v-for="(type, id) in types"
                  :key="id"
                  :value="type"
                >
                  {{ type }}
                </b-dropdown-item>
              </b-dropdown>

              <!-- Filter by organism -->
              <b-dropdown
                :triggers="['hover', 'click']"
                v-model="filter.organism"
                :mobile-modal="false"
                position="is-bottom-left"
                @input="fetchTargets()"
                class="filter-item"
              >
                <b-button
                  slot="trigger"
                  slot-scope="{ active }"
                  :type="filter.organism ? 'is-info' : 'is-light'"
                >
                  <FilterOutline
                    class="filter-icon icon-18px"
                  />
                  <span style="margin-left: 0.25rem">Organism</span>
                  <b-icon :icon="active ? 'mdil-chevron-up' : 'mdil-chevron-down'" />
                </b-button>

                <b-dropdown-item
                  v-if="filter.organism !== ''"
                  value=""
                  class="has-text-info"
                >
                  Clear Filter
                </b-dropdown-item>
                <b-dropdown-item
                  v-for="(organism, id) in organisms"
                  :key="id"
                  :value="organism"
                >
                  <i>{{ organism }}</i>
                </b-dropdown-item>
              </b-dropdown>

              <!-- Filter by condition -->
              <b-dropdown
                v-if="hasLoggedIn"
                :triggers="['hover', 'click']"
                v-model="filter.conditions"
                multiple
                :mobile-modal="false"
                position="is-bottom-left"
                @input="fetchTargets()"
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
                @input="fetchTargets()"
                class="filter-item"
              >
                <template v-slot:trigger>
                  <b-tooltip
                    label="Project created on or after this date"
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
                  @click="filter.created_after = undefined; fetchTargets()"
                  expanded
                  v-if="filter.created_after"
                >
                  Clear Filter
                </b-button>
              </b-datepicker>

              <!-- Filter by name -->
              <b-field
                class="filter-item"
                style="width: 10rem"
              >
                <b-input
                  v-model="filter.name"
                  placeholder="Search Name"
                  icon="mdil-magnify"
                  :icon-right="filter.name ? 'mdil-delete': ''"
                  icon-right-clickable
                  @icon-right-click="filter.name = ''; fetchTargets()"
                  :class="{ 'highlight-filter': filter.name }"
                  @input="debouncedFetchTargets()"
                />
              </b-field>
            </div>
          </template>

          <!-- No results -->
          <template slot="empty">
            <div
              class="no-project has-vcentered"
              v-if="!isLoading.fetch_targets"
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

          <!-- Target name-->
          <b-table-column
            field="target_name"
            label="Name"
            cell-class="is-uppercase"
            v-slot="props"
          >
            {{ props.row.name }}
          </b-table-column>

          <!-- Target type -->
          <b-table-column
            field="target_type"
            label="Type"
            cell-class="is-capitalized"
            v-slot="props"
          >
            {{ props.row.type }}
          </b-table-column>

          <!-- Target species -->
          <b-table-column
            field="target_organism"
            label="Organism"
            v-slot="props"
          >
            <i>{{ props.row.organism }}</i>
          </b-table-column>

          <!-- Progress -->
          <b-table-column
            field="projects"
            label="Project Progress"
            v-slot="props"
          >
            <div class="has-text-left">
              <!-- If not member, show this panel to indicate that nothing is available -->
              <div
                v-if="props.row.projects < 1"
                class="card project-card has-background-light"
              >
                <div class="card-header">
                  <p
                    class="card-header-title"
                    v-if="hasLoggedIn"
                  >
                    <b-icon
                      icon="mdil-play"
                      style="margin-right: 0.25rem"
                    />
                    Under Investigation
                  </p>
                  <p
                    class="card-header-title is-capitalized"
                    v-else
                  >
                    <b-icon
                      icon="mdil-lock"
                      style="margin-right: 0.25rem"
                    />
                    Login For Details
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
                  slot-scope="innerProps"
                  class="card-header"
                  role="button"
                >
                  <p
                    v-if="project.type"
                    class="card-header-title"
                  >
                    <b-icon
                      :icon="progressIcons[project.type]"
                      style="margin-right: 0.25rem"
                    />
                    <span class="is-capitalized description">{{ project.type }}</span>
                    <span
                      class="is-size-7 has-text-info is-hidden-touch is-hidden-desktop-only"
                      style="margin-left: 0.5rem"
                    >(Click to {{ innerProps.open ? 'collapse' : 'expand' }})</span>
                  </p>
                  <p
                    v-else
                    class="card-header-title"
                  >
                    <b-icon
                      icon="mdil-play"
                      style="margin-right: 0.25rem"
                    />
                    <span class="is-capitalized description">Under Investigation</span>
                    <span
                      class="is-size-7 has-text-info is-hidden-touch is-hidden-desktop-only"
                      style="margin-left: 0.5rem"
                    >(Click to {{ innerProps.open ? 'collapse' : 'expand' }})</span>
                  </p>
                  <div class="card-header-icon">
                    <!-- Open for funding -->
                    <b-tooltip
                      label="Open for funding"
                      v-if="isFunder && project.open_for_funding"
                      type="is-warning"
                    >
                      <b-icon
                        class="circle-icon has-background-warning has-text-dark"
                        icon="mdil-currency-usd"
                      />
                    </b-tooltip>

                    <!-- Owner -->
                    <b-tooltip
                      label="Project you created"
                      v-if="currentUser && project.creator.username === currentUser.username"
                      type="is-success"
                    >
                      <b-icon
                        icon="mdil-account"
                        class="circle-icon has-background-success has-text-light"
                      />
                    </b-tooltip>

                    <!-- Follow -->
                    <b-tooltip
                      label="Following"
                      v-if="project.follow_status && project.follow_status.status === 'yes'"
                      type="is-info"
                    >
                      <b-icon
                        icon="mdil-bell"
                        class="circle-icon has-background-info has-text-light"
                      />
                    </b-tooltip>

                    <!-- Expand -->
                    <b-icon
                      :icon="innerProps.open ? 'mdil-chevron-up' : 'mdil-chevron-down'"
                    />
                  </div>
                </div>
                <div class="card-content">
                  <div
                    class="content"
                  >
                    <div class="is-size-6">
                      <span class="has-text-primary">
                        Feature{{ project.features.length > 1 ? 's:' : ':' }}
                        {{ project.features.join(", ") }}
                      </span>
                      <br>
                      <ShowMoreField
                        v-if="project.description"
                        :value="project.description"
                      />
                      <div v-else-if="project.follow_status">
                        <p
                          v-if="!project.follow_status.id && project.creator.username !== currentUser.username && !isModerator"
                          class="has-text-danger font-14px"
                        >
                          Click "Follow" to request access to project details and receive update alerts.
                        </p>
                        <p
                          v-else-if="project.follow_status.status === 'pending'"
                          class="has-text-danger font-14px"
                        >
                          Your follow request is pending approval. Once approved, 
                          you will gain access to project details and receive update alerts.
                        </p>
                        <p
                          v-else-if="project.follow_status.status === 'yes' || project.creator.username === currentUser.username || isModerator"
                          class="has-text-danger font-14px"
                        >
                          No details available for this project.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="card-footer-item has-background-white-bis">
                    <router-link
                      :to="{ path: `/project/${project.id}`}"
                      target="_blank"
                    >
                      <b-icon icon="mdil-magnify" />
                      Details
                    </router-link>
                  </div>
                  <div
                    v-if="project.follow_status && currentUser && project.creator.username !== currentUser.username && project.follow_status"
                    class="card-footer-item" 
                    :class="{ 
                      'has-background-white-bis': !project.follow_status.id, 
                      'has-background-warning': project.follow_status.status === 'pending',
                      'has-background-info': project.follow_status.status === 'yes'
                    }"
                  >
                    <!-- If not followed, show follow icon -->
                    <div v-if="!project.follow_status.id">
                      <a @click="confirmFollow(project.id, 'project', project.creator)">
                        <b-icon icon="mdil-bell" />
                        Follow
                      </a>
                    </div>
                    <!-- If pending, show pending status and unfollow-->
                    <b-tooltip
                      :label="project.follow_status.status === 'pending' ? 'Pending Approval. Click to cancel request.' : 'Unfollow Project'"
                      type="is-dark"
                      position="is-left"
                      v-else
                    >
                      <a
                        @click="confirmUnfollow(project.follow_status.id, 'project')"
                        :class="{ 
                          'has-text-info': !project.follow_status.id, 
                          'has-text-dark': project.follow_status.status === 'pending',
                          'has-text-light': project.follow_status.status === 'yes'
                        }"
                      >
                        <span v-if="project.follow_status.status === 'pending'">
                          <b-icon icon="mdil-clock" />
                          Pending
                        </span>
                        <span v-else-if="project.follow_status.status === 'yes'">
                          <b-icon icon="mdil-bell" />
                          Following
                        </span>
                      </a>
                    </b-tooltip>
                  </div>
                </div>
              </b-collapse>
            </div>
          </b-table-column>

          <!-- Active teams -->
          <b-table-column
            field="team"
            label="Team"
            v-slot="props"
          >
            <div
              v-if="!hasLoggedIn"
              class="card project-card has-background-light"
            >
              <div class="card-header">
                <p class="card-header-title is-capitalized">
                  <b-icon icon="mdil-lock" />
                  Login for details
                </p>
              </div>
            </div>
            <b-field
              grouped
              group-multiline
              class="team-control"
              v-else
            >
              <div
                class="control has-fullwidth"
                v-for="(team, index) in props.row.teams"
                :key="index"
              >
                <b-taglist attached>
                  <b-tag
                    size="is-medium"
                    class="is-capitalized"
                  >
                    <router-link
                      :to="{ path: `/team/${team.id}`}"
                      target="_blank"
                      class="has-text-grey-darker"
                    >
                      <b-icon
                        icon="mdil-account"
                        class="team-icon"
                      />
                      {{ team.name }}
                    </router-link>
                  </b-tag>
                </b-taglist>
              </div>
            </b-field>
          </b-table-column>

          <!-- Action -->
          <b-table-column
            field="action"
            label="Action"
            width="5vw"
            v-slot="props"
          >
            <b-field>
              <p class="control action-button">
                <b-tooltip
                  label="Add new project"
                  type="is-dark"
                  position="is-left"
                >
                  <b-button
                    icon-right="mdil-plus"
                    @click="handleNewTargetModal(props.row)"
                    type="is-light"
                  />
                </b-tooltip>
              </p>
              <p class="control action-button">
                <!-- Show MaveQuest for human genes -->
                <b-tooltip
                  v-if="props.row.type == 'Gene' && props.row.organism == 'H. sapiens'"
                  label="Expore at MaveQuest"
                  type="is-info"
                  position="is-left"
                >
                  <b-button
                    tag="a"
                    :href="'https://mavequest.varianteffect.org/query?gene=' + props.row.name"
                    target="_blank"
                    type="is-light"
                    class="mavequest-button"
                  >
                    <img src="@/assets/image/mavequest_logo_grey.png">
                  </b-button>
                </b-tooltip>
                <!-- Show Google search for others -->
                <b-tooltip
                  v-else
                  label="Look up"
                  type="is-info"
                  position="is-left"
                >
                  <b-button
                    tag="a"
                    :href="'https://www.google.com/search?q=' + props.row.name"
                    rel="noopener noreferrer"
                    target="_blank"
                    icon-right="mdil-magnify"
                    type="is-light"
                  />
                </b-tooltip>
              </p>
            </b-field>
          </b-table-column>
        </b-table>
      </div>

      <!-- Follow up modal -->
      <FollowModal
        :active.sync="isFollowModelActive"
        :source="followProp.source"
        :creator="followProp.creator"
        :type="followProp.type"
        @change="fetchTargets()"
      />

      <!-- Unfollow modal -->
      <UnfollowModal
        :active.sync="isUnfollowModelActive"
        :follow="followProp.follow"
        :type="followProp.type"
        @change="fetchTargets()"
      />

      <!-- New project modal -->
      <NewTargetModal
        :active.sync="isNewTargetModalActive"
        title="Add a New Project"
        :submit="addProject"
        submit-text="Add Project"
        :target="preFilledProject"
        has-feature
      />
    </div>
  </div>
</template>

<script>
import * as ProjectManage from "@/api/projectManage.js"
import { handleError } from "@/api/errorHandler.js"
import Error from '@/components/Error.vue'
import FollowModal from '@/components/Modal/FollowModal.vue'
import UnfollowModal from '@/components/Modal/UnfollowModal.vue'
import NewTargetModal from '@/components/Modal/NewTargetModal.vue'
import ShowMoreField from '@/components/Field/ShowMoreField.vue'
import TipAction from '@/components/Action/TipAction.vue'
import FilterOutline from "vue-material-design-icons/FilterOutline.vue"
import debounce from 'lodash/debounce'
import pick from 'lodash/pick'

const variables = require("@/assets/script/variables.json")

export default {
  title: "Projects",
  components: {
    Error,
    FollowModal,
    UnfollowModal,
    NewTargetModal,
    ShowMoreField,
    TipAction,
    FilterOutline
  },
  watch: {
    async currentUser() {
      if (this.hasInitLoad) await this.fetchTargets()
    }
  },
  data () {
    return {
      targets: [],
      pagination: {
        count: 0,
        limit: 10,
        current: 1
      },
      progressIcons: variables.progress_type_icons,
      types: variables.target_types,
      organisms: variables.target_organisms,
      conditions: {
        "creator": { 
          name: "Projects you created", 
          icon: "mdil-account",
          icon_class: "has-background-success has-text-light"
        },
        "follower": {
          name: "Projects you follow",
          icon: "mdil-bell",
          icon_class: "has-background-info has-text-light"
        },
        "funding": {
          name: "Projects with funding need",
          icon: "mdil-currency-usd",
          icon_class: "has-background-warning has-text-dark",
          role: "funder"
        },
      },
      // Filter
      filter: {
        type: "",
        organism: "",
        name: "",
        created_after: undefined,
        conditions: []
      },
      // Follow/unfollow target related parameters
      isFollowModelActive: false,
      followProp: {
        source: "",
        creator: {},
        follow: "",
        type: ""
      },
      preFilledProject: undefined,
      isUnfollowModelActive: false,
      // Register new activity related parameters
      isNewTargetModalActive: false,
      isLoading: {
        new_project: false,
        follow_unfollow: false,
        fetch_targets: false
      },
      errorMessage: "",
      hasInitLoad: false
    }
  },
  async mounted () {
    // If filter queries are supplied, process them
    if (this.$route.query) {
      if (this.$route.query.type) this.filter.type = this.$route.query.type
      if (this.$route.query.name) this.filter.name = this.$route.query.name
      if (this.$route.query.organism) this.filter.organism = this.$route.query.organism
      if (this.$route.query.created_after) {
        const convertedDate = new Date(this.$route.query.created_after)
        if (Object.prototype.toString.call(convertedDate) === '[object Date]' && isFinite(convertedDate)) {
          this.filter.created_after = convertedDate
        }
      }
    }

    // Hide display elements based on role
    if (!this.isFunder) {
      const conditionKeys = Object.keys(this.conditions).filter(e => !this.conditions[e].role || this.conditions[e].role !== 'funder')
      this.conditions = pick(this.conditions, conditionKeys)
    }
    await this.fetchTargets()
    this.hasInitLoad = true
  },
  methods: {
    confirmFollow(id, type, creator) {
      this.followProp.source = id
      this.followProp.type = type
      this.followProp.creator = creator
      this.isFollowModelActive = true
    },
    confirmUnfollow(id, type) {
      this.followProp.follow = id
      this.followProp.type = type
      this.isUnfollowModelActive = true
    },
    async fetchTargets() {
      // Loading
      this.isLoading.fetch_targets = true

      // Calculate skip
      const skip = (this.pagination.current - 1) * this.pagination.limit

      // Reset filter if clear is set
      if (this.filter.conditions.length > 0 && this.filter.conditions.includes("clear"))
        this.filter.conditions = []

      // Update targets
      try {
        const targets = await ProjectManage.fetchTargets(this.pagination.limit, skip, this.filter)
        this.targets = targets.results

        // Update pagination
        this.pagination.count = targets.count
      } catch (error) {
        this.errorMessage = await handleError(error)
        throw error
      } finally {
        this.isLoading.fetch_targets = false
      }
    },
    debouncedFetchTargets: debounce(async function() {
      return await this.fetchTargets()
    }, 500),
    handleNewTargetModal(prefill = undefined) {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login")
        return
      }
      
      if (prefill) {
        this.preFilledProject = {
          type: prefill.type,
          name: prefill.name,
          organism: prefill.organism
        }
      } else {
        this.preFilledProject = undefined
      }

      this.isNewTargetModalActive = true
    },
    async addProject(attrs) {
      const projectId = await ProjectManage.addProject(attrs)

      // Jump to new project registration page
      this.$router.push({ name: 'Project Edit', params: { id: projectId, action: 'new' } })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/style/variables.sass"

@media screen and (max-width: $break-mobile)
  .team-control
    justify-content: flex-end
    .control:first-child
      margin-right: 0 !important
    .control:not(:first-child)
      margin-left: 0.75rem
.team-control
  height: 3.25rem
  .tags
    border-radius: 4px
    flex-wrap: nowrap
    .tag
      margin: 0
      height: 2.5rem
      box-shadow: 0 0 0 0 rgba(10, 10, 10, 0.1) inset, 0 -1px 0 0 rgba(10, 10, 10, 0.1) inset
      &:first-child
        border-top-right-radius: 0
        border-bottom-right-radius: 0
        flex-grow: 1
        justify-content: flex-start
      &:only-child
        border-top-right-radius: 4px
        border-bottom-right-radius: 4px
        flex-grow: 1
        justify-content: flex-start
.card-header-icon
  .b-tooltip
    &:not(:last-child), &:only-child
      margin-right: 0.25rem
</style>