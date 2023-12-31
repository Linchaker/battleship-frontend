import { Axios } from '@/services/axios'
import authHeader from './auth-header'

class GameService {

  createGame() {
    return Axios
      .post('/play', [], { headers: authHeader() })
      .then(response => {
        console.log('hery 4');
        if (response.data.game) {
          localStorage.setItem('game', JSON.stringify(response.data.game));
        }
        return response.data.game;
      });
  }

  findGame(gameId) {
    return Axios
      .get('/play/' + gameId, { headers: authHeader() })
      .then(response => {
        if (response.data.game) {
          localStorage.setItem('game', JSON.stringify(response.data.game));
        }
        return response.data.game;
      });
  }

  shot(data) {
    return Axios
      .post('/play/shot', data, { headers: authHeader() })
      .then(response => {
        if (response.data.game) {
          localStorage.setItem('game', JSON.stringify(response.data.game));
        }
        return response.data.game;
      });
  }

}

export default new GameService();
