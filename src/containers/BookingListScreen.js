import React from 'react';
import { ApplicationProvider, IconRegistry, Layout, Text, Input, Button, Icon, useTheme, withStyles } from '@ui-kitten/components';
import {useTranslation} from "react-i18next";

const BookingListScreen = (props) => {
    const { t } = useTranslation();
    return (
        // per far vedere l'immagine utilizzare lo sfondo trasparente nei layout
        <Layout style={{ flex: 1 }}>

            <Layout style={props.themedStyle.layout_top}>
                <Text style={props.themedStyle.text} category='h1'>{t('Booking List')}</Text>
            </Layout>

            <Layout style={props.themedStyle.layout_middle}>
                <Button
                    onPress={() => props.navigation.navigate('Booking details') }>
                    {t('Go to Booking Details')}
                </Button>
            </Layout>
            <Layout style={props.themedStyle.layout_bottom}>

            </Layout>
        </Layout>
    );
}


export const BookingListScreenStyled = withStyles(BookingListScreen, theme => ({
    // alignItems -> sinistra, centro o destra
    // justifyContent -> alto, centro o basso
    layout_top: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme['color-primary-500'],
        padding: 20,
        //backgroundColor: theme['color-primary-transparent-100'],
    },
    layout_middle: {
        flex: 6,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme['color-primary-100'],
        padding: 20,
        //backgroundColor: theme['color-primary-transparent-100'],
    },
    layout_bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        backgroundColor: theme['color-primary-100'],
        padding: 20,
        //backgroundColor: theme['color-primary-transparent-100'],
    },
    text: {
        color: theme['color-primary-100'],
        fontWeight: 'bold',
    },
}));

