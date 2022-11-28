import React, {useState, useEffect} from 'react';
import {Layout, withStyles} from "@ui-kitten/components";
import PropTypes from "prop-types";
import {PriceTimeInput} from "./PriceTimeInput";
import {DEFAULT_CURRENCY, MAX_NUM_PRICES} from "../../utils/constraints";
import {RHFSelect} from "./RHFSelect";
import {useTranslation} from "react-i18next";

const MultiplePriceTimePickerComponent = (props) => {
    const {value, onChange, themedStyle} = props;
    const [currency, setCurrency] = useState(value?.currency);
    const [prices, setPrices] = useState({...value?.costPerMinutes});
    const [costPerMinutesMatrix, setCostPerMinutesMatrix] = useState(arrayPriceTime(value?.costPerMinutes));
    const { t } = useTranslation();

    function arrayPriceTime(prices) {
        let pricesArr = [];
        if (prices && Object.keys(prices).length > 0) {
            pricesArr = Object.entries(prices);
        }

        let i;
        for (i = (prices) ? Object.keys(prices).length : 0; i < MAX_NUM_PRICES; i++) {
            pricesArr.push([null, null]);
        }

        return pricesArr;
    }

    const onSinglePriceChange = (index, costPerMinutes) => {
        let pricesArr = [];
        if (prices && Object.keys(prices).length > 0) {
            pricesArr = Object.entries(prices);
        }

        let i;
        for (i = (prices) ? Object.keys(prices).length : 0; i < MAX_NUM_PRICES; i++) {
            pricesArr.push([null, null]);
        }

        pricesArr[index] = costPerMinutes;

        let newPrices = Object.fromEntries(pricesArr);
        delete newPrices["null"];

        setCostPerMinutesMatrix(arrayPriceTime(newPrices));
        setPrices(newPrices)
    };

    useEffect(() => {
        let arr = [...costPerMinutesMatrix];
        arr.sort(function(a,b) {
            if(a[1] === null || b[1] === null) return 0;
            return a[1]-b[1]
        });

        let price = {
            minHourPrice: arr[0][1],
            costPerMinutes: {...prices},
            currency: currency
        };

        if(price?.costPerMinutes && price?.currency){
            onChange(price)
        }
    }, [prices, currency]);

    const currencyOptions = [
        { value: "EUR", text: 'EUR' },
        { value: "CHF", text: 'CHF' },
        { value: "USD", text: 'USD' },
    ];

    return (
        <React.Fragment>
            <Layout level='1'>
                <RHFSelect
                    label={t("Currency")}
                    data={currencyOptions}
                    value={currency}
                    onChange={setCurrency}
                />
                {
                    (costPerMinutesMatrix.map((costPerMinute, index) => (
                        <PriceTimeInput key={index}
                                        onChange={(value) => onSinglePriceChange(index, value)}
                                        value={costPerMinute}/>
                    )))
                }

            </Layout>
        </React.Fragment>
    );
};

export const MultiplePriceTimePicker = withStyles(MultiplePriceTimePickerComponent, (theme) => {

    return ({});
});

MultiplePriceTimePicker.defaultProps = {
    value: {
        minHourPrice: null,
        costPerMinutes: {},
        currency: DEFAULT_CURRENCY
    }
};


MultiplePriceTimePicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};
