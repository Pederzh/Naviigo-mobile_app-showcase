import React from 'react';
import {Image} from 'react-native';
import {Button, Icon, Input, Layout, Text, withStyles} from '@ui-kitten/components';
import {CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';
import {POOL_DATA} from '../config/cognito.config';
import {ImageOverlay} from "../components/common/ImageOverlay";
import {useTranslation} from "react-i18next";

const userPool = new CognitoUserPool(POOL_DATA);

const ResetPasswordScreenComponent = (props) => {
    const { t } = useTranslation();
    let _username = '';
    if (props.route.params && props.route.params.username) {
        _username = props.route.params.username;
    }

    const [username, setUsername] = React.useState(_username);
    const [verificationCode, setVerificationCode] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repeatPassword, setRepeatpassword] = React.useState('');
    const [usernameStatus, setUsernameStatus] = React.useState('primary');
    const [passwordStatus, setPasswordStatus] = React.useState('primary');
    const [repeatPasswordStatus, setRepeatPasswordStatus] = React.useState('primary');
    const [verificationCodeStatus, setVerificationCodeStatus] = React.useState('primary');

    const validate = () => {
        let flag = true;
        if (!username) {
            flag = false;
            setUsernameStatus('danger');
        } else {
            setUsernameStatus('primary');
        }
        if (!verificationCode) {
            flag = false;
            setVerificationCodeStatus('danger');
        } else {
            setVerificationCodeStatus('primary');
        }
        if (!password) {
            flag = false;
            setPasswordStatus('danger');
        } else {
            setPasswordStatus('primary');
        }
        if (!repeatPassword) {
            flag = false;
            setRepeatPasswordStatus('danger');
        } else {
            setRepeatPasswordStatus('primary');
        }
        if (password != repeatPassword) {
            setPasswordStatus('warning');
            setRepeatPasswordStatus('warning');
            flag = false;
        }

        if (flag) {
            resetPsw(username, verificationCode, password, props.navigation, t)
        }
    };

    return (
        // per far vedere l'immagine utilizzare lo sfondo trasparente nei layout
        <Layout style={{flex: 1}}>
            <ImageOverlay
                source={{uri: 'S3_URL/gradient-blue.png'}}
                //source={require('../core/img/home-banner-bg.jpg')}
                style={props.themedStyle.layout_top}>
                <Image source={require('../core/img/naviigo-logo-white.png')}/>
                <Text style={props.themedStyle.text} category='h5'>Reset Password</Text>
            </ImageOverlay>
            <Layout style={props.themedStyle.layout_middle}>
                <Input style={props.themedStyle.input}
                       placeholder={t('Username')}
                       autoCorrect={false}
                    //keyboardType='email-address'
                       icon={UserIcon}
                       status={usernameStatus}
                       onChangeText={value => setUsername(value)}>
                    {username}
                </Input>
                <Input style={props.themedStyle.input}
                       placeholder={t('Verification code')}
                       keyboardType='numeric'
                       icon={HashIcon}
                       status={verificationCodeStatus}
                       onChangeText={value => setVerificationCode(value)}
                />
                <Input
                    style={props.themedStyle.input}
                    placeholder={t('New password')}
                    secureTextEntry={true}
                    icon={LockIcon}
                    status={passwordStatus}
                    onChangeText={value => setPassword(value)}/>
                <Input
                    style={props.themedStyle.input}
                    placeholder={t('Repeat password')}
                    secureTextEntry={true}
                    icon={LockIcon}
                    status={repeatPasswordStatus}
                    onChangeText={value => setRepeatpassword(value)}/>

            </Layout>
            <Layout style={props.themedStyle.layout_bottom}>
                <Button
                    onPress={() => validate()}>
                    {t('Reset')}
                </Button>
                <Text style={props.themedStyle.goToText}
                      appearance='hint'
                      onPress={() => props.navigation.navigate('Forgot password')}>
                    {t('Return to forgot password')}
                </Text>
            </Layout>
        </Layout>
    );
}

const resetPsw = (username, verificationCode, newPsw, navigation, t) => {
    const userData = {
        Username: username,
        Pool: userPool,
    };

    var cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmPassword(verificationCode, newPsw, {
        onSuccess() {
            alert(t('Password changed'));
            navigation.navigate('Login');
        },
        onFailure(err) {
            alert(t("Uh oh - Something went wrong!") + " " + err.message);
            console.log(err);
        },
    })
}

export const ResetPasswordScreen = withStyles(ResetPasswordScreenComponent, theme => ({
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

const HashIcon = (style) => (
    <Icon name='hash-outline' {...style} />
);

const LockIcon = (style) => (
    <Icon name='lock-outline' {...style} />
);