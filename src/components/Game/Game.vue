<template>
  <div class="container">
    <div class="game-link">
      <RouterLink target="_blank" class="btn-primary mb-3" :to="{ name: 'game', params: { gameId: game ? game._id : '' } }">Game ID:  {{ game ? game._id : '' }}</RouterLink>
    </div>
    <div class="game-wrapper">
      <div class="game-block">
        <div
          v-for="row in boardSize"
          :key="row"
          class="row"
        >
          <div
            v-for="col in boardSize"
            :key="col"
            :class="getCellClass(row, col)"
          >
          </div>
        </div>
      </div>
      <div class="game-block">
        <div
          v-for="row in boardSize"
          :key="row"
          class="row"
        >
          <div
            v-for="col in boardSize"
            :key="col"
            class="cell"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Game',
  data() {
    return {
      game: null,
      cells: [1,2,3,4,5,6,7,8,9,10],
    }
  },
  mounted() {
    const gameId = this.$route.params.gameId;
    if (this.$store.state.play.status.gameIsset) {
      this.game = this.$store.state.play.game
    } else {
      if (gameId) {
        this.findGame(gameId)
      } else {
        this.startGame()
      }
    }
    
    // this.game = JSON.parse('{"status":"not_started","ownerStatus":"not_ready","oponentStatus":"not_ready","data":{"ownerData":{"board":{"size":10,"hits":[],"occupied":[{"x":10,"y":10}]},"fleet":[{"size":1,"orientation":"x","position":{"x":10,"y":10},"state":[{"deck":1,"position":{"x":10,"y":10},"status":true}],"status":true},{"size":1,"orientation":"x","position":{"x":7,"y":2},"state":[{"deck":1,"position":{"x":7,"y":2},"status":true}],"status":true},{"size":1,"orientation":"x","position":{"x":3,"y":9},"state":[{"deck":1,"position":{"x":3,"y":9},"status":true}],"status":true},{"size":1,"orientation":"x","position":{"x":8,"y":9},"state":[{"deck":1,"position":{"x":8,"y":9},"status":true}],"status":true}]}},"_id":"6498624b9d9ab7f711962cc7"}')
    // console.log(this.game);
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    boardSize() {
      return this.game ? this.game.data.ownerData.board.size : 10
    },
    userGameData() {
      if (!this.game) {
        return "";
      }

      if (this.game.ownerUserId === this.currentUser._id) {
        return this.game.data.ownerData
      } else {
        return this.game.data.oponentData
      }
    }
  },
  watch: {
    game: {
      immediate: true, // Вызвать хэндлер при создании компонента
      handler(newValue, oldValue) {
        // Проверяем, что игровые данные заполнены (например, у нас есть поля deck, hit, miss)
        if (newValue && newValue.data && newValue.data.ownerData) {
          // Вызываем getCellClass для обновления стилей клеток
          this.getCellClass();
        }
      },
    },
  },
  methods: {
    startGame() {
      this.$store.dispatch('play/createGame').then(
            (game) => {
              console.log(game);
              this.game = game
            },
            error => console.log(error)
          );
    },
    findGame(gameId) {
      this.$store.dispatch('play/findGame', gameId).then(
            (game) => {
              console.log(game);
              this.game = game
            },
            error => console.log(error)
          );
    },
    hasDeck(row, col, fleet, isHit = false) {
      for (const ship of fleet) {
        for (const deck of ship.state) {
          if (deck.position.x === row && deck.position.y === col) {
            if (isHit) {
              if (!deck.status) {
                return true;
              }
            } else {
              if (deck.status) {
                return true;
              }
            }
          }
        }
      }
      
      return null;
    },
    getCellClass(row, col) {
      if (!this.game) {
        return "";
      }

  
      let fleet = this.userGameData.fleet;
      
      const isHit = false
      const isMiss = false;

      if (this.hasDeck(row, col, fleet, true)) {
        return "cell deck hit";
      } else if (this.hasDeck(row, col, fleet)) {
        return "cell deck";
      } else if (isMiss) {
        return "cell miss";
      } else {
        return "cell";
      }
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

.row {
  display: flex;
  margin: 0;
  padding: 0;
}

.cell {
  flex: 1;
  border: 1px solid #ccc;
}

.cell.deck {
  background-color: #999;
}

.cell.hit {
  background-color: #bb1c32;
}

.cell.miss {
  background-color: #ccc;
}
  
</style>
