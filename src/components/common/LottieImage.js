import React from "react";
import {Platform} from "react-native";
import LottieView from "lottie-react-native";
import {Layout, withStyles} from '@ui-kitten/components';

const lottieImg = (type) => {
    switch (type) {
        case 'form-add-info':
            return (require('../../core/lottie/edit-pen.json'));
        case 'form-add-settings':
            return (require('../../core/lottie/tune-settings.json'));
        case 'form-set-map':
            return (require('../../core/lottie/set-map.json'));
        case 'form-add-image':
            return (require('../../core/lottie/add-image.json'));
        case 'form-end':
            return (require('../../core/lottie/clap-hands.json'));
        case 'empty-status':
            return (require('../../core/lottie/empty-status-1.json'));
        case 'success-status':
            return (require('../../core/lottie/success.json'));
        case 'error-status':
            return (require('../../core/lottie/error-dog.json'));
        default:
            return (null)
    }
};

const LottieImageComponent = ({themedStyle, type, loop, aspectRatio}) => (

    <Layout style={themedStyle.container}>
        {
            (Platform.OS === 'ios' && lottieImg(type) != null) ? (
                <LottieView
                    style={{
                        flexGrow: 1,
                        width: 120,
                        aspectRatio: (aspectRatio) ? aspectRatio : 1,
                        alignSelf: 'center',
                    }}
                    source={lottieImg(type)}
                    autoPlay
                    loop={loop != null ? loop : true}
                />
            ) : (
                <Layout style={themedStyle.spinnerContainer}>
                </Layout>
            )
        }

    </Layout>
);

export const LottieImage = withStyles(LottieImageComponent, (theme) => {
    return ({
        container: {
            flex: 1,
            height: 300,
            width: 300,
        },
        spinnerContainer: {
            flex: 1,
            marginTop: 240,
            justifyContent: 'center',
            alignItems: 'center'
        }
    });
});