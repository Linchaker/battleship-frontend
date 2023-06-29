import { Axios } from '@/services/axios'
import authHeader from './auth-header'

class GameService {

  createGame() {
    return Axios
      .post('/play', { headers: authHeader() })
      .then(response => {
        if (response.data.game) {
          localStorage.setItem('game', JSON.stringify(response.data.game));
        }
        return response.data;
      });
  }

  findGame(gameId) {
    return Axios
      .get('/play/' + gameId, { headers: authHeader() })
      .then(response => {
        if (response.data.game) {
          localStorage.setItem('game', JSON.stringify(response.data.game));
        }
        return response.data;
      });
  }

}

export default new GameService();
