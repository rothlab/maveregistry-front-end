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
                  MAVE Projects
                </p>
              </div>
            </div>
            <div class="level-right">
              <!-- Register new project -->
              <!-- Non-mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-mobile"
                @click="isNewProjectModalActive = true"
              >
                New Project
              </b-button>
              <!-- Mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-tablet"
                @click="isNewProjectModalActive = true"
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
        <!-- TODO: implement backend pagination -->
        <b-table
          :data="targets"
          :loading="isLoading.fetch_targets"
          hoverable
          paginated
          backend-pagination
          icon-pack="mdi"
          :per-page="pagination.limit"
        >
          <template slot-scope="props">
            <!-- Target ID -->
            <b-table-column
              field="target_id"
              label="Target ID"
            >
              <router-link
                :to="{ path: `/target/${props.row.id}`}"
                target="_blank"
              >
                {{ props.row.id }}
              </router-link>
            </b-table-column>

            <!-- Target name-->
            <b-table-column
              field="target_name"
              label="Name"
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
              width="25vw"
            >
              <div class="has-text-left">
                <b-collapse
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
                      class="card-header-title is-capitalized"
                    >
                      <b-icon :icon="progressIcons[project.type]" />
                      {{ project.type }}
                    </p>
                    <p
                      v-else
                      class="card-header-title is-capitalized"
                    >
                      <b-icon icon="mdil-circle" />
                      No Progress Description
                    </p>
                    <a class="card-header-icon">
                      <b-tooltip
                        label="Seek Funding"
                        v-if="project.open_for_funding"
                        type="is-warning"
                        position="is-left"
                      >
                        <b-icon
                          class="circle-icon has-background-warning"
                          icon="mdil-currency-usd"
                        />
                      </b-tooltip>
                      <b-icon
                        :icon="innerProps.open ? 'mdil-chevron-up' : 'mdil-chevron-down'"
                      />
                    </a>
                  </div>
                  <div class="card-content">
                    <div class="content">
                      <div class="level is-mobile is-paddingless">
                        <div class="level-left">
                          <p>
                            <span class="has-text-primary">Project ID:</span>
                            <router-link
                              :to="{ path: `/project/${project.id}`}"
                              target="_blank"
                            >
                              {{ project.id }}
                            </router-link>
                            <br>
                            <span class="has-text-primary">
                              Feature{{ project.features.length > 1 ? 's:' : ':' }}
                            </span>
                            {{ project.features.join(",") }}
                            <br>
                            <span
                              v-if="project.description"
                              class="has-text-primary"
                            >Progress description:</span>
                            {{ project.description }}
                          </p>
                        </div>
                        <div class="level-right">
                          <!-- If not followed, show follow icon -->
                          <b-tooltip
                            label="Follow Project"
                            type="is-dark"
                            v-if="!project.follow_status.id"
                          >
                            <a @click="confirmFollow(project.id, 'project')"><b-icon icon="mdil-bell" /></a>
                          </b-tooltip>
                          <!-- If pending, show pending status and unfollow-->
                          <b-tooltip
                            :label="project.follow_status.status === 'pending' ? 'Pending Approval. Click to retract request.' : 'Unfollow Project'"
                            type="is-dark"
                            v-else
                          >
                            <a @click="confirmUnfollow(project.follow_status.id, 'project')">
                              <b-icon
                                icon="mdil-bell-off"
                                class="circle-icon"
                                :class="{ 'has-background-warning': project.follow_status.status === 'pending', 'has-background-primary': project.follow_status.status === 'yes' }"
                                :type="project.follow_status.status === 'yes' ? 'is-white' : 'is-dark'"
                              />
                            </a>
                          </b-tooltip>
                        </div>
                      </div>
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
              <b-field
                grouped
                group-multiline
                class="team-control"
              >
                <div
                  class="control"
                  v-for="(team, index) in props.row.teams"
                  :key="index"
                >
                  <b-taglist attached>
                    <router-link
                      :to="{ path: `/team/${team.id}`}"
                      target="_blank"
                    >
                      <b-tag
                        size="is-medium"
                        class="is-capitalized"
                      >
                        <b-icon
                          icon="mdil-account"
                          class="team-icon"
                        />
                        {{ team.name }}
                      </b-tag>
                    </router-link>
                    <!-- Followed status -->
                    <b-tag
                      v-if="team.follow_status.id"
                      size="is-medium"
                      class="is-clickable"
                      :class="{ 'has-background-warning': team.follow_status.status === 'pending', 'has-background-primary': team.follow_status.status === 'yes' }"
                      @click.native="confirmUnfollow(team.follow_status.id, 'team')"
                    >
                      <b-tooltip
                        :label="team.follow_status.status === 'pending' ? 'Pending Approval. Click to retract request.' : 'Unfollow Team'"
                        type="is-dark"
                      >
                        <b-icon
                          :type="team.follow_status.status === 'yes' ? 'is-white' : ''"
                          custom-size="mdi-16px"
                          icon="mdil-bell-off"
                        />
                      </b-tooltip>
                    </b-tag>
                    <!-- Unfollowed status -->
                    <b-tag
                      v-else
                      size="is-medium"
                      class="is-clickable has-background-grey-lighter"
                      @click.native="confirmFollow(team.id, 'team')"
                    >
                      <b-icon
                        icon="mdil-bell"
                      />
                    </b-tag>
                  </b-taglist>
                </div>
              </b-field>
            </b-table-column>

            <!-- Action -->
            <b-table-column
              field="action"
              label="Action"
            >
              <div class="action-button is-flex">
                <b-tooltip
                  label="Add new project"
                  position="is-left"
                  type="is-dark"
                >
                  <b-button
                    icon-right="mdil-plus"
                    @click="prefillProject(props.row); isNewProjectModalActive = true"
                  />
                </b-tooltip>
                <!-- Show MaveQuest for human genes -->
                <b-tooltip
                  v-if="props.row.type == 'gene' && props.row.organism == 'H. sapiens'"
                  label="Plan with MaveQuest"
                  position="is-left"
                  type="is-dark"
                >
                  <b-button
                    tag="a"
                    :href="'https://mavequest.varianteffect.org/query?gene=' + props.row.name"
                    target="_blank"
                    icon-right="mdil-lightbulb-on"
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
                  />
                </b-tooltip>
              </div>
            </b-table-column>
          </template>
        </b-table>
      </div>

      <!-- Follow up modal -->
      <FollowModal
        :active.sync="isFollowModelActive"
        :source="followProp.source"
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
      <NewProjectModal
        :active.sync="isNewProjectModalActive"
        :project="preFilledProject"
        @update="prefillProject(undefined)"
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
import NewProjectModal from '@/components/Modal/NewProjectModal.vue'

