import React, {useEffect, useState} from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import {Button, Card, Icon, Layout, List, StyleService, Text, withStyles} from '@ui-kitten/components';
import {Review} from "../components/Review";
import {ImageOverlay} from "../components/common/ImageOverlay";
import {PriceText} from "../components/common/PriceText";
import boatRatings from '../core/models/boatRatings.json';
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import {bookingInfoSet} from '../actions/BoatActions';
import {BoatSkeleton} from "./skeletons/BoatSkeleton";
import {API} from 'aws-amplify';
import {getFirstImage, sanitizeBoatId} from "../utils";
import {apiError, checkBoat, checkId} from "../utils/errors";
import {useTranslation} from "react-i18next";

const FacilityItem = (props) => {
    const FacilityIcon = props.icon;
    return (
        <Card style={props.themedStyle.facilityItem}>
            <FacilityIcon/>
            <Text
                appearance='hint'
                category='s1'>
                {props.text}
            </Text>
        </Card>
    );
};

const BoatPrices = ({prices, currency, style}) => {
    const { t } = useTranslation();
    return (
        <View>
            <View style={style.optionList}>
            </View>
            <Text category='s1'>
                {t("Select how many hours")}
            </Text>
            <View style={style.list}>
                {(prices.map((price) => {
                        let priceItem = {
                            minutes: price[0],
                            timeSlot: price[0] / 60,
                            price: price[1],
                            currency: currency
                        };
                        return (
                            <BoatPriceTimeItem
                                key={priceItem.minutes}
                                item={priceItem}
                            />)
                    }
                ))}
            </View>
        </View>
    );
};

const ImageItem = ({item}) => {
        return (
            <Image
                key={item?.item?.path}
                style={style.imageItem}
                source={{uri: item?.item?.path}}
            />
        )
    }
;

const BoatPriceTimeItem = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const onPriceClick = () => dispatch(bookingInfoSet(props.item));

    const ClockIcon = (style) => (
        <Icon
            {...style}
            name='clock-outline'
        />
    );

    return (
        <View style={style.priceItem}>
            <TouchableOpacity onPress={onPriceClick}>
                <Layout
                    style={style.priceTimeContainer}
                    level='2'>
                    <View style={{flexDirection: 'row'}}>
                        <PriceText
                            style={style.priceLabel}
                            valueStyle={style.priceValueLabel}
                            scaleStyle={style.priceScaleLabel}>
                            {`${props.item.price} ${props.item.currency}`}
                        </PriceText>
                    </View>
                    <Button
                        style={style.priceTimeButton}
                        size='tiny'
                        onPress={onPriceClick}
                        icon={ClockIcon}>
                        {`${t("Rent for")} ${props.item.timeSlot} ${t('h')}`}
                    </Button>
                </Layout>

           </TouchableOpacity>
        </View>
    );
};


