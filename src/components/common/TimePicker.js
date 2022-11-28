import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Select, withStyles} from "@ui-kitten/components";
import PropTypes from "prop-types";
import {getHour, getMinute} from "../../utils";

const TimePickerComponent = (props) => {
    const {hoursType, selectedOption, onSelect, themedStyle} = props;

    const hours = [
        {text: '00'},
        {text: '01'},
        {text: '02'},
        {text: '03'},
        {text: '04'},
        {text: '05'},
        {text: '06'},
        {text: '07'},
        {text: '08'},
        {text: '09'},
        {text: '10'},
        {text: '11'},
        {text: '12'},
        {text: '13'},
        {text: '14'},
        {text: '15'},
        {text: '16'},
        {text: '17'},
        {text: '18'},
        {text: '19'},
        {text: '20'},
        {text: '21'},
        {text: '22'},
        {text: '23'},
    ];
    const minutes = [
        {text: '00'},
        {text: '15'},
        {text: '30'},
        {text: '45'},
    ];

    const filterHours = (hours) => {
        if (hoursType === 'all') return hours;

        if (hoursType === 'number') return hours.slice(1, 24);

        if (hoursType === 'morning') return hours.slice(0, 14);

        if (hoursType === 'afternoon') return hours.slice(13, 24);

        return hours;
    };

    const setSelectedHour = (hh) => {
        onSelect(`${hh.text}:${getMinute(selectedOption)}`)
    };

    const setSelectedMinute = (mm) => {
        onSelect(`${getHour(selectedOption)}:${mm.text}`)
    };

    return (
        <View style={themedStyle.timeContainer}>
            <Select
                label={props.label}
                placeholder={'hh'}
                size='small'
                data={filterHours(hours)}
                selectedOption={(selectedOption) ? {text: getHour(selectedOption)} : null}
                onSelect={setSelectedHour}
                controlStyle={themedStyle.selectHours}
                icon={() => <View style={{height: 0, width: 0}}/>}
            />
            <Select
                label={props.label != null ? ' ' : null}
                placeholder={'mm'}
                size='small'
                data={minutes}
                selectedOption={(selectedOption) ? {text: getMinute(selectedOption)} : null}
                onSelect={setSelectedMinute}
                controlStyle={themedStyle.selectMinutes}
                icon={() => <View style={{height: 0, width: 0}}/>}
            />
        </View>
    );
};

export const TimePicker = withStyles(TimePickerComponent, (theme) => {
    return ({
        timeContainer: {
            flexDirection: 'row',
        },
        selectHours: {
            fontSize: 3,
            width: 70,
            marginLeft: 0,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 15,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 15,
            //borderRightWidth: 0,
        },
        selectMinutes: {
            width: 80,
            marginRight: 0,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 0,
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 0,
            //borderLeftWidth: 0,
        },
    });
});

const style = StyleSheet.create({});

TimePicker.defaultProps = {
    selectedOption: null,
    hoursType: 'all,'
};

TimePicker.propTypes = {
    hoursType: PropTypes.oneOf(['all', 'number', 'morning', 'afternoon']),
    label: PropTypes.string,
    selectedOption: PropTypes.any,
    onSelect: PropTypes.func.isRequired,
};