<template>
  <div class="container">
    <div class="game-link">
      <RouterLink target="_blank" class="btn-primary mb-3" :to="{ name: 'game', params: { gameId: game ? game._id : '' } }">Game ID:  {{ game ? game._id : '' }}</RouterLink>
    </div>
    <div class="game-wrapper">
      <div v-if="gameState.status == 'started'" class="game-block">
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

      <div v-else class="game-block">
          <user-status :status="gameState.ownerStatus" :onwerBlock="true" @setReady="handleSetReady"></user-status>
      </div>

      <div v-if="gameState.status == 'started'" class="game-block">
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

      <div v-else class="game-block">
        <user-status :status="gameState.oponentStatus" :onwerBlock="false"></user-status>
      </div>
    </div>
  </div>
</template>

<script>

import io from 'socket.io-client';
import authHeader from '@/services/auth-header'
import UserStatus from '@/components/Game/UserStatus.vue';

export default {
  name: 'Game',
  components: {
    UserStatus
  },
  data() {
    return {
      game: null,
      state: {
        oponentStatus:"not_ready",
        ownerStatus: "not_ready",
        status: "not_started",
      },
      socket: null,
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


    this.socket = io(import.meta.env.VITE_APP_SOCKET_URL, {
      auth: {
        token: authHeader().Authorization
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');


      this.socket.emit('joinGame', {gameId: this.game?._id ? this.game._id : gameId });
    });

    this.socket.on('gameUpdate', (game) => {
      console.log('Updated game state:', game);
      this.game = game
      this.$store.dispatch('play/updateGame', game)
    });

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
    },
    gameState() {
      if (!this.game) {
        return this.state;
      }

      this.state.status = this.game.status

      if (this.game.ownerUserId === this.currentUser._id) {
        this.state.oponentStatus = this.game.oponentStatus ?? "not_ready"
        this.state.ownerStatus = this.game.ownerStatus
      } else {
        this.state.oponentStatus = this.game.ownerStatus
        this.state.ownerStatus = this.game.oponentStatus
      }

      console.log(this.state);
      return this.state
    }

  },
  watch: {
    game: {
      immediate: true, // Вызвать хэндлер при создании компонента
      handler(newValue, oldValue) {
        if (newValue && newValue.data && newValue.data.ownerData) {
          // call getCellClass for update board
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
      
      this.socket.emit("playerShot",data, (response) => {
        if (response.success) {
          console.log(response.message);
        } else {
          console.error("Ошибка выстрела:", response);
        }
      });
      
      // old logic
      // this.$store.dispatch('play/shot', data).then(
      //       (game) => {
      //         console.log(game);
      //         this.game = game
      //       },
      //       error => console.log(error)
      //     );
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
      if (!this.game || !this.oponentGameData) {
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
    
    handleSetReady() {
      const data = {
        gameId: this.game._id,
      }
      this.socket.emit('setReady', data)
    }
  }
}


// план
/**
 
 * кнопка готов
 * 
 * смена вида / начало игры при готов обоем пользователям
 * 
 * 
 * сокеты
 * 
 * очередность ходов и статусы игры
 * 
 * кнопка сдаться
 * 
 * win/lost
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
