import React from 'react';
import { WebView } from 'react-native-webview';
import { STRIPE } from '../settings/stripeSettings';
import { stripeCheckoutRedirectHTML } from './payment/stripeCheckout';
import {SafeAreaView} from "react-native";
import {API} from 'aws-amplify';
import Toast from "react-native-toast-message";
import {BOOKING_CATEGORY_STANDARD} from "../utils/constraints";

export const PaymentScreen = (props) => {
    const {navigation, route} = props;
    const user = { id: route?.params?.reservation?.body?.guestUsername };

    const onSuccessHandler = () => {
        API.post("naviigo_api", `/reservation-engine/create`, route?.params?.reservation)
            .then(
                () => {
                    Toast.show({
                        text1: `Boat reservation request done`,
                        text2: (route?.params?.reservation?.body?.category === BOOKING_CATEGORY_STANDARD) ? `You have to wait for the host to accept or deny your reservation`
                            : `Host has confirmed your reservation, enjoy!`
                    });
                    props.navigation.navigate("BookingConfirmationScreen");
                }
            )
            .catch(error => {
                Toast.show({text1: `Something went wrong`, text2: `Error: ${error.message}`, type: "error"});
                props.navigation.navigate("BookingFailedScreen");
            });
    };

    const onCanceledHandler = () => { navigation.navigate("BookingFailedScreen")};

    // Called everytime the URL stats to load in the webview
    const onLoadStart = (syntheticEvent) => {

        const { nativeEvent } = syntheticEvent;

        if (nativeEvent.url === STRIPE.SUCCESS_URL) {
            onSuccessHandler();
            return;
        }
        if (nativeEvent.url === STRIPE.CANCELED_URL) {
            onCanceledHandler();
        }
    };

    // Render
    if (!user) {
        return null;
    }

    return (
        <SafeAreaView style={{flex: 1}}>
        <WebView
            originWhitelist={['*']}
            source={{ html: stripeCheckoutRedirectHTML(user.id) }}
            onLoadStart={onLoadStart}
        />
        </SafeAreaView>
    );

};