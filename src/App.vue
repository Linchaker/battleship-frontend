<template>
  <div class="container">
    <header>
      <Logo />
      <Menu :currentUser="currentUser" :gameStatus="gameStatus" />
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
    gameStatus() {
      return this.$store.state.play.status.gameStatus;
    },
  }
}
</script>

<style scoped>
</style>
