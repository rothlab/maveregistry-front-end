<template>
  <b-modal
    :active.sync="isActive"
    class="card-modal tutorial-videos-modal"
    :can-cancel="['escape', 'outside']"
    :width="720"
  >
    <div class="card">
      <div class="card-content">
        <!-- Header -->
        <div class="level is-mobile">
          <div class="level-left">
            <p class="is-size-5 has-text-primary">
              Tutorial {{ activeItem + 1 }}: {{ tutorials[activeItem].name }}
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
        <b-carousel
          v-model="activeItem"
          :indicator-inside="false"
          :pause-hover="false"
          :autoplay="false"
        >
          <b-carousel-item
            v-for="(tutorial, id) in tutorials"
            :key="id"
          >
            <vue-vimeo-player
              :video-id="tutorial.video_id"
              :options="{ dnt: true, responsive: true, title: false, portrait: false, byline: false }"
            />
          </b-carousel-item>

          <!-- Indicators -->
          <template
            slot="indicators"
            slot-scope="props"
          >
            <span class="al image has-text-centered">
              <img
                :src="tutorials[props.i].thumbnail_path"
                :alt="`Thumbnail for tutorial ${props.i + 1}`"
              >
              {{ tutorials[props.i].short_title }}
            </span>
          </template>
        </b-carousel>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { vueVimeoPlayer } from 'vue-vimeo-player'

export default {
  components: {
    vueVimeoPlayer
  },
  props: {
    active: {
      type: Boolean,
      required: true
    },
    selected: {
      type: Number,
      default: 0
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
  mounted() {
    this.activeItem = this.selected
  },
  data() {
    return {
      isActive: false,
      activeItem: 0,
      tutorials: [
        {
          name: "Create an Account",
          short_title: "Account",
          video_id: "466592063",
          thumbnail_path: require("@/assets/image/tut_1_thumbnail.jpg")
        },
        {
          name: "Browse and Register Projects",
          short_title: "Projects",
          video_id: "466593209",
          thumbnail_path: require("@/assets/image/tut_2_thumbnail.jpg")
        },
        {
          name: "Browse and Register Teams",
          short_title: "Teams",
          video_id: "466594292",
          thumbnail_path: require("@/assets/image/tut_3_thumbnail.jpg")
        },
        {
          name: "Browse and Nominate Targets",
          short_title: "Nomination",
          video_id: "466594441",
          thumbnail_path: require("@/assets/image/tut_4_thumbnail.jpg")
        }
      ],
    }
  }
}
</script>

<style lang="sass">
.tutorial-videos-modal
  .is-active .al img
    filter: grayscale(0%)
  .al img 
    filter: grayscale(100%) brightness(50%)
    width: 120px
    transition: 200ms
    &:hover
      filter: grayscale(100%) brightness(80%)
</style>