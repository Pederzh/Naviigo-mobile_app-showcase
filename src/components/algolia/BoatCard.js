import React from 'react';
import {ImageBackground, View} from 'react-native';
import {Avatar, Button, Card, StyleService, Text, withStyles} from "@ui-kitten/components";
import {Ionicons} from "@expo/vector-icons";
import {capitalizeFirstLetter, getFirstImage, sanitizeUsername} from "../../utils";

const renderItemHeader = (item) => {
    let image = getFirstImage(item?.images);
    return (
        <ImageBackground
            style={style.itemHeader}
            source={{uri: image}}
        />
    );
};

const renderItemFooter = (item) => {
    const title = `${(item?.ratingAvg) ? item?.ratingAvg : 0} (${(item?.ratingCount) ? item?.ratingCount : 0})`;

    return (
        <View style={style.itemFooter}>
            <Avatar source={{uri: ``}}/>
            <View style={style.itemAuthoringContainer}>
                <Text
                    category='s2'>
                    {capitalizeFirstLetter(sanitizeUsername(item?.hostUsername))}
                </Text>
                <Text
                    appearance='hint'
                    category='c1'>
                    {item?.formatted_address}
                </Text>
            </View>
            <Button
                style={style.iconButton}
                appearance='ghost'
                status='basic'
            >
                <Ionicons name="md-people"/>
                {item?.maxCapacity}
            </Button>

        </View>
    );
};

const BoatCardComponent = (props) => {
    const {item} = props;

    return (
        <Card
            key={item?.id}
            style={style.item}
            header={() => renderItemHeader(item)}
            footer={() => renderItemFooter(item)}
            onPress={() => props.navigation.navigate('BoatScreenDualViz', {id: item?.id, hostUsername: item?.hostUsername})}
        >
            <Text category='h5'>
                {item?.name}
            </Text>
            <Text
            style={style.itemContent}
            appearance='hint'
            category='s1'>
            {item?.category}
            </Text>
        </Card>
    );
};

export const BoatCard = withStyles(BoatCardComponent, (theme) => {
    return ({});
});

const style = StyleService.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    item: {
        flex: 1,
        width: "100%",
        borderRadius: 24,
        marginVertical: 8,
    },
    itemHeader: {
        height: 220,
    },
    itemContent: {
        marginVertical: 8,
    },
    itemFooter: {
        flexDirection: 'row',
        marginHorizontal: -8,
    },
    iconButton: {
        paddingHorizontal: 0,
    },
    itemAuthoringContainer: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
    },
});