import React, {useEffect} from 'react';
import { View, ScrollView} from 'react-native';
import {Avatar, Button, Layout, Text, withStyles, Input, Select, Icon} from '@ui-kitten/components';
import {useSelector} from "react-redux";
import {sanitizeUsername} from "../utils";
import {useTranslation} from "react-i18next";

const ProfileScreen = (props) => {
    const { t } = useTranslation();
    const authState = useSelector((state) => state.auth);

    const [edit, setEdit] = React.useState(false);
    const [username, setUsername] = React.useState(authState?.id);
    const [name, setName] = React.useState(authState?.name);
    const [surname, setSurname] = React.useState(authState?.surname);
    const [email, setEmail] = React.useState(authState?.email);
    //TODO CHANGE
    const [phone, setPhone] = React.useState('+39 123 4567890');
    const [opening_hour, setOpening_hour] = React.useState('8');
    const [opening_minute, setOpening_minute] = React.useState('00');
    const [closing_hour, setClosing_hour] = React.useState('18');
    const [closing_minute, setClosing_minute] = React.useState('00');
    //TODO---
 
    const updateProfile = () => {
        // post the data!

        setEdit(false);
    }

    const EditAvatarButton = () => {
        return(
            <Button
                style={props.themedStyle.avatarButton}
                status='basic'
                icon={CameraIcon}/>);
    }

    if (edit) {
        return (
            <ScrollView style={props.themedStyle.bg}
                bounces={false}
                bouncesZoom={false}
                alwaysBounceVertical={false}
                alwaysBounceHorizontal={false}
                style={{flex: 1}}>
    
                <Layout style={props.themedStyle.layout_top}>
                    <View style={props.themedStyle.avatar}>
                        <Avatar size='giant' style={props.themedStyle.avatarImage}
                                source={{uri: `S3_URL/public/users/${sanitizeUsername(authState?.id)}.jpg`}}
                                />
                        <EditAvatarButton></EditAvatarButton>
                    </View>
                </Layout>
    
                <Layout style={props.themedStyle.layout_middle}>
                    <View style={props.themedStyle.row}>
                        <Text appearance='hint'>
                            {t('Username')}
                        </Text>
                        <Input 
                            value={username}
                            onChangeText={(value) => setUsername(value)}/>
                    </View>
                    <View style={props.themedStyle.row}>
                        <Text appearance='hint'>
                            {t('Name')}
                        </Text>
                        <Input 
                            value={name}
                            onChangeText={(value) => setName(value)}/>
                    </View>
                    <View style={props.themedStyle.row}>
                        <Text appearance='hint'>
                            {t('Surname')}
                        </Text>
                        <Input 
                            value={surname}
                            onChangeText={(value) => setSurname(value)}/>
                    </View>
                    <View style={props.themedStyle.row}>
                        <Text appearance='hint'>
                            {t('Email')}
                        </Text>
                        <Input 
                            value={email}
                            onChangeText={(value) => setEmail(value)}/>
                    </View>
                    <View style={props.themedStyle.row}>
                        <Text appearance='hint'>
                            {t('Phone')}
                        </Text>
                        <Input 
                            value={phone}
                            keyboardType='numeric'
                            onChangeText={(value) => setPhone(value)}/>
                    </View>
                    <View style={props.themedStyle.time_row}>
                        <Text>{t('Opening hours')}</Text>
                    </View>
                    <View style={props.themedStyle.time_row}>
                        <Text appearance='hint'>
                            {t('From')}
                        </Text>
                        <Input
                            value={opening_hour}
                            keyboardType='numeric'
                            onChangeText={(value) => setOpening_hour(value)}/>
                        <Text>
                            :
                        </Text>
                        <Input
                            value={opening_minute}
                            keyboardType='numeric'
                            onChangeText={(value) => setOpening_minute(value)}/>
                        <Text appearance='hint'>
                            {t('to')}
                        </Text>
                        <Input 
                            value={closing_hour}
                            keyboardType='numeric'
                            onChangeText={(value) => setClosing_hour(value)}/>
                        <Text>
                            :
                        </Text>
                        <Input 
                            value={closing_minute}
                            keyboardType='numeric'
                            onChangeText={(value) => setClosing_minute(value)}/>
                    </View>
                </Layout>
                <Layout style={props.themedStyle.layout_bottom}>
                    <Button
                        onPress={() => updateProfile()}>
                        {t('Save')}
                    </Button>
                </Layout>
            </ScrollView>
        );
    } else {
        return (
            <ScrollView style={props.themedStyle.bg}
                bounces={false}
                bouncesZoom={false}
                alwaysBounceVertical={false}
                alwaysBounceHorizontal={false}
                style={{flex: 1}}>
    
                <Layout style={props.themedStyle.layout_top}>
                    <View style={props.themedStyle.avatar}>
                        <Avatar size='giant' style={props.themedStyle.avatarImage}
                                source={{uri: `S3_URL/public/users/${sanitizeUsername(authState?.id)}.jpg`}}
                        />
                    </View>
                </Layout>
                <Layout style={props.themedStyle.layout_middle}>
                    <View style={props.themedStyle.row}>
                        <Text appearance='hint'>
                            {t('Username')}
                        </Text>
                        <Text>{username}</Text>
                    </View>
                    <View style={props.themedStyle.row}>
                        <Text appearance='hint'>
                            {t('Name')}
                        </Text>
                        <Text>{name}</Text>
                    </View> 
                    <View style={props.themedStyle.row}>
                        <Text appearance='hint'>
                            {t('Surname')}
                        </Text>
                        <Text>{surname}</Text>
                    </View>
                    <View style={props.themedStyle.row}>
                        <Text appearance='hint'>
                            {t('Email')}
                        </Text>
                        <Text>{email}</Text>
                    </View>
                    {/*<View style={props.themedStyle.row}>*/}
                        {/*<Text appearance='hint'>*/}
                            {/*phone*/}
                        {/*</Text>*/}
                        {/*<Text>{phone}</Text>*/}
                    {/*</View>*/}
                    {/*<View style={props.themedStyle.row}>*/}
                        {/*<Text appearance='hint'>*/}
                            {/*opening hours*/}
                        {/*</Text>*/}
                        {/*<Text>from {opening_hour}:{opening_minute} to {closing_hour}:{closing_minute}</Text>*/}
                    {/*</View>*/}
                </Layout>
                <Layout style={props.themedStyle.layout_bottom}>
                    {/*<Button*/}
                        {/*onPress={() => setEdit(true)}>*/}
                        {/*Edit*/}
                    {/*</Button>*/}
                </Layout>
            </ScrollView>
        );
    }
}

const CameraIcon = (style) => (
    <Icon name='camera-outline' {...style} />
);


export const ProfileScreenStyled = withStyles(ProfileScreen, theme => ({
    // alignItems -> sinistra, centro o destra
    // justifyContent -> alto, centro o basso
    bg: {

    },
    layout_top: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme['color-primary-500'],
        padding: 40,
    },
    avatar: {
        alignSelf: 'center',
    },
    avatarImage: {
        alignSelf: 'center',
        aspectRatio: 1.0,
        height: 150,
    },
    avatarButton: {
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 0,
        aspectRatio: 1.0,
        height: 60,
        borderRadius: 30,
    },
    layout_middle: {
        justifyContent: 'flex-start',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme['border-basic-color-3'],
        paddingHorizontal: 16,
        paddingVertical: 16,
        height: 75,
    },
    time_row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        height: 75,
    },
    layout_bottom: {
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        padding: 20,
    },
}));
 