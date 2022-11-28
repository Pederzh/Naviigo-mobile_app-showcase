import React from 'react';
import {Image, ImageBackground} from 'react-native';
import { Layout, Text, Input, Button, Icon, withStyles } from '@ui-kitten/components';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { POOL_DATA } from '../config/cognito.config';
import {ImageOverlay} from "../components/common/ImageOverlay";
import { useTranslation } from 'react-i18next';

const userPool = new CognitoUserPool(POOL_DATA);

const ForgotPasswordScreenComponent = (props) => {
    const { t } = useTranslation();
    let _username = '';
    if (props.route.params && props.route.params.username) {
        _username = props.route.params.username;
    }

    const [username, setUsername] = React.useState(_username);
    const [usernameStatus, setUsernameStatus] = React.useState('primary');

    const validate = () => {
        let flag = true;
        if (!username) {
            flag = false;
            setUsernameStatus('danger');
        } else { setUsernameStatus('primary'); }

        if (flag) { forgotPsw(username, props.navigation, t); }
    };

    return (
        <Layout style={{flex: 1}}>
            <ImageOverlay
                source={{uri: 'S3_URL/gradient-blue.png'}}
                //source={require('../core/img/home-banner-bg.jpg')}
                style={props.themedStyle.layout_top}>
                <Image source={require('../core/img/naviigo-logo-white.png')}/>
                <Text style={props.themedStyle.text} category='h5'>Forgot Password</Text>
            </ImageOverlay>
            <Layout style={props.themedStyle.layout_middle}>
                <Input 
                  style={props.themedStyle.input}
                  placeholder={t('Username')}
                  autoCorrect={false}
                  //keyboardType='email-address'
                  icon={UserIcon}
                  status={usernameStatus}
                  onChangeText={(value) => setUsername(value)}>
                    {username}
                </Input>

                <Text 
                  style={props.themedStyle.goToText}
                  appearance='hint'
                  onPress={() => props.navigation.navigate('Reset password')}>
                    {t("I already have a reset code")}
                </Text>
            </Layout>
            <Layout style={props.themedStyle.layout_bottom}>
                <Button
                    onPress={() => validate() }>
                    {t('Send me a code')}
                </Button>
                <Text
                    style={props.themedStyle.goToText}
                    appearance='hint'
                    onPress={() => props.navigation.navigate('Login')}>
                    {t('Return to login')}
                </Text>
            </Layout>
        </Layout>
    );
}

const forgotPsw = (username, navigation, t) => {
    const userData = {
        Username: username,
        Pool: userPool,
    };

    let cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
        onSuccess: function(data) {
          // successfully initiated reset password request
          /* 
            data = {
                "CodeDeliveryDetails": Object {
                    "AttributeName": "email",
                    "DeliveryMedium": "EMAIL",
                    "Destination": "l***@g***.com",
                }
            }
          */
          alert(t("A verification code has been sent to your") + " " + data.CodeDeliveryDetails.DeliveryMedium + '!');
          navigation.navigate('Reset password', {username: username});
        },
        onFailure: function(err) {
            alert(t("Uh oh - Something went wrong!") + " " + err.message);
            console.log(err);
        }
    });
}

export const ForgotPasswordScreen = withStyles(ForgotPasswordScreenComponent, theme => ({
    layout_top: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    layout_middle: {
        flex: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 0,
        padding: 20,
    },
    layout_bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        padding: 20,
    },
    input: {
        margin: 5,
    },
    text: {
        color: theme['color-primary-100'],
        fontWeight: 'bold',
    },
    goToText: {
        alignSelf: 'flex-start',
        margin: 10,
    }
}));

const UserIcon = (style) => (
    <Icon name='person-outline' {...style} />
);