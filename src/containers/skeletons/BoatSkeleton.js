import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import {Rect} from 'react-native-svg';

import React from 'react';
import {
    Image,
    ImageSourcePropType,
    ImageStyle,
    ListRenderItemInfo,
    ScrollView,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {Button, Card, Icon, Layout, StyleService, Text, withStyles} from '@ui-kitten/components';
import {PriceText} from "../../components/common/PriceText";
import {useDispatch} from "react-redux";
import {bookingInfoSet} from '../../actions/BoatActions';
import {ReviewSkeleton} from "../../components/skeletons/ReviewSkeleton";

const BoatSkeletonComponent = (props) => {
    const {themedStyle} = props;

    return (
        <ScrollView>
            <Layout>
                <View style={themedStyle.backgroundImage}>
                    <SvgAnimatedLinearGradient width="100%" height={250} style={themedStyle.backgroundImage}>
                        <Rect x="0" y="0" rx="5" ry="5" width="100%" height="100%"/>
                    </SvgAnimatedLinearGradient>
                </View>
                <Card
                    style={themedStyle.infoContainer}
                    //footer={() => BoatAttributes(boatDetails)}
                >
                    <SvgAnimatedLinearGradient width="100%" height={250}>
                        <Rect x="0" y="10" rx="4" ry="4" width="70%" height="20"/>
                        <Rect x="0" y="55" rx="5" ry="5" width="100" height="20"/>
                        <Rect x="0" y="85" rx="5" ry="5" width="50%" height="35"/>
                        <Rect x="0" y="140" rx="5" ry="5" width="100%" height="100"/>
                    </SvgAnimatedLinearGradient>
                </Card>
                <View style={themedStyle.aboutSection}>
                    <View style={themedStyle.facilitiesSection}>
                        <SvgAnimatedLinearGradient width="100%" height={170}>
                            <Rect x="0" y="10" rx="4" ry="4" width="100" height="20"/>
                            <Rect x="0" y="40" rx="5" ry="5" width="30%" height="120"/>
                            <Rect x="33%" y="40" rx="5" ry="5" width="30%" height="120"/>
                            <Rect x="66%" y="40" rx="5" ry="5" width="30%" height="120"/>
                        </SvgAnimatedLinearGradient>
                    </View>
                </View>
                <View style={themedStyle.aboutSection}>
                    <SvgAnimatedLinearGradient width="100%" height={130}>
                        <Rect x="0" y="10" rx="4" ry="4" width="100" height="20"/>
                        <Rect x="0" y="40" rx="5" ry="5" width="100%" height="20"/>
                        <Rect x="0" y="70" rx="5" ry="5" width="100%" height="20"/>
                        <Rect x="0" y="100" rx="5" ry="5" width="100%" height="20"/>
                    </SvgAnimatedLinearGradient>
                </View>
                <View style={themedStyle.aboutSection}>
                    <SvgAnimatedLinearGradient width="100%" height={130}>
                        <Rect x="0" y="10" rx="4" ry="4" width="100" height="20"/>
                        <Rect x="0" y="40" rx="5" ry="5" width="100%" height="20"/>
                        <Rect x="0" y="70" rx="5" ry="5" width="100%" height="20"/>
                        <Rect x="0" y="100" rx="5" ry="5" width="100%" height="20"/>
                    </SvgAnimatedLinearGradient>
                </View>
                <View style={themedStyle.aboutSection}>
                    <View style={{flexDirection: 'row'}}>
                        <SvgAnimatedLinearGradient width="100%" height={35}>
                            <Rect x="0" y="10" rx="4" ry="4" width="100" height="20"/>
                        </SvgAnimatedLinearGradient>
                    </View>
                    <ReviewSkeleton item={null}/>
                    <SvgAnimatedLinearGradient width="100%" height={35}>
                        <Rect x="0" y="10" rx="4" ry="4" width="150" height="20"/>
                    </SvgAnimatedLinearGradient>
                </View>
            </Layout>
        </ScrollView>
    );
};

export const BoatSkeleton = withStyles(BoatSkeletonComponent, (theme) => {
    return ({
        container: {
            width: "100%",
            height: "100%",
            //backgroundColor: theme['background-basic-color-1'],
        },
        backgroundImage: {
            minHeight: 240,
        },
        infoContainer: {
            marginTop: -40,
            marginHorizontal: 16,
            borderRadius: 12,
            //backgroundColor: theme['background-basic-color-1'],
        },
        detailsContainer: {
            paddingHorizontal: 24,
            paddingVertical: 24,
            borderBottomWidth: 1,
            //borderBottomColor: theme['border-basic-color-2'],
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
            marginVertical: 8,
        },
        imagesList: {
            //backgroundColor: 'background-basic-color-2',
        },
        photoList: {
            marginHorizontal: 16,
            marginVertical: 16,
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
        bookButton: {},
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