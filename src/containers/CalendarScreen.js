import React, {useEffect, useState} from 'react';
import {SafeAreaView, TouchableOpacity, View, ScrollView, RefreshControl} from 'react-native';
import {Icon, Layout, Text, TopNavigation, TopNavigationAction, withStyles} from '@ui-kitten/components';
import {Agenda} from 'react-native-calendars';
import moment from 'moment';
import {useSelector} from "react-redux";
import {capitalizeFirstLetter, convertToLocalDate, rightHost} from "../utils";
import {API} from 'aws-amplify';
import {LottieLoader} from "../components/common/LottieLoader";
import {BOOKING_STATE_BLOCKED} from "../utils/constraints";
import {useTranslation} from "react-i18next";

const CalendarScreenComponent = (props) => {
    const authState = useSelector((state) => state.auth);
    const {themedStyle} = props;
    const { t } = useTranslation();
    const [reservations, setReservations] = useState({});
    const [isFetching, setIsFetching] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => getData(), []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getData();
    }, []);

    const getData = () => {
        setIsFetching(true);

        const userReqParam = (rightHost(authState)) ? 'hostUsername' : 'guestUsername';

        API.get("naviigo_api", `/reservations?${userReqParam}=${authState.id}`, null)
        //.then(response => dispatch(dataSet(response)))
            .then(response => {
                let dataToReturn = {};
                response.forEach((res) => {
                    let start = convertToLocalDate(res?.appointment?.from);
                    if (!dataToReturn[start]) {
                        dataToReturn[start] = [];
                    }

                    let title = '';
                    let state = '';
                    if (rightHost(authState) && res?.guestUsername === res?.hostUsername) {
                        title = t('Blocked period by you');
                        state = BOOKING_STATE_BLOCKED;
                    } else {
                        title = `${t('Booking')} ${(rightHost(authState)) ? `${t('from')} ${capitalizeFirstLetter(res.guestUsername)}` : `${t('with')} ${capitalizeFirstLetter(res.hostUsername)}`}`
                        state = res?.state;
                    }

                    dataToReturn[start].push(
                        {
                            id: res?.reservationId,
                            hostId: res?.hostUsername,
                            name: title,
                            state: state,
                            start: res?.appointment?.from,
                            end: res?.appointment?.to         //TODO FIX MULTIPLE DAY TIMES
                        }
                    )
                });
                delete dataToReturn?.undefined;
                setReservations(dataToReturn)
            })
            .catch(error => {
                console.log(error);
                alert(error.message);
            })
            .finally(() => {
                setIsFetching(false);
                setRefreshing(false);
            });
    };


    const renderItem = (item, firstItemInDay, props) => {
        return (
            <TouchableOpacity
                style={[themedStyle.item, {height: item.height}]}
                onPress={() => props.navigation.navigate('ManageBooking', {
                    reservationId: item.id,
                    hostId: item.hostId
                })}
            >
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: '#555'}}>{item.name}</Text>
                        <Text category='label'>{item.state}</Text>
                    </View>
                    <Text
                        style={{color: '#555'}}>{`${moment(item.start).format("HH:mm")} - ${moment(item.end).format("HH:mm")}`}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyDate = () => {

        return (
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            >
            <View style={themedStyle.emptyDate}>
                <Text category={'h6'}>{t('No reservations')}</Text>
            </View>
            </ScrollView>
        );
    };

    const BlockIcon = (props) => (
        <Icon {...props} name={"slash-outline"}/>
    );
    const ChartIcon = (props) => (
        <Icon {...props} name={"pie-chart-outline"}/>
    );

    const BlockAction = (props) => (
        <TopNavigationAction {...props} icon={BlockIcon}/>
    );

    const ChartAction = (props) => (
        <TopNavigationAction {...props} icon={ChartIcon}/>
    );

    const renderRightControls = (props) => [
        <ChartAction
            onPress={() => props.navigation.navigate("ChartScreen", {reservations: props?.reservations})}
            accessibilityHint={t('Chart screen')}
        />,
        <BlockAction
            onPress={() => props.navigation.navigate("BlockPeriod")}
            accessibilityHint={t('Block a time period')}
        />
    ];

    return (
        <SafeAreaView style={{flex: 1}}>
            <TopNavigation
                alignment='center'
                title='Calendar'
                rightControls={(rightHost(authState)) && renderRightControls({reservations, ...props})}
            />
            <Layout style={themedStyle.layout_middle}>
                {
                    (isFetching) ? <LottieLoader/>
                        : <Agenda
                                // The list of items that have to be displayed in agenda. If you want to render item as empty date
                                // the value of date key has to be an empty array []. If there exists no value for date key it is
                                // considered that the date in question is not yet loaded
                                items={reservations}
                                renderItem={(item, firstItemInDay) => renderItem(item, firstItemInDay, props)}
                                // Specify what should be rendered instead of ActivityIndicator
                                renderEmptyData={() => renderEmptyDate()}
                                // Specify your item comparison function for increased performance
                                rowHasChanged={(r1, r2) => {
                                    return r1.name !== r2.name
                                }}
                                style={{width: "100%", height: "100%"}}
                                onRefresh={onRefresh}
                                // Set this true while waiting for new data from a refresh
                                refreshing={refreshing}
                            />
                }
            </Layout>
        </SafeAreaView>
    );
};

export const CalendarScreen = withStyles(CalendarScreenComponent, theme => ({
    layout_middle: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme['color-primary-100'],
        //backgroundColor: theme['color-primary-transparent-100'],
    },
    text: {
        color: theme['color-primary-100'],
        fontWeight: 'bold',
    },
    item: {
        backgroundColor: theme['color-primary-100'],
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        alignItems: 'center',
        flex: 1,
        paddingTop: 30
    }
}));

