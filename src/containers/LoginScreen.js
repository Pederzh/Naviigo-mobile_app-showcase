import React from 'react';
import {Image, TouchableWithoutFeedback} from 'react-native';
import {Button, Icon, Input, Layout, Text, withStyles} from '@ui-kitten/components';
import {CognitoUserPool} from 'amazon-cognito-identity-js';
import {useDispatch} from "react-redux";
import {loggingIn, logIn, logOut} from "../actions/AuthActions";
import {Auth} from 'aws-amplify';
import {POOL_DATA} from '../config/cognito.config';
import {ImageOverlay} from "../components/common/ImageOverlay";
import { useTranslation } from 'react-i18next';

const userPool = new CognitoUserPool(POOL_DATA);

const LoginScreenComponent = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    const [usernameStatus, setUsernameStatus] = React.useState('primary');
    const [passwordStatus, setPasswordStatus] = React.useState('primary');

    const validate = () => {
        let flag = true;
        if (!username) {
            flag = false;
            setUsernameStatus('danger');
        } else {
            setUsernameStatus('primary');
        }
        if (!password) {
            flag = false;
            setPasswordStatus('danger');
        } else {
            setPasswordStatus('primary');
        }
        if (flag) {
            signin(username, password, dispatch);
        }
    };

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const ViewIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
        </TouchableWithoutFeedback>
    );

    return (
        // per far vedere l'immagine utilizzare lo sfondo trasparente nei layout
        <Layout style={{flex: 1}}>
            <ImageOverlay
                source={{uri: 'S3_URL/gradient-blue.png'}}
                //source={require('../core/img/home-banner-bg.jpg')}
                style={props.themedStyle.layout_top}>
                <Image source={require('../core/img/naviigo-logo-white.png')}/>
                <Text style={props.themedStyle.text} category='h5'>{t('login')}</Text>
            </ImageOverlay>
            <Layout style={props.themedStyle.layout_middle}>
                <Input
                    style={props.themedStyle.input}
                    placeholder={t('Username')}
                    autoCorrect={false}
                    autoCapitalize='none'
                    //keyboardType='email-address'
                    icon={UserIcon}
                    status={usernameStatus}
                    onChangeText={(value) => setUsername(value)}/>
                <Input
                    style={props.themedStyle.input}
                    placeholder={t('Password')}
                    secureTextEntry={secureTextEntry}
                    icon={ViewIcon}
                    status={passwordStatus}
                    onChangeText={(value) => setPassword(value)}/>
                <Text
                    style={props.themedStyle.goToText}
                    appearance='hint'
                    onPress={() => props.navigation.navigate('Forgot password', {username: username})}>
                    {t('Forgot password?')}
                </Text>

            </Layout>
            <Layout style={props.themedStyle.layout_bottom}>
                <Button onPress={() => validate()}>
                    {t('login')}
                </Button>
                <Text
                    style={props.themedStyle.signIn}
                    appearance='hint'
                    onPress={() => props.navigation.navigate('Register')}>
                    {t('Don\'t have an account? Create it')}
                </Text>
            </Layout>
        </Layout>

    );
};

// authenticating a user and establishing a user session with the Amazon Cognito Identity service
const signin = async (username, password, dispatch) => {
    dispatch(loggingIn());
    try {
        const user = await Auth.signIn(username.toLowerCase(), password);
        let isHost = (user.attributes['custom:isHost'] == '1') ? true : false;
        let isComplete = (user.attributes['custom:isComplete'] == '1') ? true : false;
        dispatch(logIn(user.username, user.attributes.email, user.attributes.given_name, user.attributes.family_name, isHost, isComplete));
    } catch (error) {
        dispatch(logOut());
        alert(error.message);
    }
};

// il componente custom (LoginScreen) viene utilizzato per generare un nuovo componente (LoginScreenStyled)
export const LoginScreen = withStyles(LoginScreenComponent, theme => ({
    // alignItems -> sinistra, centro o destra
    // justifyContent -> alto, centro o basso
    layout_top: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    layout_middle: {
        flex: 4,
        justifyContent: 'flex-start',
        alignItems: 'center',
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
        alignSelf: 'flex-end',
        margin: 10,
    },
    signIn: {
        alignSelf: 'center',
        margin: 16,
    }
}));

const LockIcon = (style) => (
    <Icon name='lock-outline' {...style} />
);

const EmailIcon = (style) => (
    <Icon name='email-outline' {...style} />
);

const UserIcon = (style) => (
    <Icon name='person-outline' {...style} />
);