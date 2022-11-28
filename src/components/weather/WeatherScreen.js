import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {Layout, Spinner, withStyles} from '@ui-kitten/components';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import {weatherConditions} from './utils/WeatherConditions';
import {WEATHER_API_KEY} from "../../config/api.config";
import {useSelector} from "react-redux";
import axios from "axios";

const WeatherScreenComponent = (props) => {
    const location = useSelector((state) => state.location);
    const {themedStyle} = props;

    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState();

    useEffect(() => {
        getData()

    }, []);

    const getData = () => {
        if (!location.latitude || !location.longitude) return;

        setIsFetching(true);

        axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${WEATHER_API_KEY}&units=metric`
        )
            .then(res => {
                setData({
                    temperature: res?.data?.main?.temp,
                    weather: res?.data.weather[0]?.main,
                })
            })
            .catch(error => console.log(error))
            .finally(() => setIsFetching(false));
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <Layout style={themedStyle.weatherContainer}>
            {
                (isFetching) ? <Spinner size='tiny'/> :
                    (<View style={{flex: 1, height: "100%"}}>{(!data) ? <Text> no data</Text>
                            : (
                                <View style={[
                                    themedStyle.weatherContainer,
                                    {backgroundColor: weatherConditions[data?.weather]?.color}
                                ]}
                            >
                                <View style={themedStyle.headerContainer}>
                                    <MaterialCommunityIcons
                                        size={72}
                                        name={weatherConditions[data?.weather]?.icon}
                                        color={'#fff'}
                                    />
                                    <Text style={themedStyle.tempText}>{data?.temperature}˚</Text>
                                </View>
                                <View style={themedStyle.bodyContainer}>
                                    <Text style={themedStyle.title}>{weatherConditions[data?.weather].title}</Text>
                                    <Text style={themedStyle.subtitle}>
                                        {weatherConditions[data?.weather].subtitle}
                                    </Text>
                                </View>
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


export const WeatherScreen= withStyles(WeatherScreenComponent, (theme) => {
    return ({
        weatherContainer: {
            flex: 1
        },
        headerContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around'
        },
        tempText: {
            fontSize: 72,
            color: '#fff'
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
        }
    });
});


WeatherScreenComponent.propTypes = {
    temperature: PropTypes.number,
    weather: PropTypes.string
};