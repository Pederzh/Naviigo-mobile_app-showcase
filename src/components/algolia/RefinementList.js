import React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {Button, Text, withStyles} from "@ui-kitten/components";
import {connectRefinementList} from 'react-instantsearch-native';
import {useTranslation} from "react-i18next";

const RefinementListComponent = (props) => {
    const { items, refine, title, themedStyle } = props;
    const { t } = useTranslation();
    return (
        <View style={themedStyle.sectionContainer}>
            <Text
                style={themedStyle.sectionLabel}
                category='h6'>
                {title}
            </Text>
            <View style={themedStyle.container}>
                {items.map(item => {
                    return (
                        <Button style={themedStyle.button}
                                size='small'
                                key={item.value}
                                onPress={() => refine(item.value)}
                                appearance={item.isRefined ? 'filled' : 'outline'}
                        >
                            {`${t(item.label)} (${item.count})`}
                        </Button>
                    );
                })}
            </View>
        </View>
    )
};

const RefinementList = withStyles(RefinementListComponent, (theme) => {
    return ({
        container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        sectionContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        sectionLabel: {
            marginVertical: 8,
        },
        button: {
            borderRadius: 30,
            margin: 2,
        }
    });
});

const ItemPropType = PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.string.isRequired,
    isRefined: PropTypes.bool.isRequired,
});

RefinementList.propTypes = {
    items: PropTypes.arrayOf(ItemPropType).isRequired,
    refine: PropTypes.func.isRequired,
};

export default connectRefinementList(RefinementList);
