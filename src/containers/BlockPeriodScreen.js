import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Layout, Text, withStyles} from '@ui-kitten/components';
import {Divider} from "../components/common/Divider";
import {API} from 'aws-amplify';
import {Controller, useForm} from "react-hook-form";
import {RHFSelect} from "../components/forms/RHFSelect";
import {RHFCalendar} from "../components/forms/RHFCalendar";
import {checkId} from "../utils/errors";
import {useSelector} from "react-redux";
import Toast from "react-native-toast-message";
import {LottieLoader} from "../components/common/LottieLoader";
import {BOOKING_CATEGORY_DIRECT, BOOKING_CATEGORY_STANDARD, BOOKING_FEES_TYPE} from "../utils/constraints";
import {calculateServiceCost} from "../utils";
import {useTranslation} from "react-i18next";

const BlockPeriodScreenComponent = (props) => {
    const { t } = useTranslation();
    const authState = useSelector((state) => state.auth);
    const {navigation, themedStyle} = props;
    const [boatsData, setBoatsData] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const {register, setValue, handleSubmit, control, reset, errors} = useForm();

    //2 - MAIN CODE BEGINS HERE
    useEffect(() => getData(), []);

    //3 - GET FLATLIST DATA
    const getData = () => {
        setIsFetching(true);

        if (!checkId(authState?.id)) {
            return;
        }

        API.get("naviigo_api", `/${authState?.id}/boats`, null)
            .then(response => setBoatsData(response.map((obj) => ({value: obj.id, text: obj.name}))))
            .catch(error => {
                Toast.show({text1: `${t("Something went wrong")}`, text2: `${t('Error')}: ${error.message}`, type: "error"})
            })
            .finally(() => setIsFetching(false));
    };

    const onSubmit = data => {
        console.log(data);

        let params = {
            body: {
                boatId: data.boatId,
                category: BOOKING_CATEGORY_DIRECT,
                appointment: data.appointment,
                hostUsername: authState?.id,
                guestUsername: authState.id,
                price: 0,
                serviceCost: 0,
                currency: 'EUR',
                people: 0,
            },
        };

        API.post("naviigo_api", `/reservation-engine/create`, params)
            .then(
                () => {
                    Toast.show({
                        text1: t(`Period blocked for the selected boat`),
                        text2: ``
                    });
                    props.navigation.navigate("BookingConfirmationScreen", {title: t("Period blocked")});
                }
            )
            .catch(error => {
                Toast.show({text1: `${t("Something went wrong")}`, text2: `${t('Error')}: ${error.message}`, type: "error"})
            });

    };

    return (
        <SafeAreaView style={{flex: 1}}>
            {(isFetching) ? (
                <LottieLoader/>
            ) : (
            <>
            <Layout
                style={themedStyle.layout_top}
                level='1'>
                <View style={themedStyle.profileContainer}>
                    <View style={themedStyle.profileDetailsContainer}>
                        <Text category='h4'>
                            {t("Block Periods")}
                        </Text>
                        <Text
                            appearance='hint'
                            category='s1'>
                            {t("Select the period you don't want to receive booking for a boat")}
                        </Text>
                    </View>
                </View>
                <Divider/>
                <View style={themedStyle.profileSocialsContainer}>
                    <Controller
                        control={control}
                        render={({onChange, onBlur, value}) => (
                            <RHFSelect
                                label={t('Select boat')}
                                data={boatsData}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        )}
                        name="boatId"
                        rules={{required: true}}
                        defaultValue={''}
                    />
                    {errors.boatId && <Text>{t('This is required')}</Text>}
                </View>
                <Divider/>
            </Layout>
            <Layout style={themedStyle.layout_middle}>
                <Controller
                    control={control}
                    render={({onChange, onBlur, value}) => (
                        <RHFCalendar
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                        />

                    )}
                    name="appointment"
                    rules={{required: true}}
                    defaultValue={{}}
                />
                {errors.appointment && <Text>{t('This is required')}</Text>}
            </Layout>
            <Layout style={themedStyle.layout_bottom}>
                <Button onPress={handleSubmit(onSubmit)}>
                    {t('Save')}
                </Button>
            </Layout>
                </>
            )}
        </SafeAreaView>
    );
};

export const BlockPeriodScreen = withStyles(BlockPeriodScreenComponent, (theme) => {
    return ({
        imageItem: {
            width: 150,
            height: 100,
            borderRadius: 8,
            marginTop: 8,
            marginHorizontal: 8,
        },
        profileContainer: {
            flexDirection: 'row',
        },
        profileAvatar: {
            marginHorizontal: 8,
        },
        profileDetailsContainer: {
            flex: 1,
            marginHorizontal: 8,
        },
        confirmButton: {
            marginTop: 24,
        },
        profileSocialsContainer: {
            justifyContent: 'space-evenly',
            marginTop: 12,
        },
        profileSectionsDivider: {
            width: 1,
            height: '100%',
            marginHorizontal: 8,
        },
        profileDescription: {
            marginTop: 24,
            marginBottom: 8,
        },
        profileParametersSection: {
            paddingHorizontal: 16,
            //marginVertical: 16,
            flex: 1,
        },
        profileParameter: {
            flex: 1,
            marginHorizontal: 8,
        },
        sectionLabel: {
            marginVertical: 8,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 16,
        },
        layout_top: {
            flex: 3,
            padding: 16,
        },
        layout_middle: {
            flex: 6,
            padding: 16,
        },
        layout_bottom: {
            flex: 1,
            alignItems: 'stretch',
            padding: 20,
            justifyContent: 'flex-end',
        },
        layout_bottom_view: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        text: {
            color: theme['color-primary-100'],
            fontWeight: 'bold',
        },
        buttonAction: {
            flex: 1,
            flexDirection: 'row',
            marginHorizontal: 4,
            borderWidth: 0.5,
            borderRadius: 10,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowOpacity: 0.8,
            elevation: 6,
            shadowRadius: 5,
            shadowOffset: {width: 3, height: 3},
        },
    });
});

const style = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    valueLabel: {
        marginTop: 20,
    },
    icon: {
        width: 20,
        height: 20,
    },
});

