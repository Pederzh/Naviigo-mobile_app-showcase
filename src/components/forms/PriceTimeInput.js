import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Input, Layout, withStyles} from "@ui-kitten/components";
import {TimePicker} from "../common/TimePicker";
import PropTypes from "prop-types";
import {minutesToTime, timeToMinutes} from "../../utils";
import {useTranslation} from "react-i18next";

const PriceTimeInputComponent = (props) => {
    const {value, onChange, themedStyle} = props;
    const [costPerMinutes, setCostPerMinutes] = useState([value ? value[0] : null, value ? value[1] : null]);
    const { t } = useTranslation();

    useEffect(() => {
        if(costPerMinutes[0] != null && costPerMinutes[1] != null ){
            onChange(costPerMinutes);
        }
    }, [costPerMinutes]);

    const onTimeChange = (time) => {
        setCostPerMinutes([timeToMinutes(time), costPerMinutes[1]]);
    };
    const onPriceChange = (price) => {
        setCostPerMinutes([costPerMinutes[0], parseInt(price)]); //todo maybe prices with: parseFloat(price).toFixed(2)
    };

    return (
        <React.Fragment>
            <Layout level='1'>
                <View style={themedStyle.row}>
                    <TimePicker
                        label={t('Hours')}
                        selectedOption={minutesToTime(costPerMinutes[0])}
                        onSelect={onTimeChange}
                        hoursType={'number'}
                    />
                    <Input
                        label={t("Price")}
                        style={{width: 80}}
                        placeholder=''
                        keyboardType='numeric'
                        onChangeText={onPriceChange}
                        defaultValue={(costPerMinutes[1]) ? costPerMinutes[1] : ""}
                    />
                </View>
            </Layout>
        </React.Fragment>
    );
};

export const PriceTimeInput = withStyles(PriceTimeInputComponent, (theme) => {
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
    });
});


PriceTimeInput.defaultProps = {
    value: [null, null],
};


PriceTimeInput.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};
