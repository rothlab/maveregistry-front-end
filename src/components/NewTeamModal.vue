<template>
  <b-modal
    :active.sync="isActive"
    has-modal-card
    :can-cancel="['escape', 'outside']"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span>Add a New Team</span>
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
            <p class="is-size-5 has-text-weight-bold">
              Principal Investigator
            </p>
          
            <!-- First and last name -->
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
                  label="First Name"
                >
                  <b-input
                    type="text"
                    placeholder="First Name"
                    v-model="firstName"
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
                  label="Last Name"
                >
                  <b-input
                    type="text"
                    placeholder="Last Name"
                    v-model="lastName"
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
                label="Email"
              >
                <b-input
                  icon="mdil-email"
                  type="email"
                  placeholder="Email"
                  v-model="email"
                />
              </b-field>
            </ValidationProvider>

            <!-- Association -->
            <ValidationProvider
              rules="required"
              name="Affiliation"
              v-slot="{ errors, valid }"
            > 
              <b-field
                :message="errors"
                class="field-margin"
                :type="{ 'is-danger': errors[0], '': valid }"
                label="Affiliation"
              >
                <b-input
                  icon="mdil-factory"
                  v-model="affiliation"
                  type="affiliation"
                  placeholder="Affiliation"
                />
              </b-field>
            </ValidationProvider>

            <!-- Website -->
            <ValidationProvider
              :rules="{ regex: 
                /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ 
              }"
              name="Website (Optional)"
              v-slot="{ errors, valid }"
              immediate
            > 
              <b-field
                :message="errors"
                class="field-margin"
                :type="{ 'is-danger': errors[0], '': valid }"
                label="Website (Optional)"
              >
                <b-input
                  icon="mdil-link"
                  type="website"
                  placeholder="http:// or https://"
                  v-model="website"
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
            @click="addTeam"
          >
            Add Team
          </b-button>
        </footer>
      </ValidationObserver>
    </div>
  </b-modal>
</template>

<script>
import * as TeamManage from "@/api/teamManage"
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isActive: false,
      isLoading: false,
      firstName: "",
      lastName: "",
      email: "",
      affiliation: "",
      website: ""
    }
  },
  watch: {
    active() {
      // This if statement if important because we only want to reinit data when parent state is changed
      if (this.isActive != this.active) {
        this.isActive = this.active
        this.cleanupNewTeam()
      }
    },
    isActive(val) {
      this.$emit("update:active", val)
    }
  },
  methods: {
    cleanupNewTeam() {
      this.firstName = ""
      this.lastName = ""
      this.email = ""
      this.affiliation = ""
      this.website = ""
    },
    async addTeam() {
      this.isLoading = true

      try {
        await TeamManage.addTeam({
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          affiliation: this.affiliation,
          website: this.website
        })

        // Handle UI changes
        this.isActive = false

        // Trigger change
        this.$emit("change")
      } catch (error) {
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger',
          queue: false,
          duration: 5000
        })
      } finally {
        this.isLoading = false
      }
    },
  }
}
</script>