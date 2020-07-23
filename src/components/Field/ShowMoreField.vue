<template>
  <div
    :class="{ 'sneak-peak': hasMore && !expanded }"
  >
    <div
      style="margin-bottom: 0; position: relative"
      ref="description"
    >
      {{ value }}
      <resize-observer @notify="handleResize" />
    </div>
    <p
      v-if="hasMore"
      class="is-size-7 has-text-centered show-more"
    >
      <a @click="expanded = !expanded">
        <b-icon :icon="expanded ? 'mdil-chevron-double-up' : 'mdil-chevron-double-down'" />
        {{ expanded ? "Show less" : "Show more" }}
      </a>
    </p>
  </div>
</template>

<style lang="sass">
@import "@/assets/style/variables.sass"

.sneak-peak
  max-height: 72px
  position: relative
  overflow: hidden
  .show-more
    position: absolute
    bottom: 0
    left: 0
    width: 100%
    margin: 0
    padding: 1rem 0 0 0
    background-image: linear-gradient(to bottom, transparent, $light, $light)
</style>

<script>
import { ResizeObserver } from 'vue-resize'

export default {
  components: {
    ResizeObserver
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      expanded: false,
      hasMore: false
    }
  },
  methods: {
    handleResize({ height }) {
      if (height > 48) this.hasMore = true
    }
  }
}
</script>