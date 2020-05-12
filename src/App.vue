<template>
  <div id="app">
    <Navbar />
    <Index />
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Index from './Index.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Index,
    Footer
  }
}
</script>

