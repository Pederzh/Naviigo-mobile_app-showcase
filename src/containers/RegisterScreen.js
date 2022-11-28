import React from 'react';
import {Image, ScrollView} from 'react-native';
import { Layout, Text, Input, Button, Icon, withStyles, Toggle, CheckBox } from '@ui-kitten/components';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { POOL_DATA } from '../config/cognito.config';
import {ImageOverlay} from "../components/common/ImageOverlay";
import {useTranslation} from "react-i18next";

const userPool = new CognitoUserPool(POOL_DATA);

const RegisterScreenComponent = (props) => {
    const { t } = useTranslation();

    const [usernameStatus, setUsernameStatus] = React.useState('primary');
    const [passwordStatus, setPasswordStatus] = React.useState('primary');
    const [repeatPasswordStatus, setRepeatPasswordStatus] = React.useState('primary');
    const [emailStatus, setEmailStatus] = React.useState('primary');
    const [nameStatus, setNameStatus] = React.useState('primary');
    const [surnameStatus, setSurnameStatus] = React.useState('primary');

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repeatPassword, setRepeatPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [isHost, setIsHost] = React.useState(false);

    const onCheckedChange = (isHost) => {
        setIsHost(isHost);
    }

    const validate = () => {
        let flag = true;
        if (!username) {
            flag = false;
            setUsernameStatus('danger');
        } else { setUsernameStatus('primary'); }
        if (!password) {
            flag = false;
            setPasswordStatus('danger');
        } else { setPasswordStatus('primary'); }
        if (!repeatPassword) {
            flag = false;
            setRepeatPasswordStatus('danger');
        } else { setRepeatPasswordStatus('primary'); }
        if (!email) {
            flag = false;
            setEmailStatus('danger');
        } else { setEmailStatus('primary'); }
        if (!name) {
            flag = false;
            setNameStatus('danger');
        } else { setNameStatus('primary'); }
        if (!surname) {
            flag = false;
            setSurnameStatus('danger');
        } else { setSurnameStatus('primary'); }

        if (password !== repeatPassword) {
            setPasswordStatus('warning');
            setRepeatPasswordStatus('warning');
            flag = false;
        }

        if (flag) { signup(username, password, email.toLowerCase(), name, surname, isHost, props.navigation, t); }
    };

    return (
        <Layout style={{flex: 1}}>
                <ImageOverlay
                    source={{uri: 'S3_URL/gradient-blue.png'}}
                    //source={require('../core/img/home-banner-bg.jpg')}
                    style={props.themedStyle.layout_top}>
                    <Image source={require('../core/img/naviigo-logo-white.png')}/>
                    <Text style={props.themedStyle.text} category='h5'>{t('Sign up')}</Text>
                </ImageOverlay>
            <Layout style={props.themedStyle.layout_middle}>
                <ScrollView style={props.themedStyle.bg} contentContainerStyle={{}}>
                <Input 
                    style={props.themedStyle.input}
                    placeholder={t('Username')}
                    icon={UserIcon}
                    status={usernameStatus}
                    autoCorrect={false}
                    autoCapitalize='none'
                    onChangeText={(value) => setUsername(value)}
                />
                <Input style={props.themedStyle.input}
                    placeholder={t('Password')}
                    secureTextEntry={true}
                    icon={LockIcon}
                    status={passwordStatus}
                    onChangeText={(value) => setPassword(value)}
                />
                <Input style={props.themedStyle.input}
                    placeholder={t('Repeat password')}
                    secureTextEntry={true}
                    icon={LockIcon}
                    status={repeatPasswordStatus}
                    onChangeText={(value) => setRepeatPassword(value)}
                />
                <Input style={props.themedStyle.input}
                    placeholder={t('Email')}
                    keyboardType='email-address'
                       autoCorrect={false}
                       autoCapitalize='none'
                    icon={EmailIcon}
                    status={emailStatus}
                    onChangeText={(value) => setEmail(value)}
                />
                <Input style={props.themedStyle.input}
                    placeholder={t('First name')}
                       autoCorrect={false}
                    icon={UserIcon}
                    status={nameStatus}
                    onChangeText={(value) => setName(value)}
                />
                <Input style={props.themedStyle.input}
                    placeholder={t('Last name')}
                       autoCorrect={false}
                    icon={UserIcon}
                    status={surnameStatus}
                    onChangeText={(value) => setSurname(value)}
                />
                <Toggle 
                    style={props.themedStyle.toggle}
                    text={t('Register as captain')}
                    checked={isHost}
                    onChange={onCheckedChange}>
                </Toggle>
                </ScrollView>
            </Layout>
            <Layout style={props.themedStyle.layout_bottom}>
                {/* <CheckBoxAgreement style={props.themedStyle.agreement} /> */}
                <Button 
                    style={props.themedStyle.button}
                    onPress={() => validate()}>
                    {t('Register')}
                </Button>
                <Text style={props.themedStyle.goToText}
                    appearance='hint'
                    onPress={() => props.navigation.navigate('Confirm registration')}>
                    {t('I already have a registration code')}
                </Text>
                <Text style={props.themedStyle.goToText}
                      appearance='hint'
                      onPress={() => props.navigation.navigate('Login')}>
                    {t('Return to login')}
                </Text>
            </Layout>
        </Layout>

    );
}

