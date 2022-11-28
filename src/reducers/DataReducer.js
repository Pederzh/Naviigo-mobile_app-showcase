import { DATA_AVAILABLE } from "../actions/types" //Import the actions types constant we defined in our actions

let dataState = {
    data: []
};

export const dataReducer = (state = dataState, action) => {
    switch (action.type) {
        case DATA_AVAILABLE:
            return {
                ...state,
                data: action.data
            };
        default:
            return state;
    }
};

