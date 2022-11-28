import React from 'react';
import {Image, View} from 'react-native';
import {Button, Icon, Input, Layout, Text, withStyles, Divider} from '@ui-kitten/components';
import {CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';
import {POOL_DATA} from '../config/cognito.config';
import {ImageOverlay} from "../components/common/ImageOverlay";
import {useTranslation} from "react-i18next";

const userPool = new CognitoUserPool(POOL_DATA);

const ConfirmScreenComponent = (props) => {
    const { t } = useTranslation();

    let _username = '';
    if (props.route.params && props.route.params.user) {
        _username = props.route.params.user.getUsername();
    }

    const [username, setUsername] = React.useState(_username);
    const [confirmationCode, setConfirmationCode] = React.useState('');
    const [usernameStatus, setUsernameStatus] = React.useState('primary');
    const [confirmationCodeStatus, setConfirmationCodeStatus] = React.useState('primary');

    const validate = () => {
        let flag = true;
        if (!username) {
            flag = false;
            setUsernameStatus('danger');
        } else {
            setUsernameStatus('primary');
        }
        if (!confirmationCode) {
            flag = false;
            setConfirmationCodeStatus('danger');
        } else {
            setConfirmationCodeStatus('primary');
        }
        if (flag) {
            confirm(username, confirmationCode, props.navigation);
        }
    };

    const validate_re_send = () => {
        var flag = true;
        if (!username) {
            flag = false;
            setUsernameStatus('danger');
        } else {
            setUsernameStatus('primary');
        }
        if (flag) {
            re_send(username);
        }
    };

    return (
        <Layout style={{flex: 1}}>
            <ImageOverlay
                source={{uri: 'S3_URL/gradient-blue.png'}}
                //source={require('../core/img/home-banner-bg.jpg')}
                style={props.themedStyle.layout_top}>
                <Image source={require('../core/img/naviigo-logo-white.png')}/>
                <Text style={props.themedStyle.text} category='h5'>{t('Confirm Registration')}</Text>
            </ImageOverlay>
            <Layout style={props.themedStyle.layout_middle}>
                <Input style={props.themedStyle.input}
                       placeholder={t('username')}
                       icon={UserIcon}
                       autoCorrect={false}
                       status={usernameStatus}
                       onChangeText={(value) => setUsername(value)}>
                    {username}
                </Input>
                <Input style={props.themedStyle.input}
                       placeholder={t('Confirmation code')}
                       keyboardType='numeric'
                       icon={HashIcon}
                       status={confirmationCodeStatus}
                       onChangeText={(value) => setConfirmationCode(value)}
                />
                <View style={props.themedStyle.orContainer}>
                    <Divider style={props.themedStyle.divider} />
                    <Text style={props.themedStyle.orLabel} category='c2'>
                        {t('Or')}
                    </Text>
                    <Divider style={props.themedStyle.divider} />
                </View>
                <Text style={{justifyContent: 'center', margin: 16}}
                      appearance='hint'
                      onPress={() => validate_re_send()}>
                    {t("Send confirmation code again")}
                </Text>

            </Layout>
            <Layout style={props.themedStyle.layout_bottom}>
                <Button
                    onPress={() => validate()}>
                    {t("Confirm")}
                </Button>
                <Text style={props.themedStyle.goToText}
                      appearance='hint'
                      onPress={() => props.navigation.navigate('Register')}>
                    {t('Return to register')}
                </Text>
            </Layout>
        </Layout>
    );
}

const confirm = (username, confirmationCode, navigation) => {
    const { t } = useTranslation();
    const userData = {
        Username: username,
        Pool: userPool,
    };

    let cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
            alert(t("Uh oh - Something went wrong!"));
            console.log(err);
            return;
        }

        alert(t("Success! Now you can login into the application"));
        navigation.navigate("Login");
    });
}

// re send a confirmation code for confirming a registration for an unauthenticated user
const re_send = (username) => {
    const { t } = useTranslation();
    if (!username) {
        alert(t("Username is required"));
        return;
    }

    const userData = {
        Username: username,
        Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
            alert(t('Uh oh - Something went wrong!'));
            console.log(err);
            return;
        }
        alert(t("The code has been sent again"));
    });
}

export const ConfirmScreen = withStyles(ConfirmScreenComponent, theme => ({
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
        margin: 0,
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
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 52,
    },
    divider: {
        flex: 1,
    },
    orLabel: {
        color: theme['color-primary-200'],
        marginHorizontal: 8,
    },
}));

const UserIcon = (style) => (
    <Icon name='person-outline' {...style} />
);

const HashIcon = (style) => (
    <Icon name='hash-outline' {...style} />
);
