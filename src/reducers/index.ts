import { combineReducers } from "redux";
import {
    START_SELECTION,
    END_SELECTION,
    REFRESH_CONFIG,
    REFRESH_CURRENT_GAME,
    REFRESH_GAMES,
    REFRESH_NEW_GAME
} from "../actions";

const refreshGamesReducer = (state = [], action: any) => {
    switch (action.type) {
        case REFRESH_GAMES:
            return action.games;
        default:
            return state;
    }
};

const refreshCurrentGameReducer = (state = null, action: any) => {
    switch (action.type) {
        case REFRESH_CURRENT_GAME:
            return action.game;
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
                // TODO: validate answer
                state = [state[0], action.node];
                state.sort((a: any, b: any) => a.x - b.x || a.y - b.y);
                let toValidate = state.map(value => {
                    return { x: value.x, y: value.y };
                });
                console.log("Validate", toValidate);
                return state;
            } else {
                // Cancel
                return [];
            }
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    config: refreshConfigReducer,
    currentGame: refreshCurrentGameReducer,
    games: refreshGamesReducer,
    newGameStatus: refreshNewGameReducer,
    currentSelection: selectionReducer
});

export default rootReducer;
