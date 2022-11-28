import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Calendar, Layout, Radio, RadioGroup, Text, withStyles} from '@ui-kitten/components';
import {useDispatch, useSelector} from "react-redux";
import {dateSet, timeSetByIndex} from "../../actions/SearchActions";
import {useTranslation} from "react-i18next";

const DateSearchScreenComponent = (props) => {
    const { t } = useTranslation();
    //Access Redux Store State
    const datetimeState = useSelector((state) => state.datetime);
    const dispatch = useDispatch();

    //const filter = (date) => date.getDay() !== 0 && date.getDay() !== 6; //disable some dates

    const onCalendarChange = (date) => dispatch(dateSet(date));

    const onCheckedChange = (index) => dispatch(timeSetByIndex(index));

    const {themedStyle} = props;
    return (
        <SafeAreaView style={{flex: 1}}>
            <Layout style={themedStyle.container}>
                <Layout style={themedStyle.layout_top}>
                    <Text category='h5'>
                        {t("Add date and time")}
                    </Text>
                </Layout>
                <Layout style={themedStyle.layout_middle}>
                    <Calendar
                        style={themedStyle.calendar}
                        date={datetimeState?.startingDate}
                        onSelect={(date) => onCalendarChange(date)}
                        //filter={filter}
                    />
                    <Layout style={themedStyle.radioGroupSection}>
                        <Text
                            category='h6'>
                            {t("Time")}
                        </Text>
                        <RadioGroup
                            selectedIndex={datetimeState?.timeRadioIndex}
                            onChange={onCheckedChange}
                        >
                            <Radio style={themedStyle.radio} text={t('All day')}/>
                            <Radio style={themedStyle.radio} text={t('Morning')}/>
                            <Radio style={themedStyle.radio} text={t('Afternoon')}/>
                        </RadioGroup>
                        </Layout>
                </Layout>
                <Layout style={themedStyle.layout_bottom}>
                    <View style={themedStyle.layout_bottom_view}>
                        <Button
                            appearance='ghost' status='basic'
                            size='giant'
                            onPress={() => props.navigation.goBack()}
                        >
                            {t("Back")}
                        </Button>
                        <Button
                            style={themedStyle.buttonNext}
                            size='giant'
                            disabled={(datetimeState?.timeRadioIndex == null)}
                            onPress={() => props.navigation.navigate("PeopleSearchScreen")}
                        >
                            {t("Next")}
                        </Button>
                    </View>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};

export const DateSearchScreen = withStyles(DateSearchScreenComponent, (theme) => {
    return ({
        container: {
            //backgroundColor: "white",
            flex: 1,
        },
        layout_top: {
            flex: 1,
            justifyContent: 'center',
            padding: 12,
            margin: 0,
        },
        layout_middle: {
            flex: 10,
        },
        calendar: {
            width: "100%", 
            borderTopWidth: 0,
            borderBottomWidth: 0,
        },
        radioGroupSection:{
            marginHorizontal: 12,
            marginTop: 12,
        },
        radio: {
            marginHorizontal: 12,
            marginVertical: 8,
        },
        layout_bottom: {
            flex: 1,
            justifyContent: 'flex-end',
            padding: 20,
            //backgroundColor: theme['color-primary-100'],
        },
        layout_bottom_view: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        buttonNext: {
            width: "35%",
            borderRadius: 30
        }
    });
});

const style = StyleSheet.create({});