<template>
  <section>
    <!-- Section indicator -->
    <scrollactive
      class="section-indicator"
      active-class="is-active"
      highlight-first-item
      :modify-url="false"
      :offset="400"
      :scroll-offset="84"
    >
      <a
        href="#main"
        class="scrollactive-item"
      />
      <a
        href="#landing-1"
        class="scrollactive-item"
      />
      <a
        href="#landing-2"
        class="scrollactive-item"
      />
    </scrollactive>
    <!-- Landing section-->
    <section
      id="main"
      class="hero is-primary is-bold full-height"
    >
      <div class="hero-body landing">
        <div class="container is-fluid">
          <div class="columns is-vcentered">
            <div
              class="column is-7"
              style="z-index: 1"
            >
              <div class="landing-left">
                <!-- Intro -->
                <div
                  class="delay-500ms"
                  v-animate="'fadeIn'"
                >
                  <h2 class="subtitle is-size-4">
                    Amazing MAVE projects
                  </h2>
                  <h1 class="title is-uppercase is-size-2">
                    Tracked Here
                  </h1>
                  <p class="is-size-5">
                    Mave Registry is a collaborative resource for sharing progress on Multiplexed Assays of Variant Effect (MAVE).
                  </p>
                </div>

                <!-- Action buttons -->
                <div class="landing-action-buttons">
                  <div class="level">
                    <div class="level-left">
                      <b-button
                        size="is-medium"
                        type="is-warning"
                        tag="router-link"
                        to="/projects"
                        class="med-shadow delay-1s"
                        v-animate="'fadeIn'"
                      >
                        Browse Projects
                      </b-button>
                    </div>
                    <div class="level-right">
                      <b-button
                        size="is-medium"
                        tag="router-link"
                        to="/nominations"
                        class="med-shadow delay-1500ms"
                        v-animate="'fadeIn'"
                      >
                        Nominate Targets
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-10 is-hidden-mobile">
              <div class="demo-display" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Onboarding section 1 -->
    <section 
      id="landing-1" 
      class="hero is-medium"
    >
      <div class="hero-body">
        <!-- Question -->
        <div class="container has-text-centered">
          <p class="section-header">
            How does 
            <span class="has-text-primary">Mave Registry</span> work?
          </p>

          <div>
            <!-- Steps -->
            <div
              class="step-line is-hidden-mobile delay-1s"
              v-animate="'showInX'"
            />
            <div class="columns">
              <div
                class="column step-content"
                v-animate="'flipInX'"
              >
                <div class="step-number is-inline-flex has-vcentered has-text-centered is-primary is-bold large-shadow">
                  <p class="has-fullwidth has-text-light">
                    <b-icon
                      icon="mdil-rss"
                      aria-label="icon"
                    />
                  </p>
                </div>
                <h2 class="subtitle is-capitalized has-text-primary">
                  Keep updated
                </h2>
                <p>Get updates for teams and projects that you follow.</p>
              </div>
              <div
                class="column step-content delay-500ms"
                v-animate="'flipInX'"
              >
                <div class="step-number is-inline-flex has-vcentered has-text-centered is-primary is-bold large-shadow">
                  <p class="has-fullwidth has-text-light">
                    <b-icon
                      icon="mdil-clipboard-plus"
                      aria-label="icon"
                    />
                  </p>
                </div>
                <h2 class="subtitle is-capitalized has-text-primary">
                  Nominate targets
                </h2>
                <p>Propose MAVE targets of which a systematic variant effect map you would like to see.</p>
              </div>
              <div
                class="column step-content delay-1s"
                v-animate="'flipInX'"
              >
                <div class="step-number is-inline-flex has-vcentered has-text-centered is-primary is-bold large-shadow">
                  <p class="has-fullwidth has-text-light">
                    <b-icon
                      icon="mdil-pencil"
                      aria-label="icon"
                    />
                  </p>
                </div>
                <h2 class="subtitle is-capitalized has-text-primary">
                  Register projects
                </h2>
                <p>Register projects that your team is working on.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Onboarding section 2 -->
    <section
      id="landing-2"
      class="hero is-medium has-background-white-bis"
    >
      <div class="hero-body">
        <div class="container has-text-centered">
          <p class="section-header">
            What can
            <span class="has-text-primary">Mave Registry</span>
            do
            <span class="has-text-success">for you</span>?
          </p>
          
          <!-- Desktop view -->
          <div class="columns is-hidden-touch">
            <div class="column is-3 is-offset-1">
              <div class="columns is-multiline">
                <div
                  class="column is-narrow"
                  v-for="(tab, id) in tabs"
                  :key="id"
                  @click="activeTab = id"
                >
                  <div
                    class="panel selection"
                    :class="{ 'is-active' : activeTab === id }"
                  >
                    <div>
                      <b-icon
                        :icon="tab.icon"
                        custom-size="mdil-48px"
                      />
                      <p class="is-size-6">
                        {{ tab.title }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column">
              <b-carousel
                v-model="activeTab"
                :indicator="false"
                :autoplay="false"
                :arrow="false"
                :has-drag="false"
              >
                <b-carousel-item
                  v-for="(tab, id) in tabs"
                  :key="id"
                >
                  <div class="content has-text-left">
                    <lottie
                      class="animation"
                      :options="{ animationData: tab.animation }"
                      :height="500"
                      :width="500"
                      :autoplay="false"
                    />
                    <div class="description">
                      <p class="is-size-5">
                        <span class="is-size-3">{{ tab.title }}</span><br>
                        <span>{{ tab.description }}</span>
                      </p>
                    </div>
                  </div>
                </b-carousel-item>
              </b-carousel>
            </div>
          </div>

          <!-- Mobile view -->
          <div class="content has-text-left is-hidden-desktop">
            <div
              style="margin: 0 1rem"
              v-for="(tab, id) in tabs"
              :key="id"
            >
              <div class="p-margin">
                <div class="is-flex has-vcentered field-margin">
                  <b-icon
                    :icon="tab.icon"
                    custom-size="mdil-24px"
                    type="is-primary"
                    style="margin-right: 0.25rem"
                  />
                  <span class="is-size-5 has-text-primary">{{ tab.title }}</span>
                </div>
                <div style="padding-left: 1.75rem">
                  {{ tab.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import Lottie from "vue-lottie"

export default {
  components: {
    Lottie
  },
  data () {
    return {
      activeTab: 0,
      tabs: [
        {
          icon: "mdil-bell",
          title: "Stay in the Loop",
          description: "Receive notifications for updates of projects and teams that you follow.",
          animation: require("@/assets/animation/stay-in-the-loop.json"),
          animation_alt_text: "Stay in the loop",
        },
        {
          icon: "mdil-vector-union",
          title: "Foster Collaborations",
          description: "Find teams with common interest and start a collaboration.",
          animation: require("@/assets/animation/foster-collabs.json"),
        },
        {
          icon: "mdil-shuffle",
          title: "Resolve Conflicts",
          description: "Identify and resolve potential project conflicts.",
          animation: require("@/assets/animation/resolve-conflicts.json"),
        },
        {
          icon: "mdil-currency-usd",
          title: "Seek Funding",
          description: "Make your projects visible to potential funders.",
          animation: require("@/assets/animation/seek-funding.json"),
        }
      ]
    }
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768
    }
  },
  mounted() {
    document.dispatchEvent(new Event('render-event'))
  }
}
</script>


<style lang="sass">
.tabs
  overflow: visible
.carousel-items
  height: 100%
</style>

<style lang="sass" scoped>
@import "@/assets/style/variables.sass"
@import "@/assets/style/animations.sass"

.section-indicator
  position: fixed
  top: 50vh
  right: 1rem
  z-index: 5
  padding: 0.5rem 0.25rem
  background-color: $grey-lighter
  border-radius: 10px
  a
    display: block
    height: 0.5rem
    width: 0.5rem
    background-color: $light
    border-radius: 0.5rem
    transition: ease-in-out 200ms
    &:hover
      background-color: $grey-light
    &:not(:first-child)
      margin-top: 0.5rem
    &.is-active
      background-color: $warning
@media screen and (min-width: $break-desktop)
  .full-height
    height: calc( 100vh - 5rem )
  .landing
    padding-right: 0
    margin-right: 0
  .landing-left
    position: relative
    left: 25%
    max-width: 35rem
@media screen and (max-width: $break-desktop)
  .full-height
    height: calc( 100vh - 3rem )
@media screen and (max-width: $break-mobile)
  .landing
    text-align: center
    display: flex
    align-items: center
  .landing-left
    display: inline-block
    max-width: 80vw
.landing-action-buttons
  margin-top: 2rem
  .button
    padding: 0rem 1.5rem
    @media screen and (max-width: $break-mobile)
      width: 80%
.demo-display
  position: relative
  right: 22rem
  min-height: 20rem
  height: 70vh
  background-image: url("../assets/image/background.png")
  background-size: cover
  overflow-x: show
  @media screen and (max-width: $break-desktop)
    right: 15rem
.tip
  margin: 1rem 0
.tip span
  margin-left: 0.5rem
.step-line
  position: relative
  top: 2.5rem
  @media screen and (max-width: $break-desktop)
    top: 1.6rem
  left: 15%
  width: 70%
  height: 1px
  background: $primary
  z-index: -1
.step-number
  height: 5rem
  width: 5rem
  font-size: 40px
  @media screen and (max-width: $break-desktop)
    height: 3rem
    width: 3rem
    font-size: 30px
  font-weight: lighter
  border-radius: 50%
  border: 1px solid $primary
  margin-bottom: 0.5rem
.step-content
  opacity: 0
  h2
    @media screen and (min-width: $break-mobile)
      padding: 1rem
    @media screen and (max-width: $break-mobile)
      padding: 0.25rem
  p
    &:not(.has-fullwidth)
      padding: 0 2rem
.section-header
  @media screen and (max-width: $break-mobile)
    font-size: 1.5rem
    padding-bottom: 2rem
  @media screen and (min-width: $break-mobile)
    font-size: 2.5rem
    padding-bottom: 3rem
.panel
  background-color: $white
  border-radius: 6px
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.15)
  color: $primary
  transition: all ease-in-out 200ms
  &.selection
    display: inline-flex
    align-items: center
    justify-content: center
    padding: 1rem
    cursor: pointer
    height: 9rem
    width: 9rem
    &:hover, &.is-active
      background-image: linear-gradient(141deg, #280444 0%, #540d6e 71%, #7c0c89 100%)
      box-shadow: 0 1rem 3rem rgba(0,0,0,.175)
      color: $white
    .icon
      height: 48px
      width: 48px
.carousel
  .content
    height: 100%
    background-position: center
    border-radius: 6px
  .animation
    margin: 0
    right: 0
    top: 0
    position: relative
  .description
    padding: 0 3rem
    color: $dark
</style>