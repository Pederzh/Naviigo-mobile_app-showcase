import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {CheckBox, withStyles} from "@ui-kitten/components";
import {RangeTimePicker} from "./forms/RangeTimePicker";
import PropTypes from "prop-types";
import {ISO_WEEKDAYS} from "../utils/constraints";
import {useTranslation} from "react-i18next";


const OpeningTimesComponent = (props) => {
    const {value, onChange, themedStyle} = props;
    const [firstTimeSet, setFirstTimeSet] = useState(true);
    const isoWeekdays = ISO_WEEKDAYS;
    //const [openings, setOpenings] = useState(props.value);
    //const [selectedTime, setSelectedTime] = useState(null);
    const { t } = useTranslation();

    const alertSetAllTimes = (firstResults) =>
        Alert.alert(
            t("Set to all days"),
            t("Do you want to set just added opening times to all selected days?"),
            [
                {
                    text: t("No"),
                    style: "cancel"
                },
                {text: t("Yes"), onPress: () => onSetAllTimes(firstResults)}
            ],
            {cancelable: false}
        );

    const onSetAllTimes = (firstResults) => {
        let firstTimes = [...firstResults.filter(obj => {
            return (obj?.from != null && obj?.to != null);
        })];

        let results = [...value.map(obj => {
            if (obj?.from == null || obj?.to == null) {
                return {
                    ...obj,
                    from: firstTimes[0]?.from,
                    to: firstTimes[0]?.to
                }
            }
        })];

        if (firstTimes.length === 2) {
            let resultsAfternoon = [...value.map(obj => {
                if (obj?.from == null || obj?.to == null) {
                    return {
                        ...obj,
                        from: firstTimes[1]?.from,
                        to: firstTimes[1]?.to
                    }
                }
            })];
            results = results.concat(resultsAfternoon);
        }

        onChange([...results]);
    };

    const onSelectedTime = (selectedTime) => {
        /* Delete the old times of the selected day */
        let results = [...value.filter(obj => {
            return obj?.code !== selectedTime[0].code
        })];
        /* Add the new times of the selected day */
        results = results.concat(selectedTime);
        /* Update the entire state */

        if (firstTimeSet) {
            alertSetAllTimes(results);
            setFirstTimeSet(false);
        } else {
            onChange([...results]);
        }

    };

    const onChangeDay = (newChecked, selectedDay) => {
        /* newChecked doesn't contain the old checkbox value but the new value i want to set the checkbox */
        if (!newChecked) {
            /* Delete the old times of the selected day */
            let results = [...value.filter(obj => {
                return obj?.code !== selectedDay?.code
            })];
            onChange([...results]);
        } else {
            /* Delete just the selected day */
            onChange(value.concat(selectedDay));
        }
    };

    return (
        <View style={{flex: 1}}>
            <ScrollView
                automaticallyAdjustContentInsets
                bouncesZoom
                removeClippedSubviews
            >
                <View style={{flex: 1}}>
                    {
                        isoWeekdays.map((day, index) => (
                            <View key={index}>
                                <RangeTimePicker
                                    day={day}
                                    selectedOption={[...value.filter(obj => {
                                        return obj?.code === day.code
                                    })]}
                                    onSelect={onSelectedTime}
                                    disabled={!value.some(obj => {
                                        return obj?.code === day.code
                                    })}
                                    multiple
                                >
                                    <CheckBox
                                        text={t(day.value)}
                                        checked={value.some(obj => {
                                            return obj?.code === day.code
                                        })}
                                        onChange={(newChecked) => onChangeDay(newChecked, day)}
                                    />
                                </RangeTimePicker>
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
        </View>
    );
};

export const OpeningTimes = withStyles(OpeningTimesComponent, (theme) => {

    return ({});
});

const style = StyleSheet.create({});

OpeningTimes.propTypes = {
    value: PropTypes.any,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
};