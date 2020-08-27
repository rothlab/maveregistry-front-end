<template>
  <div>
    <!-- Header -->
    <div class="hero is-light">
      <div class="hero-body has-page-header-padding">
        <div class="container">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="content">
                <p class="is-size-3 has-text-weight-medium">
                  About the Registry
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <div class="columns">
        <div class="column is-3">
          <scrollactive
            active-class="is-active"
            class="menu is-sticky"
            :offset="300"
            :scroll-offset="100"
          >
            <p class="menu-label">
              Table of Contents
            </p>
            <ul class="menu-list">
              <li>
                <a
                  href="#what-is"
                  class="scrollactive-item"
                >What is Mave Registry?</a>
              </li>
              <li>
                <a
                  href="#contact-us"
                  class="scrollactive-item"
                >Contact us</a>
              </li>
              <li>
                <a
                  href="#acknowledgement"
                  class="scrollactive-item"
                >Acknowledgement</a>
              </li>
            </ul>
          </scrollactive>
        </div>

        <div class="column content">
          <div
            class="p-margin"
            id="what-is"
          >
            <p class="is-size-4">
              What is Mave Registry?
            </p>
            <p class="has-text-centered">
              <img
                src="@/assets/image/logo.png"
                alt="Mave Registry Logo"
                width="500"
              >
            </p>
            <p>
              Mave Registry is a database for activities on studying targets with Multiplexed Assays of Variant Effect (MAVE).
            </p>
            <p>
              Mave Registry is developed by 
              <a
                href="https://kevinkuang.net/"
                target="_blank"
                rel="noopener noreferrer"
              >Kevin Kuang</a>
              and others at the 
              <a
                href="http://llama.mshri.on.ca/"
                target="_blank"
                rel="noopener noreferrer"
              >Roth Lab</a>
              at the Univeristy of Toronto.
            </p>
          </div>

          <div
            class="p-margin"
            id="contact-us"
          >
            <p class="is-size-4">
              Contact Us
            </p>
            <p>
              We would love to hear your thoughts and feedback so we can continue to improve Mave Registry.
            </p>
            <p>
              Please feel free to 
              <a href="mailto:maveregistry@gmail.com">email us</a>
              your comments and suggestions.
            </p>
          </div>

          <div
            class="p-margin"
            id="acknowledgement"
          >
            <p class="is-size-4">
              Acknowledgement
            </p>
            <p class="is-size-5">
              Open Source Projects & Licenses
            </p>
            <p>
              Mave Registry is built with an array of Open Source projects. Without technologies and supports from the Open Source community, 
              it will be extremely difficult, if possible at all, to build Mave Registry.
            </p>
            <p>
              Specifically, Mave Registry benefits from the following major Open Source projects:
            </p>
            <p>
              <ul>
                <li>
                  <a
                    href="https://vuejs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Vue.js</a>
                </li>
                <li>
                  <a
                    href="https://buefy.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Buefy</a>
                  and
                  <a
                    href="https://bulma.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Bulma</a>
                </li>
                <li>
                  <a
                    href="https://parseplatform.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Parse</a>
                </li>
                <li>
                  <a
                    href="https://nodejs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Node.js</a>
                  and
                  <a
                    href="https://expressjs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Express</a>
                </li>
              </ul>
            </p>
            <p>
              A complete list of Open Source projects used and their license is listed below.
            </p>
            <b-table
              :data="openSourceProjects"
              hoverable
              paginated
              pagination-simple
              icon-pack="mdil"
              default-sort="project"
            >
              <template slot-scope="props">
                <b-table-column
                  field="project"
                  label="Project"
                  sortable
                >
                  <a
                    :href="props.row.link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ props.row.project }}
                  </a>
                </b-table-column>
                <b-table-column
                  field="team"
                  label="Team/Authors"
                  sortable
                >
                  {{ props.row.team }}
                </b-table-column>
                <b-table-column
                  field="license"
                  label="License"
                  sortable
                >
                  <a
                    :href="props.row.license_url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ props.row.license }}
                  </a>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  title: "About",
  mounted() {
    document.dispatchEvent(new Event('render-event'))
  },
  data() {
    return {
      openSourceProjects: [
        {
          project: "Vue.js",
          team: "Evan You",
          license: "MIT",
          license_url: "https://opensource.org/licenses/MIT",
          link: "https://vuejs.org/",
        },
        {
          project: "Buefy",
          team: "Walter Tommasi, Rafael Beraldo",
          license: "MIT",
          license_url: "https://opensource.org/licenses/MIT",
          link: "https://buefy.org/"
        },
        {
          project: "Bulma",
          team: "Jeremy Thomas",
          license: "MIT",
          license_url: "https://github.com/jgthms/bulma/blob/master/LICENSE",
          link: "https://bulma.io/"
        },
        {
          project: "Parse Server",
          team: "Parse Platform",
          license: "BSD",
          license_url: "https://github.com/parse-community/parse-server/blob/master/LICENSE",
          link: "https://github.com/parse-community/parse-server"
        },
        {
          project: "Parse SDK for Javascript",
          team: "Parse Platform",
          license: "BSD",
          license_url: "https://github.com/parse-community/parse-server/blob/master/LICENSE",
          link: "https://github.com/parse-community/Parse-SDK-JS"
        },
        {
          project: "Node.js",
          team: "OpenJS Foundation",
          license: "Node.js Licenses",
          license_url: "https://raw.githubusercontent.com/nodejs/node/master/LICENSE",
          link: "https://nodejs.org/"
        },
        {
          project: "Express",
          team: "OpenJS Foundation",
          license: "CC BY-SA 3.0 US",
          license_url: "https://creativecommons.org/licenses/by-sa/3.0/us/",
          link: "https://expressjs.com/"
        },
        {
          project: "Vue.js hCaptcha",
          team: "Intuition Machines, Inc.",
          license: "MIT",
          license_url: "https://github.com/hCaptcha/vue-hcaptcha/blob/master/LICENSE",
          link: "https://github.com/hCaptcha/vue-hcaptcha"
        },
        {
          project: "Material Design Icons",
          team: "Austin Andrews, Google",
          license: "Material Design Icons License",
          license_url: "https://github.com/Templarian/MaterialDesign/blob/master/LICENSE",
          link: "https://github.com/Templarian/MaterialDesign"
        },
        {
          project: "Sentry JavaScript SDK",
          team: "Functional Software, Inc.",
          license: "BSD",
          license_url: "https://github.com/getsentry/sentry-javascript/blob/master/LICENSE",
          link: "https://github.com/getsentry/sentry-javascript"
        },
        {
          project: "core-js",
          team: "Denis Pushkarev",
          license: "MIT",
          license_url: "https://github.com/zloirock/core-js/blob/master/LICENSE",
          link: "https://github.com/zloirock/core-js"
        },
        {
          project: "Prerender SPA Plugin",
          team: "Chris Fritz",
          license: "MIT",
          license_url: "https://github.com/chrisvfritz/prerender-spa-plugin/blob/master/LICENSE.md",
          link: "https://github.com/chrisvfritz/prerender-spa-plugin"
        },
        {
          project: "VeeValidate",
          team: "Abdelrahman Awad",
          license: "MIT",
          license_url: "https://github.com/logaretm/vee-validate/blob/master/LICENSE",
          link: "https://logaretm.github.io/vee-validate/"
        },
        {
          project: "vue-animate-scroll",
          team: "Mike Prince",
          license: "MIT",
          license_url: "https://github.com/mike-prince/vue-animate-scroll/blob/master/LICENSE",
          link: "https://github.com/mike-prince/vue-animate-scroll"
        },
        {
          project: "Vue Avatar Cropper",
          team: "安正超",
          license: "MIT",
          license_url: "https://opensource.org/licenses/MIT",
          link: "https://github.com/overtrue/vue-avatar-cropper"
        },
        {
          project: "Lottie Animation View for Vue",
          team: "Chen Qing",
          license: "MIT",
          license_url: "https://github.com/chenqingspring/vue-lottie/blob/master/LICENSE",
          link: "https://github.com/chenqingspring/vue-lottie"
        },
        {
          project: "vue-password-strength-meter",
          team: "Jakub Juszczak",
          license: "MIT",
          license_url: "https://github.com/apertureless/vue-password-strength-meter/blob/develop/LICENSE.txt",
          link: "https://github.com/apertureless/vue-password-strength-meter"
        },
        {
          project: "Vue Router",
          team: "Evan You",
          license: "MIT",
          license_url: "https://github.com/vuejs/vue-router/blob/dev/LICENSE",
          link: "https://router.vuejs.org/"
        },
        {
          project: "vue-scrollactive",
          team: "Mauricio Dziedzinski",
          license: "MIT",
          license_url: "https://github.com/eddiemf/vue-scrollactive/blob/master/LICENSE",
          link: "https://github.com/eddiemf/vue-scrollactive"
        },
        {
          project: "vue-scrollto",
          team: "Igor Randjelovic",
          license: "MIT",
          license_url: "https://github.com/rigor789/vue-scrollto/blob/master/LICENSE",
          link: "https://github.com/rigor789/vue-scrollto"
        },
        {
          project: "Vuex",
          team: "Evan You",
          license: "MIT",
          license_url: "https://github.com/vuejs/vuex/blob/dev/LICENSE",
          link: "https://vuex.vuejs.org/"
        },
        {
          project: "vuex-shared-mutations",
          team: "Illya Klymov",
          license: "MIT",
          license_url: "https://github.com/xanf/vuex-shared-mutations/blob/master/LICENSE",
          link: "https://github.com/xanf/vuex-shared-mutations"
        },
        {
          project: "zxcvbn",
          team: "Dan Wheeler and Dropbox, Inc.",
          license: "MIT",
          license_url: "https://github.com/dropbox/zxcvbn/blob/master/LICENSE.txt",
          link: "https://github.com/dropbox"
        },
        {
          project: "Sentry Webpack Plugin",
          team: "Functional Software, Inc.",
          license: "MIT",
          license_url: "https://github.com/getsentry/sentry-webpack-plugin/blob/master/LICENSE",
          link: "https://github.com/getsentry/sentry-webpack-plugin"
        },
        {
          project: "Vue CLI",
          team: "Evan You",
          license: "MIT",
          license_url: "https://github.com/vuejs/vue-cli/blob/dev/LICENSE",
          link: "https://github.com/vuejs/vue-cli"
        },
        {
          project: "Babel",
          team: "Sebastian McKenzie",
          license: "MIT",
          license_url: "https://github.com/babel/babel/blob/main/LICENSE",
          link: "https://babeljs.io/"
        },
        {
          project: "ESLint",
          team: "OpenJS Foundation",
          license: "MIT",
          license_url: "https://github.com/eslint/eslint/blob/master/LICENSE",
          link: "https://eslint.org/"
        },
        {
          project: "eslint-plugin-vue",
          team: "Toru Nagashima",
          license: "MIT",
          license_url: "https://github.com/vuejs/eslint-plugin-vue/blob/master/LICENSE",
          link: "https://eslint.vuejs.org/"
        },
        {
          project: "Sass",
          team: "Sass team",
          license: "MIT",
          license_url: "https://github.com/sass/dart-sass/blob/master/LICENSE",
          link: "https://sass-lang.com/"
        },
        {
          project: "sass-loader",
          team: "JS Foundation",
          license: "MIT",
          license_url: "https://github.com/webpack-contrib/sass-loader/blob/master/LICENSE",
          link: "https://github.com/webpack-contrib/sass-loader"
        },
        {
          project: "Simple Parse Server SMTP Email Adapter",
          team: "Jose Luis",
          license: "MIT",
          license_url: "https://github.com/lcortess/simple-parse-smtp-adapter/blob/master/LICENSE",
          link: "https://github.com/lcortess/simple-parse-smtp-adapter"
        },
        {
          project: "parse-server-s3-adapter",
          team: "Parse Platform",
          license: "BSD",
          license_url: "https://github.com/parse-community/parse-server-s3-adapter/blob/master/LICENSE",
          link: "https://github.com/parse-community/parse-server-s3-adapter"
        },
        {
          project: "cross-env",
          team: "Kent C. Dodds",
          license: "MIT",
          license_url: "https://github.com/kentcdodds/cross-env/blob/master/LICENSE",
          link: "https://github.com/kentcdodds/cross-env"
        },
        {
          project: "jsonwebtoken",
          team: "Auth0, Inc.",
          license: "MIT",
          license_url: "https://github.com/auth0/node-jsonwebtoken/blob/master/LICENSE",
          link: "https://github.com/auth0/node-jsonwebtoken"
        },
        {
          project: "jwks-rsa",
          team: "Sandrino Di Mattia",
          license: "MIT",
          license_url: "https://github.com/auth0/node-jwks-rsa/blob/master/LICENSE",
          link: "https://github.com/auth0/node-jwks-rsa"
        },
        {
          project: "Nodemailer",
          team: "Andris Reinman",
          license: "MIT",
          license_url: "https://nodemailer.com/about/license/",
          link: "https://nodemailer.com/"
        },
        {
          project: "Nunjucks",
          team: "James Long",
          license: "BSD 2-Clause",
          license_url: "https://github.com/mozilla/nunjucks/blob/master/LICENSE",
          link: "https://mozilla.github.io/nunjucks/"
        },
        {
          project: "vuex-persistedstate",
          team: "Robin van der Vleuten",
          license: "MIT",
          license_url: "https://github.com/robinvdvleuten/vuex-persistedstate/blob/master/LICENSE",
          link: "https://github.com/robinvdvleuten/vuex-persistedstate"
        },
        {
          project: "vue-resize",
          team: "Guillaume Chau",
          license: "MIT",
          license_url: "https://opensource.org/licenses/MIT",
          link: "https://github.com/Akryum/vue-resize"
        },
        {
          project: "nanoid",
          team: "Andrey Sitnik",
          license: "MIT",
          license_url: "https://github.com/ai/nanoid/blob/master/LICENSE",
          link: "https://zelark.github.io/nano-id-cc/"
        },
        {
          project: "Vue Material Design Icon Components",
          team: "Rob Cresswell",
          license: "MIT",
          license_url: "https://github.com/robcresswell/vue-material-design-icons/blob/dev/LICENSE",
          link: "https://github.com/robcresswell/vue-material-design-icons"
        },
        {
          project: "bulma-timeline",
          team: "Wikiki",
          license: "MIT",
          license_url: "https://github.com/Wikiki/bulma-timeline/blob/master/LICENSE",
          link: "https://github.com/Wikiki/bulma-timeline"
        },
      ]
    }
  }
}
</script>