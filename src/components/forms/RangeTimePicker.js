import React, {useEffect, useState} from 'react';
import {LayoutAnimation, Platform, StyleSheet, UIManager, View} from 'react-native';
import {Button, Layout, Text, Toggle, withStyles} from "@ui-kitten/components";
import {TimePicker} from "../common/TimePicker";
import PropTypes from "prop-types";
import {fromTime, toTime} from "../../utils";
import {useTranslation} from "react-i18next";


const RangeTimePickerForm = (props) => {
    const { t } = useTranslation();
    const {day, multiple, selectedOption, onSelect, themedStyle} = props;
    const [selectedTimeFrom1, setSelectedTimeFrom1] = useState((multiple) ? selectedOption[0]?.from : selectedOption?.from);
    const [selectedTimeTo1, setSelectedTimeTo1] = useState((multiple) ? selectedOption[0]?.to : selectedOption?.to);
    const [selectedTimeFrom2, setSelectedTimeFrom2] = useState((multiple) ? selectedOption[1]?.from : null);
    const [selectedTimeTo2, setSelectedTimeTo2] = useState((multiple) ? selectedOption[1]?.to : null);
    const [splitTime, setSplitTime] = useState(true);

    useEffect(() => {
        let time1 = {
            code: day?.code, day: day?.value, from: fromTime(selectedTimeFrom1, selectedTimeTo1), to: toTime(selectedTimeTo1, selectedTimeFrom1)
        };
        let time2 = {
            code: day?.code, day: day?.value, from: fromTime(selectedTimeFrom2, selectedTimeTo2), to: toTime(selectedTimeTo2, selectedTimeFrom2)
        };

        if (multiple) {
            if (splitTime) {
                if (!(time1.from && time1.to && time2.from && time2.to)) return;
                onSelect([time1, time2])
            } else {
                if (!(time1.from && time1.to)) return;
                onSelect([time1]);
            }
        }
        else {
            if (!(time1.from && time1.to)) return;
            onSelect(time1);
        }
    }, [selectedTimeFrom1, selectedTimeTo1, selectedTimeFrom2, selectedTimeTo2, splitTime]);

    return (
        <Layout level='1'>
            <View>
                {
                    (splitTime) ?
                        <Text category='label'>{t("Morning")}</Text>
                        : <Text category='label'>{t("All day")}</Text>
                }
                <View style={themedStyle.row}>
                    <TimePicker
                        label={t("From")}
                        selectedOption={selectedTimeFrom1}
                        onSelect={setSelectedTimeFrom1}
                        hoursType={(splitTime) ? 'morning' : 'all'}
                    />
                    <TimePicker
                        label={t("To")}
                        selectedOption={selectedTimeTo1}
                        onSelect={setSelectedTimeTo1}
                        hoursType={(splitTime) ? 'morning' : 'all'}
                    />
                </View>
            </View>
            {
                (splitTime) ?
                    <View>
                        <Text category='label'>{t("Afternoon")}</Text>
                        <View style={themedStyle.row}>
                            <TimePicker
                                label={t("From")}
                                selectedOption={selectedTimeFrom2}
                                onSelect={setSelectedTimeFrom2}
                                hoursType={(splitTime) ? 'afternoon' : 'all'}
                            />
                            <TimePicker
                                label={t("To")}
                                selectedOption={selectedTimeTo2}
                                onSelect={setSelectedTimeTo2}
                                hoursType={(splitTime) ? 'afternoon' : 'all'}
                            />
                        </View>
                    </View>
                    : null
            }
            <View style={themedStyle.row}>
                <View style={{marginHorizontal: 4}}>
                    <Toggle
                        text={t("Morning and afternoon have different opening times")}
                        checked={splitTime}
                        onChange={setSplitTime}
                    />
                </View>
            </View>
        </Layout>
    );
};

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RangeTimePickerComponent = (props) => {
    const { t } = useTranslation();
    const {children, multiple, selectedOption, disabled, themedStyle} = props;

    const [expanded, setExpanded] = useState(false);
    //const [times, setTimes] = useState([]);

    const getTitle = () => {
        const def = t('Set Time');
        if (Array.isArray(selectedOption) && multiple) {
            if (selectedOption.length > 1) {
                if (!(selectedOption[0]?.from && selectedOption[0]?.to && selectedOption[1]?.from && selectedOption[1]?.to)) return def;
                return `${selectedOption[0]?.from}-${selectedOption[0]?.to} ${selectedOption[1]?.from}-${selectedOption[1]?.to}`
            } else {
                if (!(selectedOption[0]?.from && selectedOption[0]?.to)) return def;
                return `${selectedOption[0]?.from}-${selectedOption[0]?.to}`
            }
        }
        if (!(selectedOption?.from && selectedOption?.to)) return def;
        return `${selectedOption?.from}-${selectedOption?.to}`
    };


    return (
        <React.Fragment>
            <View>
                <View style={themedStyle.row}>
                    {(children != null) ? children : null}
                    <Button status='basic'
                            disabled={disabled}
                            onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                                setExpanded(!expanded);
                    }}>
                        {getTitle()}
                    </Button>
                </View>


                {
                    expanded && <RangeTimePickerForm {...props} />
                }
            </View>
        </React.Fragment>
    );
};

export const RangeTimePicker = withStyles(RangeTimePickerComponent, (theme) => {
    return ({
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: theme['border-basic-color-3'],
            paddingHorizontal: 0,
            paddingVertical: 15,
            height: 75,
        },
        centeredView: {
            backgroundColor: "#00000099",
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            height: '100%',
        },
        modalView: {
            margin: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 35,
            flex: 1,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
    });
});

const style = StyleSheet.create({});

RangeTimePicker.defaultProps = {
    multiple: false,
};

RangeTimePicker.propTypes = {
    children: PropTypes.node,
    label: PropTypes.string,
    day: PropTypes.object.isRequired,
    multiple: PropTypes.bool,
    selectedOption: PropTypes.any.isRequired,
    onSelect: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};