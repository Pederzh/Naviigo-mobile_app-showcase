import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Layout, Text, withStyles} from "@ui-kitten/components";
import {LottieImage} from "../components/common/LottieImage";
import {useTranslation} from "react-i18next";

const BookingConfirmationScreenComponent = (props) => {
    const {navigation, route, themedStyle} = props;
    const { t } = useTranslation();

    return (
        <Layout
            style={themedStyle.container}
            level='1'>
            <Layout style={themedStyle.layout_top}>
                <View style={themedStyle.iconContainer}>
                    <LottieImage type={'success-status'} loop={false} aspectRatio={0.6}/>
                </View>
                <Text style={themedStyle.text} category='h1'>
                    {(route?.params?.title) ? route?.params?.title : t('Booking confirmed')}

                </Text>
                <View style={themedStyle.titleSection}>
                    <Button onPress={() =>
                        navigation.navigate("Booking list", {screen: "BookingList"})}
                            style={themedStyle.button}
                            status='primary'>
                        {t('Your bookings calendar')}
                    </Button>
                </View>

            </Layout>
        </Layout>
    );
};

export const BookingConfirmationScreen = withStyles(BookingConfirmationScreenComponent, (theme) => {

    return ({
        container: {
            flex: 1,
            backgroundColor: theme['color-primary-transparent-100'],
        },
        layout_top: {
            flex: 3,
            justifyContent: 'center',
            alignItems: 'center',
            //backgroundColor: theme['color-primary-500'],
            padding: 20,

        },
        text: {
            fontWeight: 'bold',
        },
        iconContainer: {
            flex: 10,
            //width: 300,
            backgroundColor: theme['color-primary-transparent-100'],
            alignItems: 'center',
        },
        titleSection: {
            marginHorizontal: 12,
            marginVertical: 24,
            flex: 3,
        },
        button: {
            margin: 2,
        },
    });
});

const style = StyleSheet.create({});