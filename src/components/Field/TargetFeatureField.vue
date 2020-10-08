<template>
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
      :label="label"
    >
      <b-taginput
        v-model="selectedFeatures"
        :data="featureSelection"
        autocomplete
        append-to-body
        open-on-focus
        icon="mdil-magnify"
        placeholder="Search for a genomic feature"
        @typing="getFilteredFeatures"
        @input="updateVal"
      />
    </b-field>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

const variables = require("@/assets/script/variables.json")

export default {
  components: {
    ValidationProvider
  },
  props: {
    label: {
      type: String,
      default: "Target features"
    },
    value: {
      type: Array,
      required: true
    }
  },
  watch: {
    value(val) {
      if (val && val.length > 0) this.selectedFeatures = val
    }
  },
  mounted() {
    if (this.value && this.value.length > 0) this.selectedFeatures = this.value
  },
  data() {
    return {
      featureSelection: variables.genomic_features,
      selectedFeatures: []
    }
  },
  methods: {
    getFilteredFeatures(text) {
      this.featureSelection = variables.genomic_features.filter(e => {
        return !this.selectedFeatures.includes(e) && e.toLowerCase().indexOf(text.toLowerCase()) >= 0
      })
    },
    updateVal() {
      this.$emit("input", this.selectedFeatures)
      // Reset filter
      this.featureSelection = variables.genomic_features.filter(e => !this.selectedFeatures.includes(e))
    }
  }
}
</script>