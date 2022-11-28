import React from 'react';
import {StyleSheet} from 'react-native';
import {Card, StyleService, Text} from "@ui-kitten/components";
import {ImageOverlay} from "./common/ImageOverlay";
import {locationSet} from "../actions/SearchActions";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";

const PlaceCard = (props) => {
    const dispatch = useDispatch();
    const {item, onPress, currentRefinement, refine} = props;
    const { t } = useTranslation();
    const handlePlaceCardClick = () => {
        if(onPress){
            onPress();
            return;
        }

        /*
            DEFAULT ACTION
         */
        let location = {
            city: item?.title,
            latitude: item?.location?.lat,
            longitude: item?.location?.lng,
            northeast: item?.viewport?.northeast,
            southwest: item?.viewport?.southwest,
        };

        //TODO Algolia refine
        // refine(
        //     {
        //         northEast: location.northeast,
        //         southWest: location.southwest
        //     }
        // );
        dispatch(locationSet(location));

    };
    return (
        <Card
            key={item.title}
            style={style.container}
            onPress={() => handlePlaceCardClick()}
        >
            <ImageOverlay
                style={style.image}
                source={{uri: item.image}}
            >
                <Text
                    style={style.level}
                    category='s1'
                    status='control'>
                    {t(item.subtitle)}
                </Text>
                <Text
                    style={style.title}
                    category='h2'
                    status='control'>
                    {t(item.title)}
                </Text>
            </ImageOverlay>
        </Card>
    );
};

const style = StyleService.create({
    container: {
        height: 200,
        borderRadius: 24,
        marginVertical: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        height: 200,
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    level: {
        zIndex: 1,
    },
    title: {
        zIndex: 1,
    },
});

export default PlaceCard;