<template>
  <div>
    <!-- Header -->
    <div class="hero is-small is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <div class="content">
                <p class="is-size-4 has-text-weight-medium">
                  MAVE Projects
                </p>
              </div>
            </div>
            <div class="column">
              <b-field>
                <b-autocomplete
                  icon="mdil-magnify"
                  expanded
                  placeholder="Target Name"
                >
                  <template slot="empty">
                    No results found
                  </template>
                </b-autocomplete>
              </b-field>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container has-fullheight has-top-padding">
      <!-- New project register -->
      <b-button
        expanded
        icon-left="mdil-plus"
        type="is-primary"
        size="is-medium"
        class="register-activity"
        outlined
      >
        Register Activity for a New Target
      </b-button>
      
      <!-- Project table -->
      <div>
        <b-table
          :data="projects"
          hoverable
          paginated
          :per-page="20"
        >
          <template slot-scope="props">
            <!-- Project ID -->
            <b-table-column
              field="id"
              label="ID"
              class="is-capitalized"
            >
              <a :href="'/project/' + props.row.id">
                {{ props.row.id }}
              </a>
            </b-table-column>

            <!-- Target name-->
            <b-table-column
              field="target_name"
              label="Target"
            >
              <a :href="'/target/' + props.row.target.id">
                {{ props.row.target.name }}
              </a>
            </b-table-column>

            <!-- Target type -->
            <b-table-column
              field="target_type"
              label="Type"
              class="is-capitalized"
            >
              {{ props.row.target.type }}
            </b-table-column>

            <!-- Target species -->
            <b-table-column
              field="target_organism"
              label="Organism"
            >
              {{ props.row.target.organism }}
            </b-table-column>

            <!-- Progress -->
            <b-table-column
              field="progress"
              label="Progress"
              width="25vw"
            >
              <b-collapse
                class="card progress-card has-background-light"
                animation="slide"
                v-for="(progress, index) in props.row.progress"
                :key="index"
                :open="false"
              >
                <div
                  slot="trigger"
                  slot-scope="innerProps"
                  class="card-header"
                  role="button"
                >
                  <p class="card-header-title is-capitalized">
                    <b-icon :icon="selectProgressIcon(progress.type)" />
                    {{ progress.description }}
                  </p>
                  <a class="card-header-icon">
                    <b-icon
                      :icon="innerProps.open ? 'mdil-chevron-up' : 'mdil-chevron-down'"
                    />
                  </a>
                </div>
                <div class="card-content has-background-white">
                  <div class="content">
                    <!-- Show links when available -->
                    <div
                      v-if="progress.links"
                    >
                      <span
                        v-for="(link, i) in progress.links"
                        :key="i"
                      >
                        <a
                          :href="link.url"
                          target="_blank"
                          rel="noopener noreferrer"
                        >{{ link.text }}</a>
                        <span v-if="i < progress.links.length - 1">, </span>
                      </span>
                    </div>

                    <!-- Show assay detail when available -->
                    <div
                      v-if="progress.phenotype"
                      class="is-capitalized"
                    >
                      <div class="level is-paddingless">
                        <div class="level-left">
                          <p>
                            Phenotype: {{ progress.phenotype }} <br>
                            Submitter: {{ progress.team }}
                          </p>
                        </div>
                        <div class="level-right">
                          <a
                            :href="'/progress/' + progress.id"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <b-icon icon="mdil-link-variant" />
                            <span>Detail</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </b-collapse>
            </b-table-column>

            <!-- Active teams -->
            <b-table-column
              field="teams"
              label="Teams"
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
                    <b-tag size="is-medium">
                      <b-icon
                        icon="mdil-account"
                        class="team-icon"
                      />
                      {{ team.name }}
                      <b-icon
                        v-if="team.open_for_funding"
                        class="circle-icon has-background-warning"
                        icon="mdil-currency-usd"
                      />
                    </b-tag>
                    <!-- Followed status -->
                    <b-tag
                      v-if="team.has_followed"
                      size="is-medium"
                      class="is-clickable has-background-primary"
                      @click.native="confirmUnfollowTeam(team, props.row.target, props.index)"
                    >
                      <b-icon
                        type="is-white"
                        custom-size="mdi-16px"
                        pack="mdi"
                        icon="bell"
                      />
                    </b-tag>
                    <!-- Unfollowed status -->
                    <b-tag
                      v-else
                      size="is-medium"
                      class="is-clickable has-background-grey-lighter"
                      @click.native="confirmFollowTeam(team, props.row.target, props.index)"
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
                  label="Add new activity"
                  position="is-left"
                  type="is-dark"
                >
                  <b-button icon-right="mdil-plus" />
                </b-tooltip>
                <!-- Show MaveQuest for human genes -->
                <b-tooltip
                  v-if="props.row.target.type == 'gene' && props.row.target.organism == 'H. sapiens'"
                  label="Plan with MaveQuest"
                  position="is-left"
                  type="is-dark"
                >
                  <b-button
                    tag="a"
                    :href="'https://mavequest.varianteffect.org/query?gene=' + props.row.target.name"
                    target="_blank"
                    icon-right="mdil-magnify"
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
                    :href="'https://www.google.com/search?q=' + props.row.target.name"
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
      <b-modal
        :active.sync="isFollowModelActive"
        has-modal-card
        :can-cancel="['escape', 'outside']"
        @close="cleanupFollow()"
      >
        <div
          class="modal-card"
          v-if="followProp"
        >
          <header class="modal-card-head">
            <p class="modal-card-title">
              <span>Follow {{ followProp.team.name }}</span>
            </p>
            <button
              class="delete"
              aria-label="close"
              @click="isFollowModelActive = false"
            />
          </header>
          <section class="modal-card-body">
            <div class="content">
              <p>
                <strong>Target: </strong>
                <span>{{ followProp.target.name }}</span>
              </p>
              <b-field :label="'Please briefly summarize your interest in following this target and team.'">
                <b-input
                  v-model="followRequest"
                  maxlength="300"
                  type="textarea"
                  placeholder="Maximum 300 characters."
                  required
                />
              </b-field>
            </div>
          </section>
          <footer class="modal-card-foot">
            <b-button
              expanded
              :disabled="followRequest.length <= 0"
              :loading="isActionButtonLoading"
              type="is-primary"
              outlined
              @click="followTeam(followProp.team, followProp.target, followProp.project_index, followRequest)"
            >
              Submit Request
            </b-button>
          </footer>
        </div>
      </b-modal>

      <!-- Unfollow modal -->
      <b-modal
        :active.sync="isUnfollowModelActive"
        has-modal-card
        :can-cancel="['escape', 'outside']"
        @close="cleanupUnfollow()"
      >
        <div
          class="modal-card"
          v-if="followProp"
        >
          <header class="modal-card-head">
            <p class="modal-card-title">
              <span>Unfollow target?</span>
            </p>
            <button
              class="delete"
              aria-label="close"
              @click="isUnfollowModelActive = false"
            />
          </header>
          <section class="modal-card-body">
            <div class="container">
              <div class="media">
                <div class="media-left">
                  <b-icon
                    pack="mdi"
                    icon="alert-circle"
                    size="is-large"
                    type="is-warning"
                  />
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      Are you sure you want to unfollow {{ followProp.team.name }} on {{ followProp.target.name }}? <br>
                      Once unfollowed, you will need their permission to follow again.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot has-hright">
            <div class="buttons">
              <b-button
                @click="isUnfollowModelActive = false"
              >
                Cancel
              </b-button>
              <b-button
                :loading="isActionButtonLoading"
                type="is-primary"
                outlined
                @click="unfollowTeam(followProp.team, followProp.target, followProp.project_index)"
              >
                Unfollow
              </b-button>
            </div>
          </footer>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
