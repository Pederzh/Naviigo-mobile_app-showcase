import React, {useState, useEffect, useRef} from 'react'
import {Alert, Clipboard, Platform} from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
//import PushNotification from '@aws-amplify/pushnotification';
import {Analytics} from 'aws-amplify';
import {useSelector} from "react-redux";

const PushNotificationContext = React.createContext();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});


export default ({children}) => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const userId = useSelector((state) => state.auth.id);
    const notificationListener = useRef();
    const responseListener = useRef();

    const copyAlertMessage = async (msg) => {
        Clipboard.setString(msg)
    };

    const registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            //const token = (await Notifications.getExpoPushTokenAsync()).data; //with expo
            const token =  (await Notifications.getDevicePushTokenAsync()).data; //without expo
            Analytics.updateEndpoint({userId: "eu-west-1:" + userId, address: token}).then(() => {
                // Alert.alert(
                //     "Endpoint updated with this Device Token",
                //     'Endpoint updated with token:' + token + ' | Endpoint updated with userId: ' + userId,
                //     [
                //         {
                //             text: "Cancel",
                //             style: "cancel"
                //         },
                //         {text: 'Copy Token', onPress: () => copyAlertMessage(token), style: 'cancel'}
                //     ],
                //     { cancelable: false }
                // );
                }
            ).catch((e) => {
                Alert.alert(
                    "ERROR Device Token endpoint update",
                    e,
                    [
                        {
                            text: "Cancel",
                            style: "cancel"
                        },
                        {text: 'Copy Token', onPress: () => copyAlertMessage(token), style: 'cancel'}
                    ],
                    { cancelable: false }
                );
                console.warn('Error on update token, log: ', e)
            });
            // Alert.alert(
            //     "Device Token",
            //     token,
            //     [
            //         {
            //             text: "Cancel",
            //             style: "cancel"
            //         },
            //         {text: 'Copy Token', onPress: () => copyAlertMessage(token), style: 'cancel'}
            //     ],
            //     { cancelable: false }
            // );
            setExpoPushToken({ expoPushToken: token });
        } else {
            //console.log('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };

    useEffect(() => {
        if(userId == null) return;

        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {

            //todo remove: just for test
            Alert.alert(
                "This listener is fired whenever a user taps on or interacts with a notification",
                response,
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {text: 'Ok', onPress: () => console.log(response), style: 'cancel'}
                ],
                { cancelable: false }
            );

        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, [userId]);

    return (
        <PushNotificationContext.Provider>
            {children}
        </PushNotificationContext.Provider>
    );
}
