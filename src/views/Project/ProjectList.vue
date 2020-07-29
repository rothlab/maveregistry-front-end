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
                type="is-danger"
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
          <p class="has-text-weight-bold field-margin">
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
            Access sensitive project details such as activities
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
          <template slot="top-left">
            <!-- Filter by type -->
            <b-dropdown
              hoverable
              v-model="filter.type"
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
              hoverable
              v-model="filter.organism"
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

            <!-- Filter by name -->
            <b-field style="margin-left: 0.5em">
              <b-input
                v-model="filter.name"
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

          <template slot-scope="props">
            <!-- Target name-->
            <b-table-column
              field="target_name"
              label="Name"
              class="is-uppercase"
            >
              {{ props.row.name }}
            </b-table-column>

            <!-- Target type -->
            <b-table-column
              field="target_type"
              label="Type"
              class="is-capitalized"
            >
              {{ props.row.type }}
            </b-table-column>

            <!-- Target species -->
            <b-table-column
              field="target_organism"
              label="Organism"
            >
              <i>{{ props.row.organism }}</i>
            </b-table-column>

            <!-- Progress -->
            <b-table-column
              field="projects"
              label="Project Progress"
              width="30vw"
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
                      <span class="is-capitalized">{{ project.type }}</span>
                      <span
                        class="is-size-7 has-text-info"
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
                      <span class="is-capitalized">Under Investigation</span>
                      <span
                        class="is-size-7 has-text-info"
                        style="margin-left: 0.5rem"
                      >(Click to {{ innerProps.open ? 'collapse' : 'expand' }})</span>
                    </p>
                    <div class="card-header-icon">
                      <!-- Open for funding -->
                      <b-tooltip
                        label="Open for funding"
                        v-if="project.open_for_funding"
                        type="is-warning"
                      >
                        <b-icon
                          class="circle-icon has-background-warning has-text-dark"
                          icon="mdil-currency-usd"
                        />
                      </b-tooltip>

                      <!-- Owner -->
                      <b-tooltip
                        label="Project Owner"
                        v-if="currentUser && project.creator.username === currentUser.username"
                        type="is-success"
                      >
                        <b-icon
                          icon="mdil-account"
                          class="circle-icon has-background-success has-text-light"
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
                            v-if="!project.follow_status.id && project.creator.username !== currentUser.username"
                            class="has-text-danger font-14px"
                          >
                            Click "Follow Project" to request access to project details and receive update alerts.
                          </p>
                          <p
                            v-else-if="project.follow_status.status === 'pending'"
                            class="has-text-danger font-14px"
                          >
                            Your follow request is pending approval. Once approved, 
                            you will gain access to project details and receive update alerts.
                          </p>
                          <p
                            v-else-if="project.follow_status.status === 'yes' || project.creator.username === currentUser.username"
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
                        View Details
                      </router-link>
                    </div>
                    <div
                      v-if="project.follow_status && currentUser && project.creator.username !== currentUser.username && project.follow_status"
                      class="card-footer-item" 
                      :class="{ 
                        'has-background-white-bis': !project.follow_status.id, 
                        'has-background-warning': project.follow_status.status === 'pending',
                        'has-background-danger': project.follow_status.status === 'yes'
                      }"
                    >
                      <!-- If not followed, show follow icon -->
                      <div v-if="!project.follow_status.id">
                        <a @click="confirmFollow(project.id, 'project', project.creator)">
                          <b-icon icon="mdil-bell" />
                          Follow Project
                        </a>
                      </div>
                      <!-- If pending, show pending status and unfollow-->
                      <b-tooltip
                        :label="project.follow_status.status === 'pending' ? 'Pending Approval. Click to retract request.' : 'Unfollow Project'"
                        type="is-dark"
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
                          <b-icon icon="mdil-bell-off" />
                          Unfollow Project
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
                  class="control"
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
                    
                    <!-- Followed status -->
                    <b-tag
                      v-if="currentUser && team.creator && team.creator.username !== currentUser.username && team.follow_status.id"
                      size="is-medium"
                      class="is-clickable"
                      :class="{ 'has-background-warning': team.follow_status.status === 'pending', 'has-background-danger': team.follow_status.status === 'yes' }"
                      @click.native="confirmUnfollow(team.follow_status.id, 'team')"
                    >
                      <b-tooltip
                        :label="team.follow_status.status === 'pending' ? 'Pending Approval. Click to retract request.' : 'Unfollow Team'"
                        type="is-dark"
                      >
                        <span 
                          :class="{ 
                            'has-text-dark': team.follow_status.status === 'pending',
                            'has-text-light': team.follow_status.status === 'yes'
                          }"
                        >
                          {{ team.follow_status.status === 'pending' ? "Pending" : "Unfollow" }}
                        </span>
                      </b-tooltip>
                    </b-tag>
                    <!-- Unfollowed status -->
                    <b-tag
                      v-else-if="currentUser && team.creator && team.creator.username !== currentUser.username && !team.follow_status.id"
                      size="is-medium"
                      class="is-clickable has-background-white-bis"
                      @click.native="confirmFollow(team.id, 'team', team.creator)"
                    >
                      <b-tooltip
                        label="Follow Team"
                        type="is-white"
                      >
                        <span class="has-text-info">Follow</span>
                      </b-tooltip>
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
            >
              <b-field>
                <p class="control action-button">
                  <b-tooltip
                    label="Add new project"
                    position="is-left"
                    type="is-dark"
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
                    label="Plan with MaveQuest"
                    position="is-left"
                    type="is-dark"
                  >
                    <b-button
                      tag="a"
                      :href="'https://mavequest.varianteffect.org/query?gene=' + props.row.name"
                      target="_blank"
                      icon-right="mdil-lightbulb-on"
                      type="is-light"
                    />
                  </b-tooltip>
                  <!-- Show Google search for others -->
                  <b-tooltip
                    v-else
                    label="Look up"
                    position="is-left"
                    type="is-dark"
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
          </template>
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
    filter: {
      deep: true,
      async handler() {
        await this.fetchTargets()
      }
    },
    async currentUser() {
      await this.fetchTargets()
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
      // Filter
      filter: {
        type: "",
        organism: "",
        name: ""
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
      errorMessage: ""
    }
  },
  async mounted () {
    // If filter queries are supplied, process them
    if (this.$route.query) {
      if (this.$route.query.type) this.filter.type = this.$route.query.type
      if (this.$route.query.name) this.filter.name = this.$route.query.name
      if (this.$route.query.organism) this.filter.organism = this.$route.query.organism
    }
    await this.fetchTargets()
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
  .tags
    border-radius: 4px
    .tag
      margin: 0
      height: 2.5rem
      box-shadow: 0 0 0 0 rgba(10, 10, 10, 0.1) inset, 0 -1px 0 0 rgba(10, 10, 10, 0.1) inset
      &:first-child
        border-top-right-radius: 0
        border-bottom-right-radius: 0
      &:only-child
        border-top-right-radius: 4px
        border-bottom-right-radius: 4px
.card-header-icon
  .b-tooltip
    &:not(:last-child), &:only-child
      margin-right: 0.25rem
</style>