import {BOAT_DATA_SET, BOAT_BOOKING_INFO_SET, BOAT_UNSET} from "./types";

export const dataSet = (data) => ({
    type: BOAT_DATA_SET,
    data: data
});

export const bookingInfoSet = (payload) => ({
    type: BOAT_BOOKING_INFO_SET,
    payload: payload
});

export const boatUnset = () => ({
    type: BOAT_UNSET
});