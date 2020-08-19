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

    <b-message
      v-if="type === 'Publication Available'"
      type="is-warning"
      size="is-small"
      class="activity-tip"
    >
      <b-icon
        icon="mdil-alert-circle"
        custom-class="mdil-18px"
      />
      <span class="font-14px">
        This activity will be made available to the public.
      </span>
    </b-message>

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
        class="field-margin"
      >
        <b-input
          v-model.trim="description"
          maxlength="3000"
          type="textarea"
          placeholder="Need some inspiration? Find questions to consider in the right panel."
          @input="updateVal"
        />
      </b-field>
    </ValidationProvider>

    <!-- Reference -->
    <label class="label">Links (Optional)</label>
    <div
      v-for="(link, id) in links"
      :key="id"
    >
      <ValidationProvider
        :rules="{ regex: 
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ 
        }"
        immediate
        name="Link"
        :vid="`link-${id}-${activityId}`"
        v-slot="{ errors, valid }"
      >
        <b-field
          :message="errors"
          class="field-margin"
          :type="{ 'is-danger': errors[0], '': valid }"
        >
          <div class="is-flex is-space-between">
            <b-input
              icon="mdil-link"
              type="website"
              placeholder="http:// or https://"
              class="link-input"
              v-model.trim="links[id]"
              @input="updateVal"
              expanded
            />
            <b-button
              v-if="(links.length - 1) === id"
              icon-left="mdil-plus"
              type="is-light"
              @click="links.push('')"
            />
            <b-button
              v-else
              icon-left="mdil-delete"
              type="is-light"
              @click="links.splice(id, 1); updateVal()"
            />
          </div>
        </b-field>
      </ValidationProvider>
    </div>
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
      activityId: "",
      types: progressTypes,
      type: "",
      startDate: new Date(),
      endDate: new Date(),
      description: "",
      links: [""]
    }
  },
  methods: {
    updateVal() {
      let ret = {
        type: this.type,
        start_date: this.startDate,
        description: this.description,
      }

      if (!this.isOngoing) ret.end_date = this.endDate
      if (this.activityId !== "") ret.id = this.activityId
      if (this.links.length > 0) ret.links = this.links

      this.$emit("input", ret)
    },
    initData() {
      this.type = this.value.type
      this.startDate = this.value.start_date
      this.isOngoing = !this.value.end_date
      this.description = this.value.description

      if (!this.isOngoing) this.endDate = this.value.end_date
      if (this.value.links && this.value.links.length > 0) this.links = this.value.links
      if (this.value.id) this.activityId = this.value.id
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
.link-input
  width: 90%
</style>

<style lang="sass">
.activity-tip
  .media-content
    overflow-x: unset
</style>