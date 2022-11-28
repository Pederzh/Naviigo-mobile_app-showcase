import React from 'react';
import {StyleProp, TextStyle, View, ViewProps,} from 'react-native';
import {Text, withStyles} from '@ui-kitten/components';

const PriceTextComponent = (props) => {
    const {style, themedStyle, valueStyle, scaleStyle, children, scale, currency} = props;

    return (
        <View style={[themedStyle.container, style]}>
            <Text style={[themedStyle.valueLabel, valueStyle]}>{children}</Text>
            {
                (currency != null) ?
                    <Text style={[themedStyle.scaleLabel, scaleStyle]}>{`${scale}`}</Text> : null
            }
            {
                (scale != null) ?
                    <Text style={[themedStyle.scaleLabel, scaleStyle]}>{`${scale}`}</Text> : null
            }
        </View>
    );
};

export const PriceText = withStyles(PriceTextComponent, (theme) => ({
    container: {
        flexDirection: 'row',
    },
    valueLabel: {},
    scaleLabel: {
        alignSelf: 'flex-end',
    },
}));