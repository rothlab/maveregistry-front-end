<template>
  <b-modal
    :active.sync="isActive"
    has-modal-card
    :can-cancel="['escape', 'outside']"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span>{{ title }}</span>
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
            <!-- Notification -->
            <b-message
              v-if="notificationMessage"
              size="is-small"
              type="is-warning"
            >
              <span class="is-size-6">{{ notificationMessage }}</span>
            </b-message>

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
                  :disabled="isModifyNomination"
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
                  :disabled="isModifyNomination"
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
                  :disabled="isModifyNomination"
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
              v-if="hasFeature"
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

            <ValidationProvider
              rules="required"
              name="Reason"
              v-slot="{ errors, valid }"
              v-if="hasReason"
              :immediate="reason !== ''"
            > 
              <!-- Reason for adding this target -->
              <b-field
                :message="errors"
                class="field-margin"
                :type="{ 'is-danger': errors[0], '': valid }"
                label="Reason"
              >
                <b-input
                  v-model="reason"
                  maxlength="300"
                  type="textarea"
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
            @click="callSubmit"
          >
            {{ submitText }}
          </b-button>
        </footer>
      </ValidationObserver>
    </div>
  </b-modal>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { displayErrorToast } from "@/api/errorHandler.js"

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
    hasFeature: {
      type: Boolean,
      default: false
    },
    hasReason: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    submit: {
      type: Function,
      required: true
    },
    submitText: {
      type: String,
      required: true
    },
    target: {
      type: Object,
      default: undefined
    }
  },
  watch: {
    isActive(val) {
      if (val !== this.active) {
        this.$emit("update:active", val)
      }

      if (val && !this.target) {
        this.cleanup()
      }
    },
    active(val) {
      if (val != this.isActive) {
        this.isActive = val
      }
    },
    target: {
      deep: true,
      handler (val) {
        if (val) {
          this.type = val.type
          if (val.name) this.name = val.name.toUpperCase()
          this.organism = val.organism
          if (val.reason) this.reason = val.reason
          if (val.id) this.id = val.id
        }
      }
    }
  },
  computed: {
    isModifyNomination() {
      return this.hasReason && this.target
    },
    notificationMessage() {
      if (this.isModifyNomination) return "You may not change target. Please create another nomination instead."

      return ""
    }
  },
  data() {
    return {
      isActive: false,
      isLoading: false,
      id: "",
      type: "",
      name: "",
      organism: "",
      reason: "",
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
      this.reason = ""
      this.features = []
    },
    async callSubmit() {
      // Loading
      this.isLoading = true

      try {
        let attrs = {
          type: this.type,
          name: this.name,
          organism: this.organism
        }
        if (this.hasFeature) attrs.features = this.features
        if (this.hasReason) attrs.reason = this.reason
        if (this.isModifyNomination && this.id) attrs.id = this.id // Pass nomination when modifying it

        // Call submit function passed in as a prop
        await this.submit(attrs)
        
        // Emit update
        this.$emit("change")
        this.isActive = false
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        // Handle UI changes
        this.isLoading = false
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