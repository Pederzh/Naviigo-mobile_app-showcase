import {SET_LIGHT, SET_DARK} from '../actions/types'
import { light as lightTheme, dark as darkTheme } from '@eva-design/eva';

const INITIAL_STATE = {
    name: 'light',
    theme: lightTheme,
};

export const themeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_LIGHT:
            return {
                ...state,
                name: 'light',
                theme: lightTheme,
            };
        case SET_DARK:
            return {
                ...state,
                name: 'dark',
                theme: darkTheme,
            };
        default: 
            return state;
    }
};
