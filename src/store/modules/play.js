import GameService from '@/services/game.service';

const game = JSON.parse(localStorage.getItem('game'));

const initialState = game
  ? { status: { gameIsset: true, gameStatus: game.status }, game }
  : { status: { gameIsset: false, gameStatus: false }, game: null };

  export const play = {
    namespaced: true,
    state: initialState,
    actions: {
      createGame({ commit }) {
        return GameService.createGame().then(
          game => {
            console.log('hery 3');
            commit('createGameSuccess', game);
            return Promise.resolve(game);
          },
          error => {
            commit('createGameFailure');
            return Promise.reject(error);
          }
        );
      },
      findGame({ commit }, gameId) {
        return GameService.findGame(gameId).then(
          game => {
            commit('findGameSuccess', game);
            return Promise.resolve(game);
          },
          error => {
            commit('findGameFailure');
            return Promise.reject(error);
          }
        );
      },
      shot({ commit }, data) {
        return GameService.shot(data).then(
          game => {
            commit('shotSuccess', game);
            return Promise.resolve(game);
          },
          error => {
            return Promise.reject(error);
          }
        );
      },

      updateGame({ commit }, game) {
        localStorage.setItem('game', JSON.stringify(game));
        commit('updateGameSuccess', game);
      },
      clearGame({ commit }) {
        localStorage.removeItem('game');
        commit('clearGameSucces');
      },
    },
    mutations: {
      createGameSuccess(state, game) {
        state.status.gameIsset = true;
        state.status.gameStatus = game.status;
        state.game = game;
      },
      createGameFailure(state) {
        state.status.gameIsset = false;
        state.status.gameStatus = false;
        state.game = null;
      },
      findGameSuccess(state, game) {
        state.status.gameIsset = true;
        state.status.gameStatus = game.status;
        state.game = game;
      },
      findGameFailure(state) {
        state.status.gameIsset = false;
        state.status.gameStatus = false;
        state.game = null;
      },
      shotSuccess(state, game) {
        state.status.gameIsset = true;
        state.status.gameStatus = game.status;
        state.game = game;
      },
      updateGameSuccess(state, game) {
        state.status.gameIsset = true;
        state.status.gameStatus = game.status;
        state.game = game;
      },
      clearGameSucces(state) {
        state.status.gameIsset = false;
        state.status.gameStatus = false;
        state.game = null;
      },
    }
  };