const BoatScreenComponent = (props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    //Access Redux Store State
    const boatBookingInfo = useSelector((state) => state.currentBoat?.bookingInfo);
    //const authState = useSelector((state) => state.auth);

    const [boatDetails, setBoatDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [costPerMinutesMatrix, setCostPerMinutesMatrix] = useState(Object.entries((boatDetails?.price) ? boatDetails?.price?.costPerMinutes : []));

    const {themedStyle, navigation, route} = props;

    const id = (props.id) ? (props.id) : (route?.params?.id);
    const hostUsername = (props.hostUsername) ? (props.hostUsername) : route?.params?.hostUsername;

    useEffect(() => getData(), []);
    const getData = () => {
        setIsFetching(true);
        if (!checkBoat(id, hostUsername)) {
            return;
        }

        API.get("naviigo_api", `/boats/${sanitizeBoatId(id)}?hostUsername=${hostUsername}`, null)
            .then(response => setBoatDetails(response))
            .catch(error => {
                apiError(error.message, 'GET boat');
            })
            .finally(() => setIsFetching(false));

    };

    useEffect(() => {
        setCostPerMinutesMatrix(Object.entries((boatDetails?.price) ? boatDetails?.price?.costPerMinutes : []));
    }, [boatDetails]);

    const maxCapacityIcon = () => (
        <Ionicons style={themedStyle.facilityIcon} size={30} name="md-people"/>);
    const horsePowerIcon = () => (
        <MaterialCommunityIcons style={themedStyle.facilityIcon} size={30} name="pinwheel-outline"/>);
    const drivingModeIcon = () => (
        <MaterialCommunityIcons style ={themedStyle.facilityIcon} size={30} name="ship-wheel"/>);

    return (
        <Layout>
            {(isFetching) ? (
                <BoatSkeleton/>
            ) : (
                <ScrollView>
                    <View>
                        <ImageOverlay
                            style={themedStyle.backgroundImage}
                            source={{uri: getFirstImage(boatDetails?.images)}}
                        />
                        <Card
                            style={themedStyle.infoContainer}
                            footer={() => <BoatPrices
                                    prices={costPerMinutesMatrix}
                                    currency={boatDetails?.price?.currency}
                                />}
                        >
                            <View>
                                <Text
                                    style={themedStyle.titleLabel}
                                    category='h5'>
                                    {boatDetails?.name}
                                </Text>
                                <Text
                                    style={themedStyle.rentLabel}
                                    appearance='hint'
                                    category='p2'>
                                    {t("Price")}
                                </Text>
                                <View style={themedStyle.bookContainer}>
                                    <PriceText
                                        style={themedStyle.priceLabel}
                                        valueStyle={themedStyle.priceValueLabel}
                                        scaleStyle={themedStyle.priceScaleLabel}
                                        scale={(boatBookingInfo != null) ? `${t('for')} ${boatBookingInfo?.timeSlot} h` : ''}>
                                        {
                                            (boatBookingInfo != null) ?
                                                `${boatBookingInfo?.price} ${boatBookingInfo?.currency} `
                                                :
                                                (
                                                    (costPerMinutesMatrix.length > 0) ?
                                                        `${costPerMinutesMatrix[0][1]} ${boatDetails?.price?.currency} - ${costPerMinutesMatrix[costPerMinutesMatrix.length - 1][1]} ${boatDetails?.price?.currency}`
                                                        :
                                                        null
                                                )

                                        }
                                    </PriceText>
                                    <Button
                                        disabled={boatBookingInfo == null}
                                        style={themedStyle.bookButton}
                                        onPress={() => navigation.navigate('BookingDetailsScreen', {boatObject: boatDetails, hostUsername: hostUsername})}
                                    >
                                        {t('BOOK NOW')}
                                    </Button>
                                </View>
                            </View>
                        </Card>
                        <View style={themedStyle.aboutSection}>
                            <Text
                                style={themedStyle.sectionLabel}
                                category='h6'>
                                {t("Details")}
                            </Text>
                            <Text
                                style={themedStyle.titleLabel}
                                category='p1'>
                                {boatDetails?.manufacturer}
                            </Text>
                            <View style={themedStyle.facilitiesSection}>
                                <FacilityItem
                                    text={`${t(boatDetails?.drivingMode)}`}
                                    icon={drivingModeIcon}
                                    {...props}
                                />
                                <FacilityItem
                                    text={`${boatDetails?.maxCapacity} ${t('people')}`}
                                    icon={maxCapacityIcon}
                                    {...props}
                                />
                                <FacilityItem
                                    text={`${boatDetails?.hp} hp`}
                                    icon={horsePowerIcon}
                                    {...props}
                                />
                            </View>
                        </View>
                        <View style={themedStyle.aboutSection}>
                            <Text
                                style={themedStyle.sectionLabel}
                                category='h6'>
                                {t("About")}
                            </Text>
                            <Text style={themedStyle.description} appearance='hint'>
                                {boatDetails?.description}
                            </Text>
                        </View>
                        <View style={themedStyle.photoSection}>
                            <Text
                                style={themedStyle.sectionImageLabel}
                                category='h6'>

                            </Text>
                            <List
                                contentContainerStyle={themedStyle.imagesList}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={boatDetails?.images}
                                renderItem={(item) => <ImageItem item={item}/>}
                            />
                        </View>
                        <View style={themedStyle.aboutSection}>
                            <View style={{flexDirection: 'row'}}>
                                <Text
                                    style={themedStyle.sectionLabel}
                                    category='h6'>
                                    {t("Reviews")}
                                </Text>
                                <Button
                                    style={style.iconButton}
                                    appearance='ghost'
                                    status='basic'
                                >
                                    <Ionicons name="md-star"/>
                                    {boatDetails?.ratingAvg}
                                </Button>
                            </View>
                            <Review item={boatRatings.boatRatings[0]}/>
                            <Text onPress={() => console.log("goto review page")} status='info'>
                                {`${t('View all')} ${boatDetails?.ratingCount} ${t('reviews')}`}

                            </Text>
                        </View>
                    </View>
                </ScrollView>
            )}
        </Layout>
    );
};

export const BoatScreen = withStyles(BoatScreenComponent, (theme) => {
    return ({
        container: {
            width: "100%",
            height: "100%",
        },
        backgroundImage: {
            minHeight: 240,
        },
        infoContainer: {
            marginTop: -40,
            marginHorizontal: 16,
            borderRadius: 12,
            backgroundColor: theme['background-basic-color-1'],
        },
        detailsContainer: {
            paddingHorizontal: 24,
            paddingVertical: 24,
            borderBottomWidth: 1,
            borderBottomColor: theme['border-basic-color-2'],
        },
        bookContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        facilitiesSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        aboutSection: {
            marginHorizontal: 12,
            marginVertical: 12,
        },
        photoSection: {
            marginVertical: 12,
            paddingHorizontal: 0,
        },
        imagesList: {
            paddingHorizontal: 8,
        },
        titleLabel: {
            //fontFamily: 'opensans-bold',
            fontWeight: 'normal',
        },
        rentLabel: {
            marginTop: 24,
            //fontFamily: 'opensans-regular',
            fontWeight: 'normal',
        },
        bookButton: {
            marginLeft: 8,
        },
        priceLabel: {
            marginTop: 8,
        },
        priceValueLabel: {
            //fontFamily: 'opensans-bold',
            fontSize: 26,
            lineHeight: 32,
        },
        priceScaleLabel: {
            fontSize: 13,
            lineHeight: 24,
            //fontFamily: 'opensans-regular',
            fontWeight: 'normal',
        },
        sectionLabel: {
            marginVertical: 8,
        },
        sectionImageLabel: {
            marginVertical: 8,
            marginHorizontal: 12,
        },
        aboutLabel: {
            marginVertical: 16,
            //fontFamily: 'opensans-regular',
            fontWeight: 'normal',
        },
        photoLabel: {
            marginHorizontal: 24,
        },
        facilityIcon: {
            width: 48,
            height: 48,
            color: theme['text-basic-color'],
        },
        facilityItem: {
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            height: 120,
            width: '30%',
            margin: 8,
            borderRadius: 20,
            borderColor: theme['text-basic-color'],
        },
    })
});

const style = StyleService.create({
    optionList: {
        flexDirection: 'row',
        marginHorizontal: -4,
        marginVertical: 8,
    },
    optionItem: {
        marginHorizontal: 4,
        paddingHorizontal: 0,
    },
    imageItem: {
        width: 240,
        height: 160,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    priceTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 4,
        marginHorizontal: -8,
        lineHeight: 32,
        marginVertical: 4,
    },
    priceTimeText: {
        marginHorizontal: 16,
        marginVertical: 14,
    },
    priceTimeButton: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderRadius: 24,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    priceItem: {
        paddingHorizontal: 8,
        paddingVertical: 0,
    },
    priceLabel: {
        marginHorizontal: 6,
    },
    priceValueLabel: {
        marginVertical: 8,
        fontSize: 21,
    },
    priceScaleLabel: {
        marginVertical: 8,
        fontSize: 13,
    },


});