import { combineReducers } from "redux";
import {
  START_SELECTION,
  END_SELECTION,
  REFRESH_CONFIG,
  REFRESH_SOLUTIONS,
  REFRESH_CURRENT_GAME,
  REFRESH_GAMES,
  REFRESH_NEW_GAME,
  REFRESH_USER_INFO,
  REFRESH_HOVERED_NODE,
  REFRESH_VALIDATION,
  REFRESH_UPDATE_FORM,
  REFRESH_GAME_ERROR
} from "../actions";

const refreshHoverReducer = (state = null, action: any) => {
  if (action.type === REFRESH_HOVERED_NODE) {
    return action.node;
  }
  return state;
};

const refreshUserInfoReducer = (state = null, action: any) => {
  switch (action.type) {
    case REFRESH_USER_INFO:
      return action.userinfo;
    default:
      return state;
  }
};

const refreshGamesReducer = (state = [], action: any) => {
  switch (action.type) {
    case REFRESH_GAMES:
      return action.games;
    default:
      return state;
  }
};

const refreshCurrentGameReducer = (state: any = null, action: any) => {
  switch (action.type) {
    case REFRESH_CURRENT_GAME:
      return action.game;
    case REFRESH_GAME_ERROR:
      if (!state) {
        state = {};
      }
      state.error = action.error;
      return JSON.parse(JSON.stringify(state));
    default:
      return state;
  }
};

const refreshConfigReducer = (state = null, action: any) => {
  switch (action.type) {
    case REFRESH_CONFIG:
      return action.config;
    default:
      return state;
  }
};

const refreshNewGameReducer = (state = null, action: any) => {
  switch (action.type) {
    case REFRESH_NEW_GAME:
      return action.game;
    default:
      return state;
  }
};

const selectionReducer = (state: any[] = [], action: any) => {
  switch (action.type) {
    case START_SELECTION:
      return [action.node, null];
    case END_SELECTION:
      if (action.node && state[0]) {
        state = [state[0], action.node];
        return state;
      } else {
        return [];
      }
    default:
      return state;
  }
};

const validationReducer = (state = null, action: any) => {
  switch (action.type) {
    case START_SELECTION:
      return false;
    case REFRESH_VALIDATION:
      return action.ok;
    default:
      return state;
  }
};

const solutionsReducer = (state = [], action: any) => {
  switch (action.type) {
    case REFRESH_CURRENT_GAME:
      return action.game && action.game.table && action.game.table.solutions || state;
    case REFRESH_SOLUTIONS:
      return action.solutions;
    default:
      return state;
  }
};

const updateFormReducer = (state = null, action: any) => {
  switch (action.type) {
    case REFRESH_UPDATE_FORM:
      return action.formData;
    case REFRESH_CURRENT_GAME:
      if (!action.game || !action.game.id) {
        return null;
      }
      let id = action.game.id;
      return {
        id: id.id,
        name: id.name,
        availableFrom: id.availableFrom,
        availableTo: id.availableTo
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  config: refreshConfigReducer,
  currentGame: refreshCurrentGameReducer,
  games: refreshGamesReducer,
  newGameStatus: refreshNewGameReducer,
  currentSelection: selectionReducer,
  userinfo: refreshUserInfoReducer,
  hover: refreshHoverReducer,
  lastWasValid: validationReducer,
  solutions: solutionsReducer,
  updateForm: updateFormReducer
});

export default rootReducer;
