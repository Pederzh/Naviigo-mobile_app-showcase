import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Button, Card, Layout, Text, withStyles} from '@ui-kitten/components';
import {useSelector} from "react-redux";
import {TextualInfoItem} from "../components/common/TextualInfoItem";
import {
    BOOKING_CATEGORY_STANDARD,
    BOOKING_FEES_FIXED,
    BOOKING_FEES_GUEST,
    BOOKING_FEES_GUEST_FIXED,
    BOOKING_FEES_PERCENTAGE,
    BOOKING_FEES_TYPE,
} from "../utils/constraints";
import {Divider} from "../components/common/Divider";
import {HostInfoSection} from "../components/common/HostInfoSection";
import {API} from 'aws-amplify';
import {apiError, checkBoat} from "../utils/errors";
import {calculateServiceCost, getFirstImage, sanitizeBoatId, showServiceCost, showTotalCost} from "../utils";
import {LottieLoader} from "../components/common/LottieLoader";
import Toast from "react-native-toast-message";
import {useTranslation} from "react-i18next";

const BookingDetailCard = (props) => {

    const {hint, value, ...restProps} = props;

    return (

        <Card {...restProps}>
            <View style={styles.topContainer}>
                <Text appearance='hint'>
                    {hint}
                </Text>
                {/*{icon(styles.icon)}*/}
            </View>
            <Text
                style={styles.valueLabel}
                category='h5'>
                {value}
            </Text>
        </Card>
    );
};

