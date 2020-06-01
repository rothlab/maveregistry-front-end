<template>
  <div>
    <!-- First and Last name -->
    <b-field
      grouped
      class="field-margin is-space-between"
    >
      <ValidationProvider
        rules="required"
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
        rules="required"
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
      rules="required|email"
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
    <!-- Position -->
    <ValidationProvider
      rules="required"
      name="Position"
      v-slot="{ errors, valid }"
      v-if="!isPi"
    > 
      <b-field
        grouped
        :type="{ 'is-danger': errors[0], '': valid }"
        class="field-margin"
      >
        <b-select
          placeholder="Position"
          icon="mdil-briefcase"
          v-model="position"
          @input="updateVal"
        >
          <option
            v-for="pos in positions"
            :value="pos"
            :key="pos"
          >
            {{ pos }}
          </option>
        </b-select>
        <b-input
          v-if="position === 'Other'"
          v-model="custom_position"
          type="position"
          placeholder="Please specify your position"
          @input="updateVal"
          expanded
        />
      </b-field>
      <p
        v-if="errors[0]"
        class="has-text-danger"
      >
        {{ errors[0] }}
      </p>
    </ValidationProvider>
    <!-- Affiliation. Only when PI -->
    <ValidationProvider
      rules="required"
      name="Affiliation"
      v-slot="{ errors, valid }"
      v-else
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
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    isPi: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler (val) {
        this.first_name = val.first_name
        this.last_name = val.last_name
        this.email = val.email
        this.position = val.position
        this.custom_position = val.custom_position

        if (this.isPi) this.affiliation = val.affiliation
      },
      deep: true
    }
  },
  components: {
    ValidationProvider
  },
  data () {
    return {
      positions: [
        "Student",
        "Postdoc Fellow",
        "Faculty",
        "Research Staff",
        "Other"
      ],
      first_name: "",
      last_name: "",
      email: "",
      position: "",
      custom_position: "",
      affiliation: ""
    }
  },
  methods: {
    updateVal() {
      let ret = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
      }

      if (!this.isPi) {
        ret.position = this.position
        ret.custom_position = this.custom_position
      } else {
        ret.affiliation = this.affiliation
      }

      this.$emit("input", ret)
    }
  }
}
</script>
