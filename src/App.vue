<template>
  <div id="app">
    <Navbar />
    <Index />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Index from './Index.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Index
  }
}
</script>

