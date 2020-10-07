<template>
  <div>
    <!-- If no confirmation, just show password -->
    <div v-if="!hasConfirm">
      <ValidationProvider
        rules="required"
        name="Password"
        v-slot="{ errors, valid }"
      > 
        <div class="field-margin">
          <b-field
            :type="{ 'is-danger': errors[0], '': valid }"
            :input="$emit('input', password)"
            class="is-marginless"
          >
            <!-- Handle show and hide password -->
            <b-input
              icon="mdil-lock"
              :key="revealPass ? 'reveal_pass' : 'hidden_pass'"
              :type="revealPass ? 'text' : 'password'"
              placeholder="Password"
              v-model="password"
              expanded
              @keyup.native.enter="emitSubmit"
            />
            <p class="control">
              <b-button
                class="button"
                icon-right="mdil-eye"
                :type="revealPass ? 'is-primary' : ''"
                @click="revealPass = !revealPass"
              />
            </p>
          </b-field>
          <p
            v-if="errors[0]"
            class="help has-text-danger"
          >
            {{ errors[0] }}
          </p>
        </div>
      </ValidationProvider>
    </div>

    <!-- If with confirmation, show both password and confirm -->
    <div v-else>
      <ValidationProvider
        name="initial"
        v-slot="{ errors, valid }" 
        rules="required|password_strength"
      >
        <div class="field-margin">
          <b-field
            class="is-marginless"
            :type="{ 'is-danger': errors[0], '': valid }"
          >
            <b-input
              icon="mdil-lock"
              :key="revealPass ? 'reveal_pass' : 'hidden_pass'"
              :type="revealPass ? 'text' : 'password'"
              placeholder="Password (min. 8 characters)"
              v-model="passwordInit"
              expanded
            />
            <p class="control">
              <b-button
                class="button"
                icon-right="mdil-eye"
                :type="revealPass ? 'is-primary' : ''"
                @click="revealPass = !revealPass"
              />
            </p>
          </b-field>
          <p
            v-if="errors[0]"
            class="help has-text-danger"
          >
            {{ errors[0] }}
          </p>
        </div>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, valid }" 
        rules="required|password:@initial"
      >
        <div class="field-margin">
          <b-field
            class="is-marginless"
            :type="{ 'is-danger': errors[0], '': valid }"
            :input="$emit('input', passwordConfirm)"
          >
            <b-input
              icon="mdil-lock"
              :key="revealPassConfirm ? 'reveal_pass' : 'hidden_pass'"
              :type="revealPassConfirm ? 'text' : 'password'"
              placeholder="Confirm password"
              v-model="passwordConfirm"
              expanded
              @keyup.native.enter="emitSubmit"
            />
            <p class="control">
              <b-button
                class="button"
                icon-right="mdil-eye"
                :type="revealPassConfirm ? 'is-primary' : ''"
                @click="revealPassConfirm = !revealPassConfirm"
              />
            </p>
          </b-field>
          <p
            v-if="errors[0]"
            class="help has-text-danger"
          >
            {{ errors[0] }}
          </p>
        </div>
      </ValidationProvider>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate"

export default {
  components: {
    ValidationProvider,
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    hasConfirm: {
      type: Boolean,
      default: false
    },
    enterToSubmit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      revealPass: false,
      revealPassConfirm: false,
      password: "",
      passwordInit: "",
      passwordConfirm: "",
    }
  },
  methods: {
    emitSubmit() {
      if (this.enterToSubmit) this.$emit("submit")
    }
  }
}
</script>

<style lang="sass">
.strength-meter
  margin: 0.25rem 0 0 0 !important
</style>