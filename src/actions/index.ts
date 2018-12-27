import axios from "axios";
export * from "./games";

export const START_SELECTION = "START_SELECTION";
export const END_SELECTION = "END_SELECTION";
export const REFRESH_USER_INFO = "REFRESH_USER_INFO";
export const REFRESH_HOVERED_NODE = "REFRESH_HOVERED_NODE";
export const REFRESH_SOLUTIONS = "REFRESH_SOLUTIONS";
export const REFRESH_VALIDATION = "REFRESH_VALIDATION";
export const REFRESH_UPDATE_FORM = "REFRESH_UPDATE_FORM";

export const receiveHoveredNode = (node: any) => {
  return {
    node,
    type: REFRESH_HOVERED_NODE
  };
};

export const receiveUserInfo = (userinfo: any) => {
  return {
    userinfo,
    type: REFRESH_USER_INFO
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

export const fetchSolutionsByGameId = (config: any, gameId: number) => {
  return (dispatch: any) => {
    axios
      .get(config.apiBaseUrl + "/solutions/" + gameId, {
        withCredentials: true
      })
      .then(response => {
        console.log("boi", response);
        dispatch(receiveSolutions(response.data));
      })
      .catch(error => {
        console.error("Failed to get solutions", error);
      });
  };
};

export const receiveSolutions = (solutions: any[]) => {
  return {
    solutions,
    type: REFRESH_SOLUTIONS
  };
};

export const validateSolution = (
  config: any,
  solution: any,
  gameId: number
) => {
  return (dispatch: any) => {
    solution = solution
      .map((a: any) => Object({ x: a.x, y: a.y }))
      .sort((a: any, b: any) => a.x - b.x || a.y - b.y);
    axios
      .post(config.apiBaseUrl + "/solutions/" + gameId, [solution], {
        withCredentials: true
      })
      .then(response => {
        let ok = response.data[0];
        if (ok) {
          dispatch(fetchSolutionsByGameId(config, gameId));
        }
        dispatch(refreshValidation(solution, ok));
      })
      .catch(error => {
        console.error(
          "You forgot to implement the error handling, Ding Dong",
          error
        );
      });
    return {
      type: null
    };
  };
};

export const refreshValidation = (solution: any, ok: boolean) => {
  return {
    solution,
    ok,
    type: REFRESH_VALIDATION
  };
};

export const updateGame = (config: any, gameId: any) => {
  axios
    .put(config.apiBaseUrl + "/game/" + gameId.id, gameId, {
      withCredentials: true
    })
    .then(response => {
      console.log("Boi");
    })
    .catch(error => {
      console.error("Bruh");
    });
  return {
    type: null
  };
};

export const refreshUpdateGameForm = (formData: any) => {
  return {
    formData,
    type: REFRESH_UPDATE_FORM
  };
};
