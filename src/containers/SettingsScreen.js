import React from 'react';
import {Button, Icon, Layout, Text, Toggle, withStyles} from '@ui-kitten/components';
import {useDispatch, useSelector} from "react-redux";
import {AsyncStorage, ScrollView, TouchableOpacity, View} from 'react-native';
import {setDark, setLight} from '../actions/ThemeActions';
import {Auth} from 'aws-amplify';
import {logOut} from "../actions/AuthActions";
import {ChangeModeItem} from "../components/settings/ChangeModeItem";
import {useTranslation} from "react-i18next";


const SettingsScreen = (props) => {
    const { t } = useTranslation();
    const {navigation, themedStyle} = props;
    const dispatch = useDispatch();
    const themeState = useSelector((state) => state.theme);
    const authState = useSelector((state) => state.auth);

    const ProfileIcon = (style) => (
        <Icon {...style} name='person-outline' width={26} height={26} fill='#C5CEE0'/>
    );
    const PreferencesIcon = (style) => (
        <Icon {...style} name='options-2-outline' width={26} height={26} fill='#C5CEE0'/>
    );
    const CameraIcon = (style) => (
        <Icon {...style} name='camera-outline' width={26} height={26} fill='#C5CEE0'/>
    );

    let tmp = false;
    switch (themeState.name) {
        case 'light':
            tmp = false;
            break;
        case 'dark':
            tmp = true;
            break;
    }
    const [checked, setChecked] = React.useState(tmp);

    const onCheckedChange = (isChecked) => {
        setChecked(isChecked);
        if (isChecked) {
            set_dark_theme(dispatch);
        } else {
            set_light_theme(dispatch);
        }
    };

    return (
        <ScrollView style={themedStyle.bg} contentContainerStyle={{flex: 1}}
                    bounces={false}
                    bouncesZoom={false}
                    alwaysBounceVertical={false}
                    alwaysBounceHorizontal={false}>
            <Layout style={themedStyle.layout_middle}>
                <View style={themedStyle.headerRow}>
                    <Text style={{fontWeight: "bold"}}>Settings</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate("ProfileScreen")}
                >
                    <View style={themedStyle.row}>
                        <Text>
                            {t('Profile')}
                        </Text>
                        <ProfileIcon {...props}/>
                    </View>
                </TouchableOpacity>
                {
                    (authState.modeHost) &&
                    <TouchableOpacity
                        onPress={() => navigation.navigate("HostFormScreen")}
                    >
                        <View style={themedStyle.row}>
                            <Text>
                                {t('Company information')}
                            </Text>
                            <PreferencesIcon {...props}/>
                        </View>
                    </TouchableOpacity>
                }
                <TouchableOpacity
                    onPress={() => navigation.navigate("BarCodeScannerScreen")}
                >
                    <View style={themedStyle.row}>
                        <Text>
                            {`${t('Scan Boat QR Code')}`}
                        </Text>
                        <CameraIcon {...props}/>
                    </View>
                </TouchableOpacity>
                {(authState.isHost) &&
                <ChangeModeItem/>}
                <View style={themedStyle.row}>
                    <Text>
                        {t('Dark theme')}
                    </Text>
                    <Toggle
                        checked={checked}
                        onChange={onCheckedChange}/>
                </View>
                <Button
                    appearance='outline' status='danger'
                    style={themedStyle.button}
                    onPress={() => logout(dispatch)}
                >
                    {t('Logout')}
                </Button>
            </Layout>
        </ScrollView>
    );
}

const set_light_theme = async (dispatch) => {
    await AsyncStorage.setItem('themeName', 'light');
    dispatch(setLight());
}

const set_dark_theme = async (dispatch) => {
    await AsyncStorage.setItem('themeName', 'dark');
    dispatch(setDark());
}

const logout = async (dispatch) => {
    // using this function, tokens stored in local storage (by the sdk) about the user will be deleted (again by the sdk)
    try {
        (await Auth.currentAuthenticatedUser()).signOut();
        dispatch(logOut());
    } catch (error) {
        alert(error.message);
    }
}


export const SettingsScreenStyled = withStyles(SettingsScreen, theme => ({
    // alignItems -> sinistra, centro o destra
    // justifyContent -> alto, centro o basso
    bg: {
        flexGrow: 1,
    },
    layout_middle: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme['border-basic-color-3'],
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: 25,
        height: 75,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme['border-basic-color-3'],
        paddingHorizontal: 20,
        paddingVertical: 15,
        height: 75,
    },
    text: {
        color: theme['color-primary-100'],
        fontWeight: 'bold',
    },
    button: {
        margin: 20,
    },
}));

