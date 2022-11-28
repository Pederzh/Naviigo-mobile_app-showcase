import React from "react";
import {logIn, logOut} from "../../actions/AuthActions";
import {useDispatch, useSelector} from "react-redux";
import Amplify, { API, Auth } from 'aws-amplify';
import { POOL_DATA } from '../../config/cognito.config';
import { CONFIG_DATA } from '../../config/amplify.config';

Amplify.configure(CONFIG_DATA);
const AuthContext = React.createContext();

export default ({children}) => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    if (authState.isLoading) {
        Auth.currentAuthenticatedUser().then(
            (user) => {
                let isHost = (user.attributes['custom:isHost'] == '1');
                let isComplete = (user.attributes['custom:isComplete'] == '1');
                // NB userId now is inside sub
                dispatch(logIn(user.username, user.attributes.email, user.attributes.given_name, user.attributes.family_name, isHost, isComplete));
            },
            (error) => {
                console.log(error);
                dispatch(logOut());
            }
        );
    }

    return (
        <AuthContext.Provider>
            {children}
        </AuthContext.Provider>
    );
};