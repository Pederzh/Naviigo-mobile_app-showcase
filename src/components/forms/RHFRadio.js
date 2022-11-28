import React from 'react';
import {StyleSheet} from 'react-native';
import {Radio, RadioGroup, Text, withStyles} from "@ui-kitten/components";
import PropTypes from "prop-types";

/*
    UiKitten Form Component adapted for RHF (React Hook Form)
 */
const RHFRadioComponent = (props) => {
    const {label, data, value, onChange, returnAttribute, themedStyle} = props;

    const handleOnChange = (index) => {
        if (returnAttribute != null) {
            onChange(data[index]?.[returnAttribute]);
        } else {
            //if returnAttribute is null returns the whole object
            onChange(data[index]);
        }
    };

    const objAreEqual = (option, currentOption) => {
        if (returnAttribute != null) {
            //compare an obj with a value
            return (option?.[returnAttribute] === currentOption);
        } else {
            //compare objects by value
            return (option?.value === currentOption?.value);
        }
    };

    return (
        <React.Fragment>
            <Text category='label'>
                {label}
            </Text>
            <RadioGroup
                selectedIndex={data.findIndex(option => objAreEqual(option, value))}
                onChange={(index) => handleOnChange(index)}
            >
                {data.map((option, index) => (
                    <Radio key={index} text={option?.text}/>
                ))}
            </RadioGroup>
        </React.Fragment>
    );
};

export const RHFRadio = withStyles(RHFRadioComponent, (theme) => {
    return ({});
});

RHFRadio.defaultProps = {
    returnAttribute: 'value',
};

RHFRadio.propTypes = {
    label: PropTypes.string,
    data: PropTypes.array.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    returnAttribute: PropTypes.string, //if returnAttribute is null returns the whole object
    onBlur: PropTypes.func,
};

const style = StyleSheet.create({});