import React from "react";
import {Platform} from "react-native";
import LottieView from "lottie-react-native";
import * as Device from 'expo-device';
import {Layout, Spinner, withStyles} from '@ui-kitten/components';

const LottieLoaderComponent = ({themedStyle}) => (

    <Layout style={themedStyle.container}>
        {
            //(Platform.OS === 'ios') ? (
            (true) ? (
                <LottieView
                    style={{
                        width: 300,
                        aspectRatio: 300 / 600,
                        flexGrow: 1,
                        alignSelf: 'center',
                    }}
                    source={require('../../core/lottie/wave-loop-loading-v2.json')}
                    autoPlay loop
                />
            ) : (
                <Layout style={themedStyle.spinnerContainer}>
                    <Spinner
                        size='large'
                    />
                </Layout>
            )
        }

    </Layout>
);

export const LottieLoader = withStyles(LottieLoaderComponent, (theme) => {
    return ({
        container: {
            flex: 1,
        },
        spinnerContainer: {
            flex: 1,
            marginTop: 240,
            justifyContent: 'center',
            alignItems: 'center'
        }
    });
});