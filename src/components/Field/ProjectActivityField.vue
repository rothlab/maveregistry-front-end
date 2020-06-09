<template>
  <div>
    <!-- Type -->
    <ValidationProvider
      rules="required"
      :immediate="type.length > 0"
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
        immediate
        name="StartDate"
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
        :rules="isOngoing ? '' : 'required|end_date:@StartDate'"
        immediate
        name="EndDate"
        v-slot="{ errors, valid }"
        class="name"
      > 
        <b-field
          class="end-date"
          label="End Date"
          :message="errors"
          :type="{ 'is-danger': errors[0], '': valid }"
        >
          <b-datepicker
            v-show="!isOngoing"
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

          <div
            v-if="isOngoing"
          >
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
      rules="required|max:3000"
      :immediate="description.length > 0"
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

const progressTypes = require("@/assets/script/variables.json").progress_type

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
      handler () {
        this.initData()
      },
      deep: true
    }
  },
  data () {
    return {
      isOngoing: true,
      types: progressTypes,
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
    },
    initData() {
      this.type = this.value.type
      this.startDate = this.value.start_date
      this.isOngoing = !this.value.end_date
      this.description = this.value.description

      if (!this.isOngoing) this.endDate = this.value.end_date
    }
  },
  mounted() {
    this.initData()
  }
}
</script>

<style lang="sass" scoped>
.end-date, .has-addons
  display: block
</style>