const signup = (username, password, email, name, surname, isHost, navigation, t) => {
    let attrList = [];

    let dataUsername = {
        Name: 'username',
        Value: username,
    };
    let usernameAttribute = new CognitoUserAttribute(dataUsername);

    let dataEmail = {
        Name: 'email',
        Value: email,
    };
    let emailAttribute = new CognitoUserAttribute(dataEmail);

    let dataGivenName = {
        Name: 'given_name',
        Value: name
    };
    let givenNameAttribute = new CognitoUserAttribute(dataGivenName);

    let dataFamilyName = {
        Name: 'family_name',
        Value: surname,
    };
    let familyNameAttribute = new CognitoUserAttribute(dataFamilyName);

    let dataIsHost = {
        Name: 'custom:isHost',
        Value: (isHost) ? '1' : '0',
    }
    let isHostAttribute = new CognitoUserAttribute(dataIsHost);

    // this attribute is used to check if an Host has already completed all the information: while registering is surely false
    let dataIsComplete = {
        Name: 'custom:isComplete',
        Value: '0',
    }
    let isCompleteAttribute = new CognitoUserAttribute(dataIsComplete);


    attrList.push(emailAttribute);
    attrList.push(givenNameAttribute);
    attrList.push(familyNameAttribute);
    attrList.push(isHostAttribute);
    attrList.push(isCompleteAttribute);

    userPool.signUp(username, password, attrList, null, (err, result) => {
        if (err) {
            alert(t("Uh oh - Something went wrong!") + " " + err.message);
            console.log(err);
            return;
        }
        // it's a CognitoUser object
        let cognitoUser = result.user;

        alert(t("Success! Check your email for the confirmation code"));
        navigation.navigate("Confirm registration", { user: cognitoUser });
    });
};

export const RegisterScreen = withStyles(RegisterScreenComponent, theme => ({
    layout_top: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerRow: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: 25,
        marginBottom: 25,
        height: 75,
    },
    layout_middle: {
        flex: 4,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
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
    button: {
        margin: 5,
        marginTop: 10,
    },
    toggle: {
        margin: 5,
        alignSelf: 'flex-start',
    },
    text: {
        color: theme['color-primary-100'],
        fontWeight: 'bold',
    },
    agreement: {
        alignSelf: 'flex-start',
        margin: 5,
        marginTop: 10,
    },
    goToText: {
        alignSelf: 'flex-start',
        margin: 5,
        marginTop: 10,
    }
}));

const CheckBoxAgreement = (props) => {
    const { t } = useTranslation();
    // useState returns a tuple where the first parameter is the current state, the second is the method that allow us to update the state
    const [checked, setChecked] = React.useState(false);

    // questo metodo viene chiamato sull'onChange della checkbox. 
    // come parametro la funzione on change passa lo stato della checkbox (true se checkata ...)
    const onCheckedChange = (isChecked) => {
        setChecked(isChecked);
    };

    return (
        <CheckBox
            text={t('I read and accept terms & conditions')}
            checked={checked}
            onChange={onCheckedChange}
            // NB: passo lo stile come props a "<CheckBoxAgreement>", e dovrò quindi applicarlo a questa "<CheckBox>, prendendolo appunto da props.style"
            style={props.style}
        // textStyle={} --> volendo posso applicare uno stile specifico per il testo della checkbox
        />
    );
};

const LockIcon = (style) => (
    <Icon name='lock-outline' {...style} />
);

const EmailIcon = (style) => (
    <Icon name='email-outline' {...style} />
);

const UserIcon = (style) => (
    <Icon name='person-outline' {...style} />
);