const variables = require("@/assets/script/variables.json")

export default {
  components: {
    Error,
    FollowModal,
    UnfollowModal,
    NewProjectModal
  },
  computed: {
    hasLoggedIn() {
      return this.$store.state.hasLoggedIn
    }
  },
  data () {
    return {
      targets: [],
      pagination: {
        count: 0,
        limit: 10,
        skip: 0
      },
      progressIcons: variables.progress_type_icons,
      // Follow/unfollow target related parameters
      isFollowModelActive: false,
      followProp: {
        source: "",
        follow: "",
        type: ""
      },
      preFilledProject: undefined,
      isUnfollowModelActive: false,
      // Register new activity related parameters
      isNewProjectModalActive: false,
      isLoading: {
        new_project: false,
        follow_unfollow: false,
        fetch_targets: false
      },
      errorMessage: ""
    }
  },
  async mounted () {
    await this.fetchTargets()
  },
  methods: {
    confirmFollow(id, type) {
      this.followProp.source = id
      this.followProp.type = type
      this.isFollowModelActive = true
    },
    confirmUnfollow(id, type) {
      this.followProp.follow = id
      this.followProp.type = type
      this.isUnfollowModelActive = true
    },
    prefillProject(target) {
      if (!target) {
        this.preFilledProject = undefined
        return
      }

      this.preFilledProject = {
        type: target.type,
        name: target.name,
        organism: target.organism
      }
    },
    async fetchTargets(limit = 10, skip = 0) {
      // Loading
      this.isLoading.fetch_targets = true

      // Update targets
      try {
        const targets = await ProjectManage.fetchTargets(limit, skip)
        this.targets = targets.results

        // Update pagination
        this.pagination.count = targets.count
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.fetch_targets = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/style/variables.sass"

.action-button
  justify-content: space-between
  button, a
    height: 2rem
    padding-left: 0.625rem
    padding-right: 0.625rem
    padding-top: calc( 0.3125rem - 1px )
    padding-bottom: calc( 0.3125rem - 1px )
@media screen and (max-width: $break-mobile)
  .team-control
    justify-content: flex-end
    .control:first-child
      margin-right: 0 !important
    .control:not(:first-child)
      margin-left: 0.75rem
.team-icon
  margin-left: -0.375rem !important
  margin-right: -0.2rem !important
.team-control .tag
  box-shadow: 0 0 0 0 rgba(10, 10, 10, 0.1) inset, 0 -1px 0 0 rgba(10, 10, 10, 0.1) inset
  &:first-child
    border-top-right-radius: 0
    border-bottom-right-radius: 0
</style>