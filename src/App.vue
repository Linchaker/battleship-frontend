<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Logo from './components/Logo.vue'
import Menu from './components/UI/Menu.vue'
import Registration from './components/Auth/RegistrationForm.vue'
</script>

<template>
  <div class="container">
    <header>
      <Logo />
      <Menu />
    </header>
    <RouterView />
  </div>
</template>

<style scoped>
header {
  outline: 1px solid green;
}
</style>
