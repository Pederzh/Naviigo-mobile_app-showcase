import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Spinner, withStyles} from "@ui-kitten/components";

const LoadingIndicatorComponent = (props) => {
    const {themedStyle} = props;
    return(
        <View style={[themedStyle, themedStyle.indicator]}>
            <Spinner size='small'/>
        </View>
    )
};

export const LoadingIndicator = withStyles(LoadingIndicatorComponent, (theme) => {
    return ({
        indicator: {
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
});