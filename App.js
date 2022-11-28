import React, {useEffect} from 'react';
import AppNavigator from "./AppNavigator";
import {AuthProvider, PushNotificationProvider} from './src/providers';
import {Provider} from 'react-redux';
import store from './src/store/store';
import './src/localization/i18n';
// Before rendering any navigation stack: Optimize memory usage and performance react-native-navigation
import {enableScreens} from 'react-native-screens';
import {Keyboard, TouchableWithoutFeedback, View, LogBox, KeyboardAvoidingView} from "react-native";
import {InstantSearch} from 'react-instantsearch-native';
import algoliasearch from 'algoliasearch';

enableScreens();

const App = () => {

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`']);
        LogBox.ignoreAllLogs();
        }, []);

    return(
        // this should return only one element. React.Fragment allow you to wrap all in only one tag

        <Provider store={store}>
            <AuthProvider>
                <PushNotificationProvider>
                    {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                        <View style={{flex: 1}}>
                            <AppNavigator/>
                        </View>
                    {/* </TouchableWithoutFeedback> */}
                </PushNotificationProvider>
            </AuthProvider>
        </Provider>
    );
};

export default App;