<template>
  <div class="menu">
    <div v-if="currentUser" class="navbar-nav ml-auto">
        <div class="mb-2"><strong>Hi, {{ currentUser.name  }}!</strong></div>
        <div><RouterLink class="btn btn-secondary mb-3" to="/game">Play</RouterLink></div>
        <div><button class="btn btn-secondary" @click.prevent="logOut">Exit</button></div>
    </div>
  </div>
</template>


<script setup>
  import { RouterLink } from 'vue-router'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore  } from 'vuex'

  const router = useRouter()
  const store = useStore()

  const props = defineProps({
    currentUser: {
      required: true
    }
  })

  function logOut() {
    store.dispatch('auth/logout')
    router.push('auth/login')
  }

  onMounted(() => {
    console.log(`the component is now mounted.`)
    console.log(props.currentUser)
  })


</script>

<style scoped>
.menu {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  padding: 10px 0;
}

.menu div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 200px;
}
</style>
