import {
    COUNT_DECREMENT,
    COUNT_INCREMENT,
    DATE_SET,
    DATETIME_SET,
    GPS_LOCATION_SET,
    GPS_LOCATION_UNSET,
    LOCATION_SET,
    LOCATION_UNSET,
    SUGGESTIONS_SET,
    TIME_RADIO_SET
} from "./types";

import store from '../store/store';

import * as ExpoLocation from "expo-location";
import {useTranslation} from "react-i18next";

//--- PEOPLE ---
export const countIncrement = (counterType) => ({
    type: COUNT_INCREMENT,
    counterType: counterType
});

export const countDecrement = (counterType) => ({
    type: COUNT_DECREMENT,
    counterType: counterType
});
//----------------

//--- LOCATION ---
export const locationSet = (payload) => ({
    type: LOCATION_SET,
    payload: payload,
});

export const locationUnset = () => ({
    type: LOCATION_UNSET,
});

export const suggestionsSet = (payload) => ({
    type: SUGGESTIONS_SET,
    payload: payload,
});

//TODO GET NORTHEST / SOUTHWEST
export const locationSetFromGps = () => {
    const gpsLocation = store.getState().gpsLocation;
    // This action returns a function
    // Redux Thunk sees that we are returning a function and it invokes it with dispatch
    return dispatch => {
        if (gpsLocation.city == null) {
            dispatch(getGpsLocation());
        }
        dispatch(locationSet(gpsLocation));
    }
};

export const gpsLocationSet = (payload) => ({
    type: GPS_LOCATION_SET,
    payload: payload,
});

export const gpsLocationUnset = () => ({
    type: GPS_LOCATION_UNSET
});

// This synchronous action returns an asynchronous action
export const getGpsLocation = () => {
    const { t } = useTranslation();
    // This action returns a function
    // Redux Thunk sees that we are returning a function and it invokes it with dispatch
    return dispatch => {
        ExpoLocation.requestPermissionsAsync().then((expoStatus) => {
            if (expoStatus.status !== 'granted') {
                alert('Permission to access location was denied');
            } else {
                ExpoLocation.getCurrentPositionAsync({})
                    .then((position) => {
                        ExpoLocation.reverseGeocodeAsync({
                            latitude: position?.coords.latitude,
                            longitude: position?.coords.longitude
                        }).then((locationInfo) => {
                            return {position, locationInfo: locationInfo[0]}
                        }).then(({position, locationInfo}) => {
                            dispatch(gpsLocationSet({position, locationInfo}))
                        })
                    })
            }
        });
    };
};
//----------------

//--- DATETIME ---
export const dateSet = (date) => {
    const datetimeState = store.getState().datetime;

    return dispatch => {
        dispatch({
            type: DATE_SET,
            payload: {
                //at the moment startingDate is equal to endingDate (for future compatibilities
                startingDate: date,
                endingDate: date
            }
        });

        //update the day if the time is already selected
        if (datetimeState.timeRadioIndex != null) {
            dispatch(timeSetByIndex(datetimeState.timeRadioIndex))
        }
    }
};

export const timeSetByIndex = (index) => {
    const datetimeState = store.getState().datetime;

    let startingDateTime = new Date(datetimeState.startingDate);
    let endingDateTime = new Date(datetimeState.endingDate);

    switch (index) {
        case 0:
            //all day
            startingDateTime.setHours(8, 30, 0);
            endingDateTime.setHours(19, 0, 0);
            break;
        case 1:
            //morning
            startingDateTime.setHours(8, 30, 0);
            endingDateTime.setHours(12, 59, 0);
            break;
        case 2:
            //afternoon
            startingDateTime.setHours(13, 0, 0);
            endingDateTime.setHours(19, 0, 0);
            break;
        default:
    }

    return dispatch => {
        dispatch({
            type: TIME_RADIO_SET,
            index: index,
        });
        dispatch(datetimeSet(startingDateTime, endingDateTime));
    }
};

const datetimeSet = (startingDateTime, endingDateTime) => ({
    type: DATETIME_SET,
    payload: {
        startingDateTime,
        endingDateTime,
    }
});