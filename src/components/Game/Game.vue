<template>
  <div class="container">
    <div class="game-link">
      <RouterLink target="_blank" class="btn-primary mb-3" :to="{ name: 'gameWithId', params: { gameId: game ? game._id : '123' } }">Game ID:  {{ game ? game._id : '' }}</RouterLink>
    </div>
    <div class="game-wrapper">
      <div class="game-block">
      
      </div>
      <div class="game-block">
      
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Game',
  data() {
    return {
      game: null
    }
  },
  mounted() {
    this.game = JSON.parse('{"status":"not_started","ownerStatus":"not_ready","oponentStatus":"not_ready","data":{"ownerData":{"board":{"size":10,"hits":[],"occupied":[{"x":10,"y":10}]},"fleet":[{"size":1,"orientation":"x","position":{"x":10,"y":10},"state":[{"deck":1,"position":{"x":10,"y":10},"status":true}],"status":true},{"size":1,"orientation":"x","position":{"x":7,"y":2},"state":[{"deck":1,"position":{"x":7,"y":2},"status":true}],"status":true},{"size":1,"orientation":"x","position":{"x":3,"y":9},"state":[{"deck":1,"position":{"x":3,"y":9},"status":true}],"status":true},{"size":1,"orientation":"x","position":{"x":8,"y":9},"state":[{"deck":1,"position":{"x":8,"y":9},"status":true}],"status":true}]}},"_id":"6498624b9d9ab7f711962cc7"}')
    console.log(this.game);
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  }
}


// план
/**
 * создание игры и сохранение в стор
 * 
 * инициализация игры при переходе по ссылке
 * если это опонент, сохраняем его как апонента, если по ссылке перешел владелец, просто открываем игру
 * если опонент не залогинен, нужно редиректить его на игру после логина
 * 
 * кнопка готов
 * 
 * смена вида / начало игры при готов обоем пользователям
 * 
 */


</script>

<style scoped>
  .game-link {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .game-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .game-block {
    outline: 2px solid #bb1c32;
    display: flex;
    width: 30rem;
    height: 30rem;
  }
  
</style>
