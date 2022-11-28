import React, {useEffect, useState} from 'react';
import {
    Alert,
    Image,
    Linking,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {Button, Icon, Layout, Text, withStyles} from '@ui-kitten/components';
import {TextualInfoItem} from "../components/common/TextualInfoItem";
import {
    BOOKING_FEES_FIXED,
    BOOKING_FEES_GUEST,
    BOOKING_FEES_GUEST_FIXED,
    BOOKING_FEES_PERCENTAGE,
    BOOKING_FEES_TYPE,
    BOOKING_STATE_ABORTED,
    BOOKING_STATE_ACCEPTED,
    BOOKING_STATE_BLOCKED,
    BOOKING_STATE_CANCELLED,
    BOOKING_STATE_CLOSED,
    BOOKING_STATE_FINISHED,
    BOOKING_STATE_INPROGRESS,
    BOOKING_STATE_PENDING,
} from "../utils/constraints";
import {Divider} from "../components/common/Divider";
import {HostInfoSection} from "../components/common/HostInfoSection";
import {useSelector} from "react-redux";
import {diffHours, getFirstImage, rightHost, sanitizeBoatId, showServiceCost, showTotalCost, wait} from "../utils";
import {apiError, checkBoat, checkId} from "../utils/errors";
import {API} from 'aws-amplify';
import {LottieLoader} from "../components/common/LottieLoader";
import Toast from "react-native-toast-message";
import {useTranslation} from "react-i18next";

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

const CancelActionBox = (props) => {
    const authState = useSelector((state) => state.auth);
    const {type, reservationId, reservationHost, hostOperation, onRefresh, themedStyle} = props;
    const { t } = useTranslation();

    //TODO CHECK
    function onCancel() {
        API.post("naviigo_api", `/reservation-engine/${reservationId}/cancel?hostUsername=${reservationHost}`, null)
            .then(
                () => {
                    Toast.show({
                        text1: t('Booking deleted'),
                        text2: ``
                    });
                    onRefresh();
                }
            )
            .catch(error => {

                Toast.show({text1: `${t('Something went wrong')}`, text2: `${t('Error')}: ${error.message}`, type: "error"})
            });
    }

    const showCancelAlert = () =>
        Alert.alert(
            t('Delete your booking'),
            t("Are you sure you want to delete your booking?"),
            [
                {
                    text: t('No'),
                    style: "cancel"
                },
                {text: t("Yes"), onPress: () => onCancel()}
            ],
            {cancelable: false}
        );

    function onAbort() {
        API.post("naviigo_api", `/reservation-engine/${reservationId}/abort?hostUsername=${authState.id}`, null)
            .then(
                () => {
                    Toast.show({
                        text1: `${t('Booking aborted')}`,
                        text2: `${t('Contact the renter for more info')}`
                    });
                    onRefresh();
                }
            )
            .catch(error => {
                Toast.show({text1: `${t('Something went wrong')}`, text2: `${t('Error')}: ${error.message}`, type: "error"})
            });
    }

    const showAbortAlert = () =>
        Alert.alert(
            t('Abort your on-going booking'),
            t('Are you sure you want to abort your booking?'),
            [
                {
                    text: t('No'),
                    style: "cancel"
                },
                {text: t("Yes"), onPress: () => onCancel()}
            ],
            {cancelable: false}
        );

    return (
        <View>
            {
                ((type === BOOKING_STATE_PENDING && !hostOperation) || type === BOOKING_STATE_ACCEPTED) && (
                    <Button size='large' status='danger' appearance='ghost'
                            onPress={showCancelAlert}
                    >
                        {t("Delete your booking")}
                    </Button>)
            }
            {
                (type === BOOKING_STATE_CANCELLED) && (
                    <View style={{alignItems: 'center', marginTop: 14}}>
                        <Text category='s1' status='warning'
                        >
                            {t('Your booking was cancelled or expired')}
                        </Text>
                    </View>
                )
            }
            {
                (type === BOOKING_STATE_BLOCKED) && (
                    <View style={{alignItems: 'center', marginTop: 14}}>
                        <Text category='s1' status='success'
                        >
                            {t('The booking fully confirmed, you can\'t do any operation. Contact the host for any issue.')}
                        </Text>
                        <Button size='large' status='danger' appearance='ghost'
                                onPress={showAbortAlert}
                        >
                            {t('Abort the booking')}
                        </Button>
                    </View>
                )
            }
            {
                (type === BOOKING_STATE_INPROGRESS) && (
                    <View style={{alignItems: 'center', marginTop: 14}}>
                        <Text category='s1' status='success'
                        >
                            {t('The booking is in progress, you can\'t do any operation. Contact the host for any issue.')}
                        </Text>
                        <Button size='large' status='danger' appearance='ghost'
                                onPress={showAbortAlert}
                        >
                            {t('Abort the booking')}
                        </Button>
                    </View>
                )
            }
            {
                (type === BOOKING_STATE_FINISHED || type === BOOKING_STATE_CLOSED) && (
                    <View style={{alignItems: 'center', marginTop: 14}}>
                        <Text category='s1' status='danger'
                        >
                            {t('The booking is finished')}
                        </Text>
                    </View>
                )
            }
            {
                (type === BOOKING_STATE_ABORTED) && (
                    <View style={{alignItems: 'center', marginTop: 14}}>
                        <Text category='s1' status='danger'
                        >
                            {t('The booking is aborted due to some issues. Contact the host for more info.')}
                        </Text>
                    </View>
                )
            }
        </View>
    );
};


const BookingActionsBox = (props) => {
    const authState = useSelector((state) => state.auth);
    const {type, hostOperation, reservationId, onRefresh, themedStyle} = props;
    const { t } = useTranslation();

    function onDeny() {
        //TODO DO API CALL
        API.post("naviigo_api", `/reservation-engine/${reservationId}/reject?hostUsername=${authState.id}`, null)
            .then(
                () => {
                    Toast.show({
                        text1: t('Booking denied'),
                        text2: ``
                    });
                    onRefresh();
                }
            )
            .catch(error => {
                Toast.show({text1: `${t('Something went wrong')}`, text2: `${t('Error')}: ${error.message}`, type: "error"})
            });
    }

    function onAccept() {
        API.post("naviigo_api", `/reservation-engine/${reservationId}/accept?hostUsername=${authState.id}`, null)
            .then(
                () => {
                    Toast.show({
                        text1: t('Booking confirmed'),
                        text2: ``
                    });
                    onRefresh();
                }
            )
            .catch(error => {
                Toast.show({text1: `${t('Something went wrong')}`, text2: `${t('Error')}: ${error.message}`, type: "error"})
            });
    }

    function onReview() {
        Alert.alert(t("Still work in progress!"))
    }

    const CallEmailActions = () => (
        <View style={themedStyle.layout_bottom_view}>
            <Button
                style={themedStyle.buttonAction}
                icon={() => <Icon fill='white' name='email'/>}
                onPress={() => Linking.openURL('mailto:info@naviigo.com?subject=example&body=example')} //todo use host email
            >
                {t('Send email')}
            </Button>
            <Button
                style={themedStyle.buttonAction}
                icon={() => <Icon fill='white' name='phone'/>}
                onPress={() => Linking.openURL('tel:3407843899')} //todo use host phone
            >
                {t('Call')}
            </Button>
        </View>
    );

    const AcceptDenyActions = () => (
        <View style={themedStyle.layout_bottom_view}>
            <Button
                status='danger'
                style={themedStyle.buttonAction}
                icon={() => <Icon fill='white' name='close-outline'/>}
                onPress={onDeny}
            >
                {t('Deny booking')}
            </Button>
            <Button
                status='success'
                style={themedStyle.buttonAction}
                icon={() => <Icon fill='white' name='checkmark-outline'/>}
                onPress={onAccept} //TODO DO API CALL
            >
                {t('Accept booking')}
            </Button>
        </View>
    );

    const ReviewAction = () => (
        <View style={themedStyle.layout_bottom_view}>
            <Button
                status='warning'
                style={themedStyle.buttonAction}
                icon={() => <Icon fill='white' name='star'/>}
                onPress={onReview}
            >
                {t('Write a review')}
            </Button>
        </View>
    );

    return (
        <View>
            {(type === BOOKING_STATE_ACCEPTED) && <CallEmailActions/>}
            {(type === BOOKING_STATE_PENDING && hostOperation) && <AcceptDenyActions/>}
            {(type === BOOKING_STATE_FINISHED) && <ReviewAction/>}
        </View>
    );

};

const ManageBookingScreenComponent = (props) => {
    const {navigation, themedStyle, route} = props;
    const { t } = useTranslation();
    const authState = useSelector((state) => state.auth);
    const {hostId, reservationId, reservationObject} = route?.params;
    const [reservation, setReservation] = useState();
    const [isFetching, setIsFetching] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [boatReservation, setBoatReservation] = useState();
    const [boatHost, setBoatHost] = useState(null);

    useEffect(() => getData(), []);

    const getData = () => {
        if (reservationObject != null) {
            //if the object is passed by navigation do not call API
            setReservation({...reservationObject});
            return;
        }

        if (!checkId(reservationId) || !checkId(hostId)) {
            return;
        }

        setIsFetching(true);

        API.get("naviigo_api", `/reservations/${reservationId}?hostUsername=${hostId}`, null)
        //.then(response => dispatch(dataSet(response)))
            .then(response => {
                setReservation(response);
                console.log(response)
            })
            .catch(error => {
                apiError(error.message);
            })
            .finally(() => {
                setIsFetching(false);
                setRefreshing(false);
            });


    };

    useEffect(() => {
        setIsFetching(true);
        API.get("naviigo_api", `/boats/${sanitizeBoatId(reservation?.boatId)}?hostUsername=${hostId}`, null)
        //.then(response => dispatch(dataSet(response)))
            .then(response => setBoatReservation(response))
            .catch(error => {
                //apiError(error.message);
            })
            .finally(() => setIsFetching(false));
    }, [reservation]);

    useEffect(() => {
        if (boatReservation?.hostUsername) {
            setIsFetching(true);
            API.get("naviigo_api", `/users/${boatReservation.hostUsername}`, null)
                .then(response => setBoatHost(response))
                .catch(error => {
                    //apiError(error.message, 'GET host');
                })
                .finally(() => setIsFetching(false));
        }
    }, [boatReservation]);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => getData());
    }, []);

    useEffect(() => {
        if(!isFetching){
            setRefreshing(false);
        }
    }, [isFetching]);

    return (
        <SafeAreaView style={{flex: 1}}>
            {(isFetching) ? <LottieLoader/> :
                    <Layout style={{flex: 1}}>
                        <ScrollView
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                        >
                        <Layout
                            style={themedStyle.layout_top}
                            level='1'>
                            <View style={themedStyle.profileContainer}>
                                <View style={themedStyle.profileDetailsContainer}>
                                    <Text category='h5'>
                                        {boatReservation?.name}
                                    </Text>
                                    <Text
                                        appearance='hint'
                                        category='s1'>
                                        {`${(boatReservation?.formatted_address) ? boatReservation?.formatted_address : ''}`}
                                    </Text>
                                </View>
                                <Image
                                    style={themedStyle.imageItem}
                                    source={{uri: getFirstImage(boatReservation?.images)}}
                                />
                            </View>
                            {
                                (!rightHost(authState)) ? (
                                    <HostInfoSection
                                        position={'right'}
                                        name={(boatHost?.username) ? boatHost?.username : boatReservation?.hostUsername}
                                        type={(boatHost?.type) ? boatHost?.type : 'Host'}
                                    />
                                ) : (
                                    <HostInfoSection
                                        position={'right'}
                                        name={boatReservation?.guestUsername}
                                        type={'Guest'}
                                    />
                                )
                            }
                            <Divider/>
                            <View style={themedStyle.profileSocialsContainer}>
                                <BookingDetailBox
                                    hint={`${t('Starting at')}:`}
                                    value={new Date(reservation?.appointment?.from).toLocaleString()}
                                />
                                <BookingDetailBox
                                    hint={`${t('Hours')}:`}
                                    value={`${diffHours(reservation?.appointment?.to, reservation?.appointment?.from)}`}
                                />
                                <BookingDetailBox
                                    hint={`${t('People')}:`}
                                    value={reservation?.people}
                                />
                            </View>
                            <Divider/>
                        </Layout>
                        <Layout style={themedStyle.layout_middle}>
                            <Text
                                style={themedStyle.sectionLabel}
                                category='h6'>
                                {`${t('Details on costs')}:`}
                            </Text>
                            <TextualInfoItem
                                label={`${t('Cost for')} ${diffHours(reservation?.appointment?.to, reservation?.appointment?.from)}h:`}
                                value={`${reservation?.price} ${reservation?.currency}`}
                            />
                            <TextualInfoItem
                                label={`${t('Service costs')}:`}
                                value={showServiceCost(BOOKING_FEES_TYPE, reservation?.price, reservation?.currency)}
                            />
                            <View style={themedStyle.footer}>
                                <Text category='h6'>{`${t('Total')}:`}</Text>
                                <Text category='h6'>
                                    {showTotalCost(BOOKING_FEES_TYPE, reservation?.price, reservation?.currency)}
                                </Text>
                            </View>
                            <Divider/>
                            <CancelActionBox
                                onRefresh={onRefresh}
                                hostOperation={rightHost(authState)}
                                reservationId={reservation?.reservationId}
                                reservationHost={reservation?.hostUsername}
                                type={reservation?.state}
                                {...props}/>
                        </Layout>
                        <Layout style={themedStyle.layout_bottom}>
                            <BookingActionsBox
                                onRefresh={onRefresh}
                                hostOperation={rightHost(authState)}
                                reservationId={reservation?.reservationId}
                                type={reservation?.state}
                                {...props}/>
                        </Layout>
                        </ScrollView>
                    </Layout>
            }
        </SafeAreaView>
    );
};

export const ManageBookingScreen = withStyles(ManageBookingScreenComponent, (theme) => {
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
            padding: 16,
        },
        layout_middle: {
            flex: 3,
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

