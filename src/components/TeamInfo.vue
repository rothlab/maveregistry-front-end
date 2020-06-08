<template>
  <div>
    <label class="label">
      Find or Add a Principal Investigator
    </label>
    <b-autocomplete
      v-model="existTeamDisplay"
      class="field-margin"
      placeholder="Search by Name"
      open-on-focus
      icon-pack="mdi"
      icon="magnify"
      field="display"
      clearable
      :data="teams"
      :loading="isLoading"
      @typing="fetchTeams"
      @select="updateVal"
      @focus="fetchTeams()"
    >
      <template slot="empty">
        <p class="has-text-centered">
          <b-icon icon="mdil-information" />
          No results found
        </p>
      </template>
      <template slot="footer">
        <a @click="isNewTeamModalActive = true">
          <b-icon icon="mdil-plus" />
          <span>Add new...</span>
        </a> 
      </template>
      <template slot-scope="props">
        <b-icon icon="mdil-account" />
        <!-- Add keyword bolding -->
        <!-- To prevent XSS attack, we don't want to allow html tags, although it's going to be make the job much easier. -->
        <b class="is-capitalized">{{ props.option.first_name.includes(keyword) ? keyword : '' }}</b>{{ trimKeyword(props.option.first_name, keyword) }}
        <b class="is-capitalized">{{ props.option.last_name.includes(keyword) ? keyword : '' }}</b>{{ trimKeyword(props.option.last_name, keyword) }},
        {{ props.option.affiliation }}
      </template>
    </b-autocomplete>

    <!-- New team modal -->
    <div class="container">
      <NewTeamModal
        :active.sync="isNewTeamModalActive"
        :is-collaborator="isCollaborator"
        @change="updateExistTeamById"
      />
    </div>
  </div>
</template>

<script>
import * as TeamManage from "@/api/teamManage.js"
import NewTeamModal from "@/components/NewTeamModal.vue"

// Helper
function capitalize(string) {
  return string.slice(0,1).toUpperCase() + string.slice(1)
}

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    isCollaborator: {
      type: Boolean,
      default: false
    }
  },
  components: {
    NewTeamModal
  },
  watch: {
    async value () {
      if (this.id !== this.value) {
        this.id = this.value
        await this.updateExistTeamById(this.id)
      }
    },
    async existTeamDisplay (newVal, oldVal) {
      if (newVal === "" && newVal !== oldVal) {
        this.id = ""
        this.$emit("input", this.id)
      }
    }
  },
  computed: {
    hasRequired() {
      return this.isRequired ? 'required' : ''
    }
  },
  async mounted() {
    // Fetch teams
    await this.fetchTeams()
  },
  data () {
    return {
      id: "",
      existTeamDisplay: "",
      teams: [],
      errorMessage: "",
      keyword: "",
      isNewTeamModalActive: false,
      isLoading: false
    }
  },
  methods: {
    updateVal(option) {
      this.id = option.id
      this.$emit("input", this.id)
    },
    formatTeam(team) {
      team.display = `${capitalize(team.first_name)} ${capitalize(team.last_name)}, ${team.affiliation}`

      return team
    },
    async updateExistTeamById(id) {
      // Update existing team
      const team = await this.queryTeamById(id)
      this.existTeamDisplay = this.formatTeam(team).display

      // update ID
      this.updateVal(team)
    },
    async queryTeamById(id) {
      if (id.length < 1) return

      this.isLoading = true

      try {
        const team = await TeamManage.queryById(id)

        return team
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },
    async fetchTeams(query = "") {
      this.isLoading = true

      // Set keyword for bolding
      this.keyword = query.toLowerCase()

      // Fetch some teams to populate the dropdown menu
      if (query.length <= 0) {
        try {
          const teams = await TeamManage.fetchTeams(10, 0)

          // Format and store
          this.teams = teams.results.map(this.formatTeam)
        } catch (error) {
          this.errorMessage = error.message
        } finally {
          this.isLoading = false
        }

        return 
      }

      // Otherwise, search team with matching names
      try {
        const teams = await TeamManage.queryByName(query)

        // Format and store
        this.teams = teams.results.map(this.formatTeam)
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },
    trimKeyword(string, keyword) {
      if (keyword.length <= 0 || !string.includes(keyword)) return capitalize(string)
      return string.replace(keyword, '')
    }
  }
}
</script>