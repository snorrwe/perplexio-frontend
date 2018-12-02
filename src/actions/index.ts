import axios from "axios";

export const REFRESH_GAMES = "REFRESH_GAMES";
export const REFRESH_CURRENT_GAME = "REFRESH_CURRENT_GAME";
export const REFRESH_CONFIG = "REFRESH_CONFIG";
export const REFRESH_NEW_GAME = "REFRESH_NEW_GAME ";
export const START_SELECTION = "START_SELECTION";
export const END_SELECTION = "END_SELECTION";
export const REFRESH_USER_INFO = "REFRESH_USER_INFO";

export const receiveUserInfo = (userinfo: any) =>{
    return {
        userinfo,
        type: REFRESH_USER_INFO
    }
};

export const receiveGames = (games: any) => {
  return {
    games,
    type: REFRESH_GAMES
  };
};

export const receiveCurrentGame = (game: any) => {
  return {
    game,
    type: REFRESH_CURRENT_GAME
  };
};

export const receiveConfig = (config: any) => {
  return {
    config,
    type: REFRESH_CONFIG
  };
};

export const receiveNewGameStatus = (game: any) => {
  return {
    game,
    type: REFRESH_NEW_GAME
  };
};

export interface IPuzzleNode {
  value: string;
  x: number;
  y: number;
}

export const startSelection = (node: IPuzzleNode) => {
  return {
    node,
    type: START_SELECTION
  };
};

export const endSelection = (node?: IPuzzleNode) => {
  return {
    node,
    type: END_SELECTION
  };
};

export const fetchGames = (config: any) => {
  if (!config || !config.apiBaseUrl) {
    return (dispatch: any) => {
      console.error("Failed to fetch game by id. Reason: no config");
    };
  }
  return (dispatch: any) => {
    axios
      .get(config.apiBaseUrl + "/games", { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          const games = response.data;
          dispatch(receiveGames(games));
        }
      });
  };
};

export const fetchGameById = (config: any, id: number) => {
  if (!config || !config.apiBaseUrl) {
    return (dispatch: any) => {
      console.error("Failed to fetch game by id. Reason: no config");
    };
  }
  return (dispatch: any) => {
    axios
      .get(config.apiBaseUrl + "/game/" + id, { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          const game = response.data;
          dispatch(receiveCurrentGame(game));
        }
      })
      .catch(error => {
        if (error && error.response && error.response.status === 404) {
          dispatch(receiveCurrentGame({ error: 404 }));
        }
        return Promise.reject(error);
      });
  };
};

export const submitNewGame = (config: any, name: string, words: string[]) => {
  return (dispatch: any) => {
    axios
      .post(
        config.apiBaseUrl + "/game",
        { name, words },
        { withCredentials: true }
      )
      .then(response => {
        dispatch(receiveNewGameStatus({ id: response.data }));
      })
      .catch(error => {
        dispatch(
          receiveNewGameStatus({
            error: (error.response && error.response.data) || "Unexpected error"
          })
        );
      });
  };
};

export const regenerateGame = (config: any, id: any) => {
  return (dispatch: any) => {
    axios
      .post(config.apiBaseUrl + "/games/regenerate_board/" + id, null, {
        withCredentials: true
      })
      .then(response => {
        if (response.status === 200) {
          const game = response.data;
          dispatch(receiveCurrentGame(game));
        }
      })
      .catch(error => {
        console.error("Failed to regenerate board", error);
      });
  };
};

export const clearNewGame = () => {
  return (dispatch: any) => {
    dispatch(receiveNewGameStatus(null));
  };
};
