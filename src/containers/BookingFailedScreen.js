import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Layout, Text, withStyles} from "@ui-kitten/components";
import {LottieImage} from "../components/common/LottieImage";
import {useTranslation} from "react-i18next";

const BookingFailedScreenComponent = (props) => {
    const {navigation, themedStyle} = props;
    const { t } = useTranslation();
    return (
        <SafeAreaView style={{flex: 1}}>
            <Layout
                style={themedStyle.container}
                level='1'>
                <Layout style={themedStyle.layout_top}>
                    <View style={themedStyle.iconContainer}>
                        <LottieImage type={'error-status'} loop={true} aspectRatio={0.6}/>
                        <Text style={themedStyle.text} category='h1'>{t('Booking failed')}</Text>
                        <Text category='h6'>{t('Something went wrong')}</Text>
                    </View>
                    <View style={themedStyle.titleSection}>
                        <Button onPress={() => navigation.navigate("ExploreScreen")}
                                style={themedStyle.button}
                                status='info'>
                            {t('Go back')}
                        </Button>
                    </View>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};

export const BookingFailedScreen = withStyles(BookingFailedScreenComponent, (theme) => {

    return ({
        container: {
            flex: 1,
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