//TODO: remove debug functions
const delay = ms => new Promise(res => setTimeout(res, ms));

export default {
  data () {
    return {
      user: {
        id: "user_1",
        name: "Kevin Kuang",
        auth_token: "arandomtoken",
      },
      projects: 
      [
        {
          id: "project_1",
          target: {
            id: "target_1",
            name: "BRCA1",
            type: "gene",
            organism: "H. sapiens",
          },
          progress: [{
            id: "progress_1",
            type: "publication",
            description: "publications available",
            links: [
              {
                url: "https://www.ncbi.nlm.nih.gov/pubmed/30219179",
                text: "PMID: 30219179"
              },
              {
                url: "https://www.ncbi.nlm.nih.gov/pubmed/25823446",
                text: "PMID: 25823446"
              },
              {
                url: "https://www.mavedb.org/search/?search=brca1",
                text: "MaveDB"
              },
            ],
          }],
          teams: [
            {
              id: "team_1",
              name: "Roth FP",
              has_followed: false,
            },
            {
              id: "team_2",
              name: "Smith J",
              open_for_funding: true,
              has_followed: true,
            },
          ]
        },
{
          id: "project_2",
          target: {
            id: "target_2",
            name: "CHEK2",
            type: "gene",
            organism: "H. sapiens",
          },
          progress: [
            {
              id: "progress_3",
              type: "assay",
              description: "yeast complementation",
              phenotype: "growth defect",
              team: "Roth FP",
            },
            {
              id: "progress_4",
              type: "assay",
              description: "yeast two-hybrid",
              phenotype: "growth defect",
              team: "Smith J",
            }
          ],
          teams: [
            {
              id: "team_1",
              name: "Roth FP",
              has_followed: true,
            },
            {
              id: "team_2",
              name: "Smith J",
              open_for_funding: true,
              has_followed: true,
            },
          ]
        },
      ],
      isFollowModelActive: false,
      followProp: null,
      followRequest: "",
      isUnfollowModelActive: false,
      isActionButtonLoading: false,
    }
  },
  methods: {
    selectProgressIcon(type) {
      const icons = {
        publication: "mdil-file-multiple",
        assay: "mdil-flask"
      }

      return icons[type]
    },
    confirmFollowTeam(team, target, index) {
      this.isFollowModelActive = true
      this.followProp = {
        team: team,
        target: target,
        project_index: index
      }
    },
    async followTeam(team, target, index, request) {
      // Loading
      this.isActionButtonLoading = true

      //TODO: remove debug delay
      await delay(2000);

      //TODO: remove debug response
      const response = {
        status: "success",
        teams: [
          {
            id: "team_1",
            name: "Roth FP",
            has_followed: true,
          },
          {
            id: "team_2",
            name: "Smith J",
            open_for_funding: true,
            has_followed: true,
          },
        ]
      }

      //TODO: implement API to accept follow request

      // Handle UI changes
      this.isActionButtonLoading = false
      this.isFollowModelActive = false
      this.cleanupFollow()

      // Update team
      this.projects[index].teams = response.teams

      // Show status update
      this.$buefy.toast.open({
        message: `Followed ${team.name} on ${target.name}`,
        type: "is-success",
        duration: 5000
      })

      request
    },
    confirmUnfollowTeam(team, target, index) {
      this.isUnfollowModelActive = true
      this.followProp = {
        team: team,
        target: target, 
        project_index: index
      }
    },
    async unfollowTeam(team, target, index) {
      // Loading
      this.isActionButtonLoading = true

      //TODO: remove debug delay
      await delay(2000);

      // TODO: Implement API to accept unfollow request

      //TODO: remove debug response
      const response = {
        status: "success",
        teams: [
          {
            id: "team_1",
            name: "Roth FP",
            has_followed: false,
          },
          {
            id: "team_2",
            name: "Smith J",
            open_for_funding: true,
            has_followed: false,
          },
        ]
      }

      // Handle UI changes
      this.isActionButtonLoading = false
      this.isUnfollowModelActive = false
      this.cleanupFollow()

      // Update team
      this.projects[index].teams = response.teams

      // Show status update
      this.$buefy.toast.open({
        message: `Unfollowed ${team.name} on ${target.name}`,
        type: "is-success"
      })
    },
    cleanupFollow() {
      this.followProp = null
      this.followRequest = ""
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/variables.sass"

.register-activity
  margin: 1rem 0rem
.progress-card
  box-shadow: none
  &:first-child
    border-radius: 0.4rem 0.4rem 0 0
  &:last-child
    border-radius: 0rem 0rem 0.4rem 0.4rem
  &:only-child
    border-radius: 0.4rem
  .card-header
    box-shadow: none
  .card-header-title, .card-header-icon
    font-weight: normal
    padding: 0.25rem 0.5rem
  .card-content
    padding: 0.25rem 2rem 0.25rem 2rem
    &:last-child
    border-radius: 0rem 0rem 0.4rem 0.4rem
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
</style>