<template>
  <div></div>
</template>

<script>

export default {
  mounted() {
    let user = this.$route.query.user;
    if (user) {
      try {
        user = JSON.parse(user)
      } catch (error) {
        user = null
      }
      
    }
    const data = {
      token: this.$route.query.token,
      user
    }

    this.loginRequest(data)
  },
  
  methods: {
    loginRequest(data) {

      this.$store.dispatch('auth/loginGoogle', data).then(
            () => {
              let gameId = localStorage.getItem('gameId')
              if (gameId) {
                localStorage.removeItem('gameId')
                this.$router.push({ name: 'game', params: { gameId }})
              } else {
                this.$router.push('/');
              }
            },
            error => {
              if (error.response && error.response.data) {
                console.log('google auth error');
              }
            }
          );
    }
  }
};
</script>
