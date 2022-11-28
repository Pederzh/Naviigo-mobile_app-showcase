import {BOAT_BOOKING_INFO_SET, BOAT_DATA_SET, BOAT_UNSET, DATA_AVAILABLE} from "../actions/types";

const BOAT_INITIAL_STATE = {
    data: null,
    bookingInfo: null,
};

export const boatReducer = (state = BOAT_INITIAL_STATE, action) => {
    switch (action.type) {
        case BOAT_DATA_SET:
            return {
                ...state,
                data: action.data
            };
        case BOAT_BOOKING_INFO_SET:
            return {
                ...state,
                bookingInfo: action.payload
            };
        case BOAT_UNSET:
            return {
                ...state,
                ...BOAT_INITIAL_STATE
            };
        default:
            return state;
    }
};