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

    <!-- Project table -->
    <div class="container has-fullheight">
      <div class="project-table">
        <b-table :data="projects">
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
                :open="props.row.isOpen == index"
                @open="props.row.isOpen = index"
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
                <div class="card-content">
                  <div class="content">
                    <!-- Show links when available -->
                    <div
                      v-if="progress.links"
                      class="progress-link"
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
                    <b-tag
                      size="is-medium"
                      type="is-primary"
                    >
                      <b-icon icon="mdil-bell" />
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
                <b-tooltip
                  label="Plan MAVE study"
                  position="is-left"
                  type="is-dark"
                >
                  <b-button icon-right="mdil-magnify" />
                </b-tooltip>
              </div>
            </b-table-column>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
            ]
          }],
          teams: [
            {
              id: "team_1",
              name: "Roth FP",
            },
            {
              id: "team_2",
              name: "Smith J",
              open_for_funding: true
            }
          ]
        }
      ]
    }
  },
  methods: {
    selectProgressIcon(type) {
      const icons = {
        publication: "mdil-file-multiple"
      }

      return icons[type]
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
  border-radius: 0.4rem
  .card-header
    box-shadow: none
  .card-header-title, .card-header-icon
    font-weight: normal
    padding: 0.25rem 0.5rem
  .card-content
    padding: 0rem 2rem 0.25rem 2rem
.action-button
  justify-content: space-between
  button
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