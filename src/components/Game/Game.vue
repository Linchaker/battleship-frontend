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
            class="cell oponent-board"
            @click="shot(row, col)"
            :class="getOponentCellClass(row, col)"
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
    ownerGameData() {
      if (!this.game) {
        return "";
      }

      if (this.game.ownerUserId === this.currentUser._id) {
        return this.game.data.ownerData
      } else {
        return this.game.data.oponentData
      }
    },
    oponentGameData() {
      if (!this.game) {
        return "";
      }

      if (this.game.ownerUserId === this.currentUser._id) {
        return this.game.data.oponentData
      } else {
        return this.game.data.ownerData
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
              this.game = game
            },
            error => console.log(error)
          );
    },
    findGame(gameId) {
      this.$store.dispatch('play/findGame', gameId).then(
            (game) => {
              this.game = game
            },
            error => console.log(error)
          );
    },
    shot(row, col) {
      const position = {x: row, y: col}
      const data = {
        gameId: this.game._id,
        position
      }
      
      this.$store.dispatch('play/shot', data).then(
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

    hasHit(row, col, board) {
      for (const hit of board.hits) {
        if (hit.x === row && hit.y === col) {
          return true;
        }
      }
      
      return null;
    },

    getCellClass(row, col) {
      if (!this.game) {
        return "";
      }

  
      let fleet = this.ownerGameData.fleet;
      let board = this.ownerGameData.board;
      
      let classStyles = "cell"

      if (this.hasDeck(row, col, fleet, true)) {
        classStyles += " deck hit";
      } else if (this.hasDeck(row, col, fleet)) {
        classStyles += " deck";
      }

      if (this.hasHit(row, col, board)) {
        classStyles += " hit"
      }

      return classStyles
    },
    getOponentCellClass(row, col) {
      if (!this.game) {
        return "";
      }

  
      let fleet = this.oponentGameData.fleet;
      let board = this.oponentGameData.board;
      
      let classStyles = "cell"

      if (this.hasDeck(row, col, fleet, true)) {
        classStyles += " deck hit hit-enemy";
      }

      if (this.hasHit(row, col, board)) {
        classStyles += " hit"
      }

      return classStyles
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
    margin-top: 20px;
  }
  .game-block {
    outline: 20px solid #f5f5f5;
    display: flex;
    width: 30rem;
    height: 30rem;
    background-color: #f5f5f5;
  }

.row {
  display: flex;
  margin: 0;
  padding: 0;
}

.cell {
  flex: 1;
  border: 1px solid #9cbed1;
}

.oponent-board {
  cursor: pointer;
}

.cell.deck {
  background-color: #085486;
}



.cell.deck.hit {
  background-color: #832634;
}

.cell.hit {
  background-color: #aaaaaa;
  position: relative;
}
.cell.hit-enemy {
  background-color: #217925 !important;
}

.cell.hit::before,
.cell.hit::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 2px;
  background-color: white;
}

.cell.hit::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.cell.hit::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
  
</style>
