import React from 'react';
import {ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Layout, Text, withStyles} from "@ui-kitten/components";
import {PriceText} from "./common/PriceText";
import {getFirstImage} from "../utils";
import {useTranslation} from "react-i18next";

const SmallBoatCardComponent = (props) => {
    const {boat, key, onPress, themedStyle} = props;
    const { t } = useTranslation();
    const {item} = boat;
    return (
        <Layout style={themedStyle.cardContainer} key={key}>
            <TouchableOpacity
                style={themedStyle.item}
                activeOpacity={0.95}
                onPress={onPress}>
                <ImageBackground
                    style={themedStyle.itemSection}
                    imageStyle={themedStyle.image}
                    source={{uri: getFirstImage(item?.images)}}
                />
                <View style={themedStyle.itemSection}>
                    <Text
                        style={themedStyle.itemTitle}
                        category='h6'>
                        {item?.name}
                    </Text>
                    <Text
                        style={themedStyle.rentLabel}
                        appearance='hint'
                        category='p2'>
                        {t('Min Price')}
                    </Text>
                    <PriceText
                        style={themedStyle.priceLabel}
                        valueStyle={themedStyle.priceValueLabel}
                        scaleStyle={themedStyle.priceScaleLabel}
                        scale={''}>
                        {
                            `${item?.price?.minHourPrice} ${item?.price?.currency}`
                        }

                    </PriceText>
                </View>
            </TouchableOpacity>
        </Layout>
    );
};

export const SmallBoatCard = withStyles(SmallBoatCardComponent, (theme) => {

    return ({
        cardContainer: {
            height: 160,
            width: "100%",
            borderRadius: 24,
            marginTop: 8,
        },
        readButton: {
            width: '50%',
            marginTop: 32,
        },
        headingArticleContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            height: 320,
        },
        headingArticleTitle: {
            zIndex: 1,
            textAlign: 'center',
        },
        headingArticleDescription: {
            zIndex: 1,
        },
        item: {
            flexDirection: 'row',
            minHeight: 188,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowOpacity: 0.8,
            elevation: 6,
            shadowRadius: 24,
            shadowOffset: {width: 3, height: 3},
        },
        image: {
            borderBottomLeftRadius: 24,
            borderTopLeftRadius: 24,
            height: 160,
            overflow: 'hidden',
        },
        itemSection: {
            flex: 1,
            padding: 16,
            borderRadius: 24
        },
        itemReactionsContainer: {
            justifyContent: 'center',
            marginTop: 8,
        },
        itemTitle: {
            overflow: 'hidden',
            maxWidth: 200,
        },
        iconButton: {
            paddingHorizontal: 0,
        },
        priceLabel: {
            marginTop: 8,
        },
        priceValueLabel: {
            //fontFamily: 'opensans-bold',
            fontSize: 16,
            lineHeight: 32,
        },
        priceScaleLabel: {
            fontSize: 13,
            lineHeight: 24,
            //fontFamily: 'opensans-regular',
            fontWeight: 'normal',
        },
        rentLabel: {
            marginTop: 24,
            //fontFamily: 'opensans-regular',
            fontWeight: 'normal',
        },
    });
});

const style = StyleSheet.create({});