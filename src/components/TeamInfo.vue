<template>
  <div>
    <label
      class="label"
      v-if="!isAddPi"
    >
      Find or Add a Principal Investigator
    </label>
    <b-autocomplete
      class="field-margin"
      placeholder="Search by Name"
      open-on-focus
      icon="mdil-magnify"
      v-if="!isAddPi"
      field="display"
      :data="teams"
      :loading="isLoading"
      @typing="fetchTeams"
      @select="option => selected = option"
    >
      <template slot="empty">
        <p class="has-text-centered">
          <b-icon icon="mdil-information" />
          No results found
        </p>
      </template>
      <template slot="footer">
        <a @click="isAddPi = true">
          <b-icon icon="mdil-plus" />
          <span>Add new...</span>
        </a> 
      </template>
      <template slot-scope="props">
        <b-icon icon="mdil-account" />
        <span class="is-capitalized">{{ props.option.first_name }} {{ props.option.last_name }}</span>,
        {{ props.option.affiliation }}
      </template>
    </b-autocomplete>
    <div v-else>
      <!-- First and Last name -->
      <b-field
        grouped
        class="field-margin is-space-between"
      >
        <ValidationProvider
          :rules="hasRequired"
          :immediate="!hasRequired"
          name="FirstName"
          v-slot="{ errors, valid }"
          class="name"
        >
          <b-field
            :message="errors"
            :type="{ 'is-danger': errors[0], '': valid }"
          >
            <b-input
              type="text"
              placeholder="First Name"
              v-model="first_name"
              @input="updateVal"
            />
          </b-field>
        </ValidationProvider>
        <ValidationProvider
          :rules="hasRequired"
          :immediate="!hasRequired"
          name="LastName"
          v-slot="{ errors, valid }"
          class="name"
        >
          <b-field
            :message="errors"
            :type="{ 'is-danger': errors[0], '': valid }"
          >
            <b-input
              type="text"
              placeholder="Last Name"
              v-model="last_name"
              @input="updateVal"
            />
          </b-field>
        </ValidationProvider>
      </b-field>
      <!-- Email -->
      <ValidationProvider
        :rules="hasRequired + '|email'"
        :immediate="!hasRequired"
        name="Email"
        v-slot="{ errors, valid }"
      > 
        <b-field
          :message="errors"
          class="field-margin"
          :type="{ 'is-danger': errors[0], '': valid }"
        >
          <b-input
            icon="mdil-email"
            type="email"
            placeholder="Email"
            v-model="email"
            @input="updateVal"
          />
        </b-field>
      </ValidationProvider>
      <!-- Affiliation -->
      <ValidationProvider
        :rules="hasRequired"
        :immediate="!hasRequired"
        name="Affiliation"
        v-slot="{ errors, valid }"
      > 
        <b-field
          :message="errors"
          class="field-margin"
          :type="{ 'is-danger': errors[0], '': valid }"
        >
          <b-input
            icon="mdil-factory"
            v-model="affiliation"
            type="affiliation"
            placeholder="Affiliation"
            @input="updateVal"
            expanded
          />
        </b-field>
      </ValidationProvider>
      <div class="has-text-right field-margin">
        <b-button
          icon-left="mdil-cancel"
          type="is-danger"
          outlined
          @click="cleanUp"
        >
          Clear
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import * as TeamManage from "@/api/teamManage"

// Helper
function capitalize(string) {
  return string.slice(0,1).toUpperCase() + string.slice(1)
}

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    isRequired: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value: {
      handler (val) {
        this.isAddPi = !(val.id === "" && val.first_name === "" && val.last_name === "" && val.email === "" && val.affiliation === "")
        this.id = val.id
        this.first_name = val.first_name
        this.last_name = val.last_name
        this.email = val.email
        this.affiliation = val.affiliation
      },
      deep: true
    }
  },
  computed: {
    hasRequired() {
      return this.isRequired ? 'required' : ''
    }
  },
  components: {
    ValidationProvider
  },
  async mounted() {
    this.isAddPi = !(this.id === "" && this.first_name === "" && this.last_name === "" && this.email === "" && this.affiliation === "")

    // Fetch teams
    await this.fetchTeams()
  },
  data () {
    return {
      id: "",
      first_name: "",
      last_name: "",
      email: "",
      affiliation: "",
      isAddPi: true,
      teams: [],
      errorMessage: ""
    }
  },
  methods: {
    updateVal() {
      let ret = {
        id: this.id,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        affiliation: this.affiliation,
        isLoading: false
      }

      this.$emit("input", ret)
    },
    cleanUp() {
        this.id = ""
        this.first_name = ""
        this.last_name = ""
        this.email = ""
        this.affiliation = ""
        this.isAddPi = false
    },
    formatTeam(team) {
      team.display = `${capitalize(team.first_name)} ${capitalize(team.last_name)}, ${team.affiliation}`

      return team
    },
    async fetchTeams(query = "") {
      this.isLoading = true

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
    }
  }
}
</script>

<style lang="sass" scoped>
</style>