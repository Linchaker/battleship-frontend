import GameService from '@/services/game.service';

const game = JSON.parse(localStorage.getItem('game'));

const initialState = game
  ? { status: { gameIsset: true}, game }
  : { status: { gameIsset: false }, game: null };

  export const play = {
    namespaced: true,
    state: initialState,
    actions: {
      createGame({ commit }) {
        return GameService.createGame().then(
          game => {
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
    },
    mutations: {
      createGameSuccess(state, game) {
        state.status.gameIsset = true;
        state.game = game;
      },
      createGameFailure(state) {
        state.status.gameIsset = false;
        state.game = null;
      },
      findGameSuccess(state, game) {
        state.status.gameIsset = true;
        state.game = game;
      },
      findGameFailure(state) {
        state.status.gameIsset = false;
        state.game = null;
      },
    }
  };