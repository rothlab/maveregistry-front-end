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
        :rules="'required|password_strength:3,' + passStrength"
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
              placeholder="Password (min. 7 characters)"
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
            {{ errors[0] + (passFeedback ? passFeedback : '') }}
          </p>
          <!-- Password strength indicator -->
          <div class="columns is-mobile is-vcentered password-strength">
            <div class="column is-narrow">
              <span class="is-size-7">Strength</span>
            </div>
            <div class="column">
              <password
                v-model="passwordInit"
                :strength-meter-only="true"
                @score="storePassStrength"
                @feedback="storePassFeedback"
                strength-meter-class="Password__strength-meter strength-meter"
              />
            </div>
          </div>
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
import Password from 'vue-password-strength-meter'

export default {
  components: {
    ValidationProvider,
    Password
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
      passStrength: 0,
      passFeedback: ""
    }
  },
  methods: {
    storePassStrength(score) {
      this.passStrength = score
    },
    storePassFeedback({suggestions}) {
      this.passFeedback = suggestions[0]
    },
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