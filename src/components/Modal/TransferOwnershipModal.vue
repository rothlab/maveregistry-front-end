<template>
  <b-modal
    :active.sync="isActive"
    :width="500"
    class="card-modal"
    @close="users = []"
  >
    <div class="card">
      <div class="card-content">
        <!-- Header -->
        <div class="level is-mobile">
          <div class="level-left">
            <p class="is-size-5 has-text-primary is-capitalized">
              Transfer Ownership
            </p>
          </div>
          <div class="level-right">
            <button
              class="delete"
              aria-label="close"
              @click="isActive = false"
            />
          </div>
        </div>

        <!-- Body -->
        <div class="container">
          <div class="content">
            <p>
              Once accepted by the recipient, you will lose ownership of this {{ type }} record.
              <b>This action is irreversible.</b>
            </p>

            <p>
              Please enter recipient of the {{ type }}
            </p>
            
            <b-autocomplete
              :data="users"
              field="display"
              placeholder="Search User by Name"
              icon="mdil-magnify"
              :loading="isLoading.autocomplete"
              @typing="searchUser"
              append-to-body
              @select="selectUser"
            >
              <template slot="empty">
                No results found
              </template>

              <template slot-scope="props">
                <div
                  class="is-flex has-vcentered"
                  style="margin: 0.25rem 0"
                  v-if="!isLoading.autocomplete"
                >
                  <figure
                    class="image is-24x24 is-inline-flex"
                    style="margin-right: 0.5rem"
                  >
                    <img
                      class="is-rounded"
                      :src="getProfileImageFromUser(props.option)"
                      alt="Profile Image"
                    >
                  </figure>
                  <span class="is-capitalized">
                    {{ props.option.first_name }}
                    {{ props.option.last_name }}
                  </span>
                </div>
              </template>
            </b-autocomplete>
          </div>
        </div>

        <b-button
          style="margin-top: 1.5rem"
          :loading="isLoading.submit"
          :disabled="!recipientId"
          type="is-warning"
          expanded
          @click="transferOwnership"
        >
          Transfer Ownership
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import * as UserManage from "@/api/userManage.js"
import * as TransferManage from "@/api/transferManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"

export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    targetId: {
      type: String,
      required: true
    }
  },
  watch: {
    isActive(val) {
      if (val !== this.active) {
        this.$emit("update:active", val)
      }
    },
    active(val) {
      if (val != this.isActive) {
        this.isActive = val
      }
    }
  },
  data() {
    return {
      isActive: false,
      isLoading: {
        autocomplete: false,
        submit: false
      },
      recipientId: "",
      users: []
    }
  },
  methods: {
    async searchUser(name) {
      if (!name) {
        this.recipientId = ""
        return
      }

      this.isLoading.autocomplete = true

      try {
        const users = await UserManage.queryUserByName(name, false)
        this.users = users.map((e) => {
          e.display = `${this.capitalize(e.first_name)} ${this.capitalize(e.last_name)}`
          return e
        })
      } catch (error) {
        displayErrorToast(error)
      } finally {
        this.isLoading.autocomplete = false
      }
    },
    selectUser(user) {
      this.recipientId = user.id
    },
    async transferOwnership() {
      if (!this.recipientId) return

      this.isLoading.submit = true

      try {
        const target = {
          type: this.type,
          id: this.targetId
        }
        const transfer = await TransferManage.transferOwnership("owner", target, this.recipientId)
        this.$emit("transfer", transfer)
      } catch (error) {
        displayErrorToast(error)
        return
      } finally {
        this.isLoading.submit = false
      }

      this.$buefy.toast.open({
        duration: 5000,
        message: `Transfer Ownership Request Sent`,
        type: 'is-success',
        queue: false
      })
      this.isActive = false
    }
  }
}
</script>

<style lang="sass" scoped>
.footer-actions
  margin-top: 1.5rem
  justify-content: flex-end
</style>