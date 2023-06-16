<script setup>
  import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="menu">
    <RouterLink class="btn btn-secondary me-2" to="/">Home</RouterLink>
    <RouterLink class="btn btn-secondary" to="/about">About</RouterLink>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  padding: 10px 0;
  outline: 2px solid salmon;
}
</style>
