const PEOPLE_INITIAL_STATE = {
    adultsCount: 0,
    childrenCount: 0,
    infantsCount: 0,
    totalCount: 0,
};

const LOCATION_INITIAL_STATE = {
    id: null,
    city: null,
    county: null,
    country: null,
    distance: null,
    longitude: null,
    latitude: null,
    northeast: {lat: null, lng: null},
    southwest: {lat: null, lng: null},
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    suggestions: [],
};

const GPS_LOCATION_INITIAL_STATE = {
    latitude: null,
    longitude: null,
    northeast: {lat: null, lng: null},
    southwest: {lat: null, lng: null},
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    city: null,
    country: null,
    isoCountryCode: null
};

const DATETIME_INITIAL_STATE = {
    startingDateTime: null,
    endingDateTime: null,
    startingDate: new Date(),
    endingDate: new Date(),
    timeRadioIndex: null,
};

export const counterReducer = (state = PEOPLE_INITIAL_STATE, action) => {
    switch (action.type) {
        case 'COUNT_INCREMENT':
            return {
                ...state,
                [action.counterType]: state[action.counterType] + 1,
                totalCount: state.totalCount + 1
            };
        case 'COUNT_DECREMENT':
            return {
                ...state,
                [action.counterType]: state[action.counterType] - 1,
                totalCount: state.totalCount - 1
            };
        default:
            return state;
    }
};

export const locationReducer = (state = LOCATION_INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOCATION_SET':
            return {
                ...state,
                city: action.payload?.city,
                country: action.payload?.country,
                longitude: action.payload?.longitude,
                latitude: action.payload?.latitude,
                northeast: action.payload?.northeast,
                southwest: action.payload?.southwest,
                latitudeDelta: (action.payload?.latitudeDelta) ? action.payload?.latitudeDelta : state.latitudeDelta,
                longitudeDelta: (action.payload?.longitudeDelta) ? action.payload?.longitudeDelta : state.longitudeDelta,
                suggestions: []
            };
        case 'LOCATION_UNSET':
            return {
                ...state,
                ...LOCATION_INITIAL_STATE
            };
        case 'SUGGESTIONS_SET':
            return {
                ...state,
                suggestions: action.payload,
            };
        default:
            return state;
    }
};

export const gpsLocationReducer = (state = GPS_LOCATION_INITIAL_STATE, action) => {
    switch (action.type) {
        case 'GPS_LOCATION_SET':
            return {
                ...state,
                longitude: action.payload?.position?.coords?.longitude,
                latitude: action.payload?.position?.coords?.latitude,
                city: action.payload?.locationInfo?.city,
                country: action.payload?.locationInfo?.country,
                isoCountryCode: action.payload?.locationInfo?.isoCountryCode,
            };
        case 'GPS_LOCATION_UNSET':
            return {
                ...state,
                ...GPS_LOCATION_INITIAL_STATE
            };
        default:
            return state;
    }
};

export const dateTimeReducer = (state = DATETIME_INITIAL_STATE, action) => {
    switch (action.type) {
        case 'DATE_SET':
            return {
                ...state,
                startingDate: action.payload?.startingDate,
                endingDate: action.payload?.endingDate,
            };
        case 'TIME_RADIO_SET':
            return {
                ...state,
                timeRadioIndex: action.index
            };
        case 'DATETIME_SET':
            return {
                ...state,
                startingDateTime: action.payload?.startingDateTime,
                endingDateTime: action.payload?.endingDateTime,
            };
        default:
            return state;
    }
};

//when you have multiple reducers
/*
const searchReducer = combineReducers({
    location: locationReducer,
    dateTime: dateTimeReducer,
    people: counterReducer,
});

export default searchReducer;
*/
