import React from 'react';
import {StyleSheet} from 'react-native';
import {Calendar, RangeCalendar, Toggle, withStyles} from "@ui-kitten/components";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

/*
    UiKitten Form Component adapted for RHF (React Hook Form)
 */
const RHFCalendarComponent = (props) => {
    const { t } = useTranslation();
    const {label, value, onChange, type, themedStyle} = props;

    const [multiple, setMultiple] = React.useState((type === 'multiple'));

    //const filter = (date) => date.getDay() !== 0 && date.getDay() !== 6;
    const handleSelect = (date) => {
        if (multiple) {
            onChange(date)
        } else {
            onChange({
                    from: new Date(date.setHours(0, 0, 0)),
                    to: new Date(date.setHours(23, 59, 59))
                }
            )

        }
    };

    return (
        <React.Fragment>
            {
                (type === 'choose') &&
                <Toggle
                    text={t('Multiple days')}
                    checked={multiple}
                    onChange={setMultiple}
                />
            }
            {
                (multiple) ? (
                    <RangeCalendar
                        style={themedStyle.calendar}
                        range={(value != null) ? value : {startDate: null, endDate: null}}
                        onSelect={(nextRange) => handleSelect(nextRange)}
                    />
                ) : (
                    <Calendar
                        style={themedStyle.calendar}
                        date={(value.from != null) ? value.from : new Date()}
                        onSelect={(date) => handleSelect(date)}
                        //filter={filter}
                    />
                )
            }

        </React.Fragment>
    );
};

export const RHFCalendar = withStyles(RHFCalendarComponent, (theme) => {
    return ({
        calendar: {
            width: "100%",
            borderTopWidth: 0,
            borderBottomWidth: 0,
        },
    });
});

RHFCalendar.defaultProps = {
    type: 'choose',
};

RHFCalendar.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    type: PropTypes.oneOf(['single', 'multiple', 'choose']),
};

const style = StyleSheet.create({});