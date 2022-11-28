import {LOGGING_IN, LOGGED_IN, LOGGED_OUT, CHANGE_MODE} from "./types";
import store from "../store/store";

export const loggingIn = () => ({
    type: LOGGING_IN,
});

export const logIn = (id, email, name, surname, isHost, isComplete) => ({
    type: LOGGED_IN,
    id: id,
    email: email,
    name: name,
    surname: surname,
    isHost: isHost,
    isComplete: isComplete,
});

export const logOut = () => ({
    type: LOGGED_OUT,
});

export const changeMode = () => ({
    type: CHANGE_MODE,
});