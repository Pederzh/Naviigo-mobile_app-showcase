import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {Layout, Text, withStyles} from "@ui-kitten/components";
import {StackedBarChart, LineChart} from 'react-native-chart-kit';
import {useScreenInfo} from "../hooks";
import {convertToLocalDate, convertToLocalSimpleDate} from "../utils";
import {
    BOOKING_STATE_ACCEPTED,
    BOOKING_STATE_BLOCKED,
    BOOKING_STATE_CANCELLED,
    BOOKING_STATE_FINISHED
} from "../utils/constraints";
import {useTranslation} from "react-i18next";

const ChartScreenComponent = (props) => {
        const {navigation, route, themedStyle} = props;
        const [chartData, setChartData] = useState({data: []});
        const {t} = useTranslation();
        const [lineChartData, setLineChartData] = useState({
            labels: ['loading'],
            datasets: [
                {
                    data: [0],
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(255,0,0,${opacity})`, // optional
                },
                {
                    data: [0],
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(0,0,102, ${opacity})`, // optional
                },
                {
                    data: [0],
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(0,102,0, ${opacity})`, // optional
                },
            ],
            legend: ['loading'],
        });
        const dimensions = useScreenInfo();

        function computeStackedLineChart() {
            let reservations = route?.params?.reservations;
            let data = [];
            let labels = [];
            let legend = [BOOKING_STATE_ACCEPTED, BOOKING_STATE_FINISHED, BOOKING_STATE_CANCELLED, BOOKING_STATE_BLOCKED];
            const now = new Date();

            let loopDay = now;
            loopDay.setDate(loopDay.getDate() - 5);
            for (let i = 0; i <= 5; i++) {
                let dayData = [0, 0, 0, 0];

                loopDay.setDate(loopDay.getDate() + 1);
                labels.push(convertToLocalSimpleDate(loopDay));

                reservations[`${convertToLocalDate(loopDay)}`]?.map(res => {
                    legend.map((val, index) => {
                        if (res.state === legend[index]) {
                            dayData[index] += 1;
                        }
                    })
                });

                data.push(dayData);
            }
            setChartData({
                labels,
                legend,
                data,
                barColors: ["#ABEBC6", "#AED6F1", "#FAD7A0", "#F5B7B1"]
            });

        };

        function computeLineChart() {
            let reservations = route?.params?.reservations;
            let data = [];
            let labels = [];
            let legend = [BOOKING_STATE_ACCEPTED, BOOKING_STATE_FINISHED, BOOKING_STATE_CANCELLED, BOOKING_STATE_BLOCKED];
            const now = new Date();

            let loopDay = now;
            loopDay.setDate(loopDay.getDate() - 5);
            for (let i = 0; i <= 5; i++) {
                let dayData = [0, 0, 0, 0];

                loopDay.setDate(loopDay.getDate() + 1);
                labels.push(convertToLocalSimpleDate(loopDay));

                reservations[`${convertToLocalDate(loopDay)}`]?.map(res => {
                    legend.map((val, index) => {
                        if (res.state === legend[index]) {
                            dayData[index] += 1;
                        }
                    })
                });

                data.push(dayData);
            }
            let lineData = [
                {
                    data: [],
                    strokeWidth: 2,
                    color: (opacity = 1) => "#ABEBC6"
                },
                {
                    data: [],
                    strokeWidth: 2,
                    color: (opacity = 1) => "#AED6F1"
                },
                {
                    data: [],
                    strokeWidth: 2,
                    color: (opacity = 1) => "#FAD7A0"
                },
                {
                    data: [],
                    strokeWidth: 2,
                    color: (opacity = 1) => "#F5B7B1", // optional
                }
            ];

            data.map((day) => {
                legend.map((val, index) => {
                    lineData[index]?.data.push(day[index]);
                })
            });


            setLineChartData({
                labels,
                legend,
                datasets: lineData,
                barColors: ["#ABEBC6", "#AED6F1", "#FAD7A0", "#F5B7B1"]
            });


        };

        useEffect(() => {
            computeStackedLineChart();
            computeLineChart();
        }, []);

        return (
            <Layout style={themedStyle.container}>
                <View style={themedStyle.header}>
                    <Text category='h4'>
                        {t('Statistics')}
                    </Text>
                    <Text
                        appearance='hint'
                        category='s1'>
                        {t('Here you can see reservation statistics of last week')}
                    </Text>
                </View>
                {
                    (route?.params?.reservations && Object.keys(route?.params?.reservations).length > 0) ? (
                        <ScrollView style={{flex: 1}}>
                            {
                                <LineChart
                                    bezier
                                    data={lineChartData}
                                    width={dimensions?.width - 32}
                                    height={200}
                                    chartConfig={{
                                        backgroundGradientFrom: '#F6F6F6',
                                        backgroundGradientTo: '#eff3ff',
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16,
                                        },
                                    }}
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16,
                                    }}
                                />
                            }
                            <StackedBarChart
                                data={chartData}
                                width={dimensions?.width - 32}
                                height={350}
                                withHorizontalLabels={false}
                                decimalPlaces={0}
                                chartConfig={{
                                    backgroundGradientFrom: '#F6F6F6',
                                    backgroundGradientTo: '#eff3ff',
                                    color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                }}
                                style={{
                                    marginVertical: 12,
                                    borderRadius: 16,
                                }}
                            />
                        </ScrollView>
                    ) : (
                        <Text> {t('no data')} </Text>
                    )
                }
            </Layout>
        );
    }
;

export const ChartScreen = withStyles(ChartScreenComponent, (theme) => {

    return ({
        container: {
            flex: 1,
            padding: 16,
        },
        header: {
            alignItems: 'left',
            textAlign: 'left',
            fontSize: 18,
            padding: 16,
        },
        profileContainer: {
            alignItems: 'left',
            textAlign: 'left',
            marginHorizontal: 8,
        },
    });
});

const style = StyleSheet.create({});