<template>
  <div id="app">
    <b-navbar
      fixed-top
      spaced
      shadow
      type="is-white"
    >
      <!-- Logo -->
      <template slot="brand">
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/' }"
        >
          MAVE Registry
        </b-navbar-item>
      </template>

      <!-- Left side: main functions -->
      <template slot="start">
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/projects' }"
        >
          MAVE Projects
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/teams' }"
        >
          Team Progress
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/nominations' }"
        >
          Nomination
        </b-navbar-item>
        <b-navbar-dropdown label="Info">
          <b-navbar-item
            tag="router-link"
            :to="{ path: '/about' }"
          >
            About
          </b-navbar-item>
          <b-navbar-item
            tag="router-link"
            :to="{ path: '/contact' }"
          >
            Contact
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <!-- Right side: user functions -->
      <template slot="end">
        <b-navbar-item tag="div">
          <b-button>Log in</b-button>
        </b-navbar-item>
      </template>
    </b-navbar>

    <!-- Component injection -->
    <router-view />

    <footer class="footer has-background-dark has-text-light">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <p>Copyright © 2020 MAVE Registry. All rights reserved.</p>
          </div>
          <div class="level-right">
            <p>About | Contact Us | Terms | Privacy</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="sass" scoped>
.footer
  padding: 3rem 1.5rem
.navbar-brand .is-active // Remove active style for the logo
  background-color: transparent !important
</style>