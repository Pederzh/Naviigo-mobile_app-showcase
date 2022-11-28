import {LOGGING_IN, LOGGED_IN, LOGGED_OUT, CHANGE_MODE} from '../actions/types'
import {Analytics} from 'aws-amplify';

const INITIAL_STATE = {
    id: null,
    sub: null,
    email: null,
    name: null,
    surname: null,
    isLoading: true,
    isLoggingIn: false,
    isLoggedIn: false,
    isComplete: false,
    isHost: false,
    modeHost: false,
};

export const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGGING_IN:
            //console.log('logging in');
            return {
                ...state,
                isLoading: false,
                isLoggingIn: true,
                isLoggedIn: false,
                isHost: null,
                modeHost: false,
                isComplete: null,
                email: null,
                name: null,
                surname: null,
                sub: null,
                id: null,
            };
        case LOGGED_IN:
            //console.log('logged in');
            if(action.id != null) {
                Analytics.updateEndpoint({userId: "eu-west-1:" + action.id}).then((res) => {
                        //console.log('Endpoint updated with userId: ', action.id);
                    }
                ).catch((e) => console.warn('Error on update userId, log: ', e));
            }
            return {
                ...state,
                isLoading: false,
                isLoggingIn: false,
                isLoggedIn: true,
                isHost: !!action.isHost,
                modeHost: !!action.isHost,
                isComplete: action.isComplete,
                name: action.name,
                surname: action.surname,
                email: action.email,
                id: action.id,
            };
        case LOGGED_OUT:
            //console.log('log out');
            return {
                ...state,
                isLoading: false,
                isLoggingIn: false,
                isLoggedIn: false,
                isHost: null,
                modeHost: null,
                isComplete: null,
                email: null,
                name: null,
                surname: null,
                sub: null,
                id: null,
            };
        case CHANGE_MODE:
            return {
                ...state,
                modeHost: (state.isHost) ? !state.modeHost : state.modeHost,
            };
        default: 
            return state;
    }
};
