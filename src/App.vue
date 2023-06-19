<template>
  <div class="container">
    <header>
      <Logo />
      <Menu :currentUser="currentUser" />
    </header>
    <RouterView />
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import Logo from '@/components/Logo.vue'
import Menu from '@/components/UI/Menu.vue'

export default {
  components: {
    Menu, Logo
  },
  name: 'App',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  }
}
</script>

<style scoped>
</style>
