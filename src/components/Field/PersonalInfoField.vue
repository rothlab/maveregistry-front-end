<template>
  <div>
    <!-- First and Last name -->
    <b-field
      grouped
      class="field-margin is-space-between"
    >
      <ValidationProvider
        :rules="hasRequired"
        :immediate="!isRequired || first_name !== ''"
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
        :immediate="!isRequired || last_name !== ''"
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
      :immediate="!isRequired || email !== ''"
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
    <b-field
      grouped
      class="field-margin is-space-between"
    >
      <ValidationProvider
        :rules="hasRequired"
        :immediate="!isRequired || position !== ''"
        name="Position"
        v-slot="{ errors, valid }"
      > 
        <b-field
          grouped
          :message="errors"
          :type="{ 'is-danger': errors[0], '': valid }"
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
        </b-field>
      </ValidationProvider>
      <ValidationProvider
        v-if="position === 'Other'"
        :rules="hasRequired"
        :immediate="!isRequired || custom_position !== ''"
        name="OtherPosition"
        class="custom-position"
        v-slot="{ errors, valid }"
        slim
      > 
        <b-field
          :message="errors"
          :type="{ 'is-danger': errors[0], '': valid }"
        >
          <b-input
            v-model="custom_position"
            type="position"
            placeholder="Please specify your position"
            @input="updateVal"
            expanded
          />
        </b-field>
      </ValidationProvider>
    </b-field>
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
    isRequired: {
      type: Boolean,
      default: true
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
      custom_position: ""
    }
  },
  methods: {
    updateVal() {
      let ret = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        position: this.position,
        custom_position: this.custom_position
      }

      this.$emit("input", ret)
    }
  }
}
</script>

<style lang="sass" scoped>
.custom-position
  width: 62%
</style>