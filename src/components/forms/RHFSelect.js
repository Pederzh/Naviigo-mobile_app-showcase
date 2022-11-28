import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Layout, Select, withStyles} from "@ui-kitten/components";
import PropTypes from "prop-types";
import {OpeningTimes} from "../OpeningTimes";
import {RHFRadio} from "./RHFRadio";
import {useTranslation} from "react-i18next";

/*
    UiKitten Form Component adapted for RHF (React Hook Form)
 */
const RHFSelectComponent = (props) => {
    const { t } = useTranslation();
    const {label, data, placeholder, value, onChange, returnAttribute, themedStyle} = props;

    const handleOnSelect = (option) => {
        if (returnAttribute != null) {
            onChange(option?.[returnAttribute]);
        } else {
            //if returnAttribute is null returns the whole object
            onChange(option);
        }
    };

    const objAreEqual = (option, currentOption) => {
        //console.log(option, currentOption)
        if (returnAttribute != null) {
            //compare an obj with a value
            return (option?.[returnAttribute] === currentOption);
        } else {
            //compare objects by value
            return (option?.value === currentOption?.value);
        }
    };

    return(
        <React.Fragment>
            <Select
                label={label}
                data={data}
                placeholder={t(placeholder)}
                selectedOption={data?.find(option => objAreEqual(option, value))}
                onSelect={handleOnSelect}
            />
        </React.Fragment>
    );
};

export const RHFSelect = withStyles(RHFSelectComponent, (theme) => {
    return ({});
});

RHFSelect.defaultProps = {
    returnAttribute: 'value',
    placeholder: "Select an option"
};

RHFSelect.propTypes = {
    label: PropTypes.string,
    data: PropTypes.array.isRequired,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    returnAttribute: PropTypes.string, //if returnAttribute is null returns the whole object
    onBlur: PropTypes.func,
};

const style = StyleSheet.create({

});