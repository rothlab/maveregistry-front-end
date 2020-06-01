<template>
  <div>
    <!-- Type -->
    <ValidationProvider
      rules="required"
      name="Type"
      v-slot="{ errors, valid }"
    > 
      <b-field
        label="Type of Activity"
        :message="errors"
        class="field-margin"
        :type="{ 'is-danger': errors[0], '': valid }"
      >
        <b-select
          placeholder="Type"
          icon="mdil-layers"
          v-model="type"
          @input="updateVal"
          expanded
        >
          <option
            v-for="t in types"
            :value="t"
            :key="t"
          >
            {{ t }}
          </option>
        </b-select>
      </b-field>
    </ValidationProvider>

    <!-- Start and end date -->
    <b-field
      grouped
      class="field-margin is-space-between"
    >
      <ValidationProvider
        rules="required"
        name="Start Date"
        v-slot="{ errors, valid }"
        class="name"
      > 
        <b-field
          label="Start Date"
          :message="errors"
          :type="{ 'is-danger': errors[0], '': valid }"
        >
          <b-datepicker
            v-model="startDate"
            :first-day-of-week="1"
            icon="mdil-calendar"
            icon-prev="mdil-chevron-left"
            icon-next="mdil-chevron-right"
            @input="updateVal"
          />
        </b-field>
      </ValidationProvider>

      <ValidationProvider
        rules="required"
        name="End Date"
        v-slot="{ errors, valid }"
        class="name"
      > 
        <b-field
          label="End Date"
          :message="errors"
          :type="{ 'is-danger': errors[0], '': valid }"
        >
          <b-datepicker
            v-if="!isOngoing"
            v-model="endDate"
            :first-day-of-week="1"
            placeholder="End Date"
            icon="mdil-calendar"
            icon-prev="mdil-chevron-left"
            icon-next="mdil-chevron-right"
            @input="updateVal"
          >
            <b-button
              icon-left="mdil-cancel"
              expanded
              @click="isOngoing = true; updateVal()"
            >
              Disable End Date
            </b-button>
          </b-datepicker>

          <div v-else>
            <b-button
              @click="isOngoing = false; updateVal()"
              icon-left="mdil-calendar"
              expanded
            >
              Enable End Date
            </b-button>
          </div>
        </b-field>
      </ValidationProvider>
    </b-field>

    <!-- Description -->
    <ValidationProvider
      rules="required"
      name="Description"
      v-slot="{ errors, valid }"
    > 
      <b-field
        label="Description"
        :message="errors"
        :type="{ 'is-danger': errors[0], '': valid }"
      >
        <b-input
          v-model="description"
          maxlength="3000"
          type="textarea"
          placeholder="Max. 3000 characters"
          @input="updateVal"
        />
      </b-field>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationProvider
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  watch: {
    value: {
      handler (val) {
        this.type = val.type
        this.startDate = val.start_date
        this.isOngoing = !val.end_date
        this.description = val.description

        if (!this.isOngoing) this.endDate = val.end_date
      },
      deep: true
    }
  },
  data () {
    return {
      isOngoing: true,
      types: [
        "Literature Search",
        "Assay Development",
        "MAVE Data Collection",
        "MAVE Data Analysis",
        "Publication in preparation",
        "Publication available"
      ],
      type: "",
      startDate: new Date(),
      endDate: new Date(),
      description: ""
    }
  },
  methods: {
    updateVal() {
      let ret = {
        type: this.type,
        start_date: this.startDate,
        description: this.description
      }

      if (!this.isOngoing) ret.end_date = this.endDate

      this.$emit("input", ret)
    }
  }
}
</script>