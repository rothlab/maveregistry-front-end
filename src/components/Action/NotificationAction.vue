<template>
  <div>
    <b-dropdown
      hoverable
      position="is-bottom-left"
      aria-role="menu"
    >
      <a
        slot="trigger"
        role="button"
      >
        <span
          class="badge"
          v-if="count > 0"
        >{{ count }}</span>
        <b-icon
          pack="mdi"
          icon="bell"
          type="is-grey-light"
        />
      </a>

      <b-dropdown-item custom>
        <div
          class="content has-text-grey"
          style="width: 200px"
        >
          No notifications
        </div>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/style/variables.sass"

.badge
  background-color: $danger
  border: 2px solid transparent
  border-radius: 14px
  box-shadow: 0 0 0 2px #fff
  color: #fff
  font-size: .65rem
  height: 14px
  line-height: 8px
  min-width: 14px
  overflow: hidden
  padding: .05rem .15rem
  position: absolute
  right: 0
  text-overflow: ellipsis
  top: 0
  transform: translate(50%,-50%)
  white-space: nowrap
</style>