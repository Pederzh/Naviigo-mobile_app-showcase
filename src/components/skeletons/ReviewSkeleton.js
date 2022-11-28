import React from 'react';
import {ListRenderItemInfo, View} from 'react-native';
import {Card, StyleService, Text, withStyles,} from '@ui-kitten/components';
import {Circle, Rect} from "react-native-svg";
import SvgAnimatedLinearGradient from "react-native-svg-animated-linear-gradient";

const renderReviewHeader = (item) => {
    return (
        <View style={style.commentHeader}>
            <SvgAnimatedLinearGradient width="100%" height={60}>
                <Circle cx="30" cy="30" r="30"/>
                <Rect x="75" y="13" rx="4" ry="4" width="100" height="15"/>
                <Rect x="75" y="37" rx="4" ry="4" width="50" height="12"/>
            </SvgAnimatedLinearGradient>
        </View>
    );
};

const ReviewSkeletonComponent = (props) => {
    const {themedStyle} = props;
    return (
        <Card
            style={themedStyle.commentItem}
            header={() => renderReviewHeader(props.item)}>
            <SvgAnimatedLinearGradient width="100%" height={50}>
                <Rect x="0" y="0" rx="5" ry="5" width="100%" height="20"/>
                <Rect x="0" y="30" rx="5" ry="5" width="100%" height="20"/>
            </SvgAnimatedLinearGradient>
        </Card>
    );
};

export const ReviewSkeleton = withStyles(ReviewSkeletonComponent, (theme) => {
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