const BookingDetailBox = (props) => {
    const {onPress, hint, value, ...viewProps} = props;

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View
                {...viewProps}
                style={[style.container, props.style]}>
                <Text
                    appearance='hint'
                    category='c2'>
                    {props.hint}
                </Text>
                <Text category='s2'>
                    {value}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const BookingDetailsScreenComponent = (props) => {
    const { t } = useTranslation();
    const authState = useSelector((state) => state.auth);
    const boatBookingInfo = useSelector((state) => state.currentBoat?.bookingInfo);
    //const boatState = useSelector((state) => state.currentBoat); //add .data where used todo
    const peopleState = useSelector((state) => state.people);
    const locationState = useSelector((state) => state.location);
    const datetimeState = useSelector((state) => state.datetime);
    const [boatState, setBoatState] = useState(null);
    const [boatHost, setBoatHost] = useState(null);

    const [isFetching, setIsFetching] = useState(false);

    const {themedStyle, navigation, route} = props;
    const {boatId, boatObject, hostUsername} = route?.params;

    useEffect(() => getData(), []);

    const getData = () => {
        if (boatObject != null) {
            //if the object is passed by navigation do not call API
            setBoatState({...boatObject});
            return;
        }

        if (!checkBoat(boatId, hostUsername)) {
            return;
        }

        setIsFetching(true);

        API.get("naviigo_api", `/boats/${sanitizeBoatId(id)}?hostUsername=${hostUsername}`, null)
            .then(response => setBoatState(response))
            .catch(error => {
                apiError(error.message, 'GET boat');
            })
            .finally(() => setIsFetching(false));
    };

    useEffect(() => {
        if (boatState && boatState.hostUsername) {
            API.get("naviigo_api", `/users/${boatState.hostUsername}`, null)
                .then(response => setBoatHost(response))
                .catch(error => {
                    //apiError(error.message, 'GET host');
                })
                .finally(() => setIsFetching(false));
        }
    }, [boatState]);

    const onConfirm = () => {
        let category = BOOKING_CATEGORY_STANDARD; //TODO check host preference to set in: category = "STANDARD" "DIRECT"

        let params = {
            body: {
                boatId: boatState?.id,
                category: category,
                appointment: {
                    from: datetimeState?.startingDateTime?.toISOString(),
                    to: datetimeState?.endingDateTime?.toISOString()
                },
                hostUsername: boatState?.hostUsername,
                guestUsername: authState.id,
                price: boatBookingInfo?.price,
                serviceCost: calculateServiceCost(BOOKING_FEES_TYPE, boatBookingInfo?.price),
                currency: boatBookingInfo?.currency,
                people: peopleState?.totalCount,
            },
        };

        if ((BOOKING_FEES_TYPE === BOOKING_FEES_FIXED && BOOKING_FEES_GUEST_FIXED !== 0) || (BOOKING_FEES_TYPE === BOOKING_FEES_PERCENTAGE && BOOKING_FEES_GUEST !== 0)) {
            props.navigation.navigate('PaymentScreen', {reservation: params});
        } else {
            API.post("naviigo_api", `/reservation-engine/create`, params)
                .then(
                    () => {
                        Toast.show({
                            text1: t('Boat reservation request done'),
                            text2: (category === BOOKING_CATEGORY_STANDARD)
                                ? t('You have to wait for the host to accept or deny your reservation')
                                : t('Renter has confirmed your reservation, enjoy!')
                        });
                        props.navigation.navigate("BookingConfirmationScreen");
                    }
                )
                .catch(error => {
                    Toast.show({text1: t('Something went wrong'), text2: `${t('Error')}: ${error.message}`, type: "error"})
                });
        }

    };

    return (
        <SafeAreaView style={{flex: 1}}>
            {(isFetching) ? (
                <LottieLoader/>
            ) : (
                <Layout style={themedStyle.container}>
                    <Layout
                        style={themedStyle.header}
                        level='1'>
                        <View style={themedStyle.profileContainer}>
                            <View style={themedStyle.profileDetailsContainer}>
                                <Text category='h5'>
                                    {boatState?.name}
                                </Text>
                                <Text
                                    appearance='hint'
                                    category='s1'>
                                    {`${(boatState?.formatted_address) ? boatState?.formatted_address : ''}`}
                                </Text>
                            </View>
                            <Image
                                style={themedStyle.imageItem}
                                source={{uri: getFirstImage(boatState?.images)}}
                            />
                        </View>
                        <HostInfoSection
                            position={'right'}
                            name={(boatHost?.username) ? boatHost?.username : boatState?.hostUsername}
                            type={(boatHost?.type) ? boatHost?.type : 'Host'}
                        />
                        <Divider/>
                        <View style={themedStyle.profileSocialsContainer}>
                            <BookingDetailBox
                                hint={`${t('Starting at')}:`}
                                onPress={() => navigation.navigate('DateSearchScreen')}
                                value={(datetimeState?.startingDateTime?.toLocaleString()) ?
                                    `${datetimeState?.startingDateTime?.toLocaleString()}` :
                                    t("Select")}
                            />
                            <BookingDetailBox
                                hint={`${t('Hours')}:`}
                                value={`${boatBookingInfo?.timeSlot}`}
                            />
                            <BookingDetailBox
                                hint={`${t('People')}:`}
                                onPress={() => navigation.navigate('PeopleSearchScreen')}
                                value={(peopleState?.totalCount > 0) ?
                                    `${peopleState?.totalCount}` :
                                    t("Select")}
                            />
                        </View>
                        <Divider/>
                    </Layout>

                    <Layout style={themedStyle.profileParametersSection}>
                        {
                            (boatBookingInfo) && (
                                <View>
                                    <Text
                                        style={themedStyle.sectionLabel}
                                        category='h6'>
                                        {`${t('Details on costs')}:`}
                                    </Text>
                                    <TextualInfoItem
                                        label={`${t('Cost for')} ${boatBookingInfo?.timeSlot}h:`}
                                        value={`${boatBookingInfo?.price} ${boatBookingInfo?.currency}`}
                                    />
                                    <TextualInfoItem
                                        label={`${t('Service costs')}:`}
                                        value={showServiceCost(BOOKING_FEES_TYPE, boatBookingInfo?.price, boatBookingInfo?.currency)}
                                    />
                                    <View style={themedStyle.footer}>
                                        <Text category='h6'>
                                            {`${t('Total')}:`}
                                        </Text>
                                        <Text category='h6'>
                                            {showTotalCost(BOOKING_FEES_TYPE, boatBookingInfo?.price, boatBookingInfo?.currency)}
                                        </Text>
                                    </View>
                                </View>
                            )
                        }

                    </Layout>
                    <Layout style={themedStyle.layout_bottom}>
                        <View style={themedStyle.layout_bottom_view}>
                            {
                                (peopleState?.totalCount > boatState?.maxCapacity) &&
                                <View style={{alignItems: 'center', marginTop: 14}}>
                                    <Text category='s1' status='warning'
                                    >
                                        {`${t('Number of people can not exceed the boat max capacity')}}(${boatState?.maxCapacity})`}
                                    </Text>
                                </View>
                            }
                            <Button
                                style={themedStyle.confirmButton}
                                onPress={onConfirm}
                                disabled={datetimeState?.startingDateTime == null || boatBookingInfo?.timeSlot == null
                                || peopleState?.totalCount === 0 || peopleState?.totalCount > boatState?.maxCapacity}
                            >
                                {t('CONFIRM')}
                            </Button>
                        </View>
                    </Layout>
                </Layout>
            )}
        </SafeAreaView>
    );
};

export const BookingDetailsScreen = withStyles(BookingDetailsScreenComponent, (theme) => {
    return ({
        imageItem: {
            width: 150,
            height: 100,
            borderRadius: 8,
            marginTop: 8,
            marginHorizontal: 8,
        },
        container: {
            flex: 1,
            height: '100%',
        },
        header: {
            padding: 16,
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
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 24,
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
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        layout_middle: {
            flex: 6,
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
        text: {
            color: theme['color-primary-100'],
            fontWeight: 'bold',
        }
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

