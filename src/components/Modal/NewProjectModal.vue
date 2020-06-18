<template>
  <b-modal
    :active.sync="isActive"
    has-modal-card
    :can-cancel="['escape', 'outside']"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span>Add a New Project</span>
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="isActive = false"
        />
      </header>
      <ValidationObserver
        ref="observer"
        v-slot="{ passed }"
      >
        <section class="modal-card-body">
          <div class="content">
            <!-- Target name -->
            <ValidationProvider
              rules="required"
              name="Name"
              v-slot="{ errors, valid }"
              :immediate="name !== ''"
            > 
              <b-field
                :message="errors"
                class="field-margin"
                :type="{ 'is-danger': errors[0], '': valid }"
                label="Target name"
              >
                <b-input
                  v-model="name"
                  placeholder="e.g. Gene Symbol, Domain Name"
                  required
                  expanded
                />
              </b-field>
            </ValidationProvider>

            <ValidationProvider
              rules="required"
              name="Type"
              v-slot="{ errors, valid }"
              :immediate="type !== ''"
            > 
              <!-- Target type -->
              <b-field
                :message="errors"
                class="field-margin"
                :type="{ 'is-danger': errors[0], '': valid }"
                label="Type of target"
              >
                <b-select
                  v-model="type"
                  placeholder="Select a target type"
                  required
                  expanded
                >
                  <option
                    v-for="(option, index) in selection.types"
                    :key="index"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </b-select>
              </b-field>
            </ValidationProvider>

            <!-- Target organism -->
            <ValidationProvider
              rules="required"
              name="Organism"
              v-slot="{ errors, valid }"
              :immediate="organism !== ''"
            > 
              <b-field
                :message="errors"
                class="field-margin"
                :type="{ 'is-danger': errors[0], '': valid }"
                label="Target organism"
              >
                <b-select
                  v-model="organism"
                  placeholder="Select a target organism"
                  required
                  expanded
                >
                  <option
                    v-for="(option, index) in selection.organisms"
                    :key="index"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </b-select>
              </b-field>
            </ValidationProvider>
                
            <ValidationProvider
              name="Features"
              v-slot="{ errors, valid }"
              immediate
            > 
              <!-- Target features -->
              <b-field
                :message="errors"
                class="field-margin"
                :type="{ 'is-danger': errors[0], '': valid }"
                label="Target features"
              >
                <b-taginput
                  v-model="features"
                  :data="selection.features"
                  autocomplete
                  append-to-body
                  open-on-focus
                  icon="mdil-magnify"
                  placeholder="Search for a genomic feature"
                  @typing="getFilteredFeatures"
                  @input="resetFeatures"
                />
              </b-field>
            </ValidationProvider>
          </div>
        </section>
        <footer class="modal-card-foot">
          <b-button
            expanded
            :loading="isLoading"
            :disabled="!passed"
            type="is-primary"
            @click="addProject"
          >
            Add Project
          </b-button>
        </footer>
      </ValidationObserver>
    </div>
  </b-modal>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import * as ProjectManage from "@/api/projectManage.js"
import { handleError } from "@/api/errorHandler.js"

const variables = require("@/assets/script/variables.json")

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    active: {
      type: Boolean,
      required: true
    },
    project: {
      type: Object,
      default: undefined
    }
  },
  watch: {
    isActive(val) {
      if (val !== this.active) {
        this.$emit("update:active", val)
      }

      if (val) this.cleanup()
    },
    active(val) {
      if (val != this.isActive) {
        this.isActive = val
      }
    },
    project(val) {
      if (val) {
        this.type = val.type
        if (val.name) this.name = val.name.toUpperCase()
        this.organism = val.organism
      }
    }
  },
  data() {
    return {
      isActive: false,
      isLoading: false,
      type: "",
      name: "",
      organism: "",
      features: [],
      selection: {
        features: variables.genomic_features,
        types: variables.target_types,
        organisms: variables.target_organisms
      }
    }
  },
  methods: {
    cleanup() {
      this.type = ""
      this.name = ""
      this.organism = ""
      this.features = []
    },
    async addProject() {
      // Loading
      this.isLoading = true

      try {
        const projectId = await ProjectManage.addProject({
          type: this.type,
          name: this.name,
          organism: this.organism,
          features: this.features
        })

        // Jump to new project registration page
        this.$router.push({ name: 'Project Edit', params: { id: projectId, action: 'new' } })
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        // Handle UI changes
        this.isLoading = false
        this.isActive = false
      }
    },
    getFilteredFeatures(text) {
      this.selection.features = variables.genomic_features.filter(e => {
        return !this.features.includes(e) && e.toLowerCase().indexOf(text.toLowerCase()) >= 0
      })
    },
    resetFeatures() {
      this.selection.features = variables.genomic_features.filter(e => !this.features.includes(e))
    }
  }
}
</script>