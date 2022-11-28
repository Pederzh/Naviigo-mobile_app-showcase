import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Button, withStyles} from "@ui-kitten/components";
import {TextualInfoItem} from "./TextualInfoItem";

const CategoryItemComponent = (props) => {
    const {themedStyle, children} = props;
    return(
        <View style={themedStyle.categoryContainer}>
        <Button
            style={themedStyle.categoryItem}
            status={props.status}
            size={props.size}
            appearance={props.appearance}
        >
            {children}
        </Button>
        </View>
    );
};

export const CategoryItem = withStyles(CategoryItemComponent, (theme) => {

    return ({
        categoryContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -4,
        },
        categoryItem: {
            marginHorizontal: 4,
            borderRadius: 16,
        },
    });
});

const style = StyleSheet.create({

});

CategoryItem.defaultProps = {
    status: 'primary',
    size: 'tiny',
    appearance: 'filled',

};

CategoryItem.propTypes = {
    status: PropTypes.string,
    size: PropTypes.string,
    appearance: PropTypes.string,
};