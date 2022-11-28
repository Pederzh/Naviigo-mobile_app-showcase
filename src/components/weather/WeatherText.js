import React, {useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Layout, Spinner, Text, withStyles} from '@ui-kitten/components';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import {weatherConditions} from './utils/WeatherConditions';
import {WEATHER_API_KEY} from "../../config/api.config";
import {useSelector} from "react-redux";
import axios from "axios";
import {convertToLocalSimpleDate, getNumberOfDays} from "../../utils";
import {useTranslation} from "react-i18next";

const WeatherTextComponent = (props) => {
    const location = useSelector((state) => state.location);
    const datetime = useSelector((state) => state.datetime);
    const {themedStyle} = props;
    const { t } = useTranslation();

    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState();

    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        getData();
    }, [location.latitude, location.longitude, datetime.startingDate]);

    const getData = () => {
        let forecastDay = getNumberOfDays(datetime?.startingDate);
        //console.log(forecastDay);
        if (!location.latitude || !location.longitude || forecastDay > 7 || forecastDay < 0) return;

        setIsFetching(true);

        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&exclude=hourly,minutely&appid=${WEATHER_API_KEY}&units=metric`
        axios.get(url)
            .then(res => {
                setData({
                    temperature: res?.data.daily[forecastDay]?.temp?.day,
                    weather: res?.data.daily[forecastDay]?.weather[0]?.main,
                })
            })
            .catch(error => console.log(error))
            .finally(() => setIsFetching(false));
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <Layout style={themedStyle.weatherContainer}>
                {
                    (isFetching) ? <Spinner size='tiny'/> :
                        (<View style={{flex: 1, height: "100%"}}>{(!data) ? <Text>{''}</Text>
                                : (
                                    <View style={themedStyle.headerContainer}>
                                        <Text>{`${t('Weather on')} ${convertToLocalSimpleDate(datetime.startingDate)}: `}</Text>
                                        <MaterialCommunityIcons
                                            size={22}
                                            name={weatherConditions[data?.weather]?.icon}
                                            style={themedStyle.facilityIcon}
                                        />
                                        <Text>{` (${Math.round(data?.temperature)}˚)`}</Text>
                                    </View>
                                )
                            }
                            </View>
                        )
                }
            </Layout>
        </SafeAreaView>
    );
};


export const WeatherText = withStyles(WeatherTextComponent, (theme) => {
    return ({
        weatherContainer: {
            flex: 1
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        bodyContainer: {
            flex: 2,
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            paddingLeft: 25,
            marginBottom: 40
        },
        title: {
            fontSize: 60,
            color: '#fff'
        },
        subtitle: {
            fontSize: 24,
            color: '#fff'
        },
        text: {

        },
        facilityIcon: {
            width: 24,
            height: 24,
            color: theme['text-basic-color'],
        },
    });
});


WeatherTextComponent.propTypes = {
    temperature: PropTypes.number,
    weather: PropTypes.string
};