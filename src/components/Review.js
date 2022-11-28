import React from 'react';
import {ListRenderItemInfo, View} from 'react-native';
import {Avatar, Button, Card, StyleService, Text, withStyles,} from '@ui-kitten/components';
import {Ionicons} from "@expo/vector-icons";

const renderReviewHeader = (item) => {
    return (
        <View style={style.commentHeader}>
            <Avatar source={require('naviigo/assets/img/avatar1.png')}/>
            <View style={style.commentAuthorContainer}>
                <Text category='s2'>{item.userReviewer.username}</Text>
                <Text appearance='hint' category='c1'>{item.dateTime}</Text>
            </View>
            <Button
                style={style.iconButton}
                appearance='ghost'
                status='basic'
            >
                <Ionicons name="md-star"/>
                {item.stars}
            </Button>
        </View>
    );
};

const ReviewComponent = (props) => {
    const {themedStyle, item} = props;
    //todo
    return (
        <Card
            style={themedStyle.commentItem}
            header={() => renderReviewHeader(item)}>
            <Text>{item?.review}</Text>
        </Card>
    );
};

export const Review = withStyles(ReviewComponent, (theme) => {
    return ({
        commentItem: {
            marginVertical: 8,
        },
        commentHeader: {
            flexDirection: 'row',
            padding: 16,
        },
        commentAuthorContainer: {
            flex: 1,
            marginHorizontal: 16,
        },
        commentReactionsContainer: {
            flexDirection: 'row',
            marginTop: 8,
            marginHorizontal: -8,
            marginVertical: -8,
        },
        iconButton: {
            paddingHorizontal: 0,
        },
    });
});

const style = StyleService.create({
    commentItem: {
        marginVertical: 8,
        marginHorizontal: 16,
    },
    commentHeader: {
        flexDirection: 'row',
        padding: 16,
    },
    commentAuthorContainer: {
        flex: 1,
        marginHorizontal: 16,
    },
    commentReactionsContainer: {
        flexDirection: 'row',
        marginTop: 8,
        marginHorizontal: -8,
        marginVertical: -8,
    },
    iconButton: {
        paddingHorizontal: 0,
    },
});