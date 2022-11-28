import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withStyles} from "@ui-kitten/components";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {connectRange} from 'react-instantsearch-native';


const RangePickerComponent = (props) => {
    const {title, currentRefinement, min, max, refine, onValuesChangeStart, onValuesChangeFinish, themedStyle} = props;
    return (
        <View style={themedStyle.container}>
            <Text
                style={themedStyle.sectionLabel}
                category='h6'>
                {title}
            </Text>
            <MultiSlider
                enableLabel
                min={min}
                max={max}
                values={[
                    currentRefinement.min,
                    currentRefinement.max
                ]}
                onValuesChangeStart={onValuesChangeStart}
                onValuesChangeFinish={(values) => {
                    refine({min: values[0], max: values[1]});
                    onValuesChangeFinish();
                }}
            />
        </View>
    );
};

const RangePicker = withStyles(RangePickerComponent, (theme) => {

    return ({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            width: "100%"
        },
        sectionLabel: {
            marginVertical: 8,
        },
    });
});

const style = StyleSheet.create({});

export default connectRange(RangePicker);