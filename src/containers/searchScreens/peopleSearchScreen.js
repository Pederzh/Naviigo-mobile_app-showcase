import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Icon, Layout, ListItem, Text, withStyles} from '@ui-kitten/components';
import {useDispatch, useSelector} from "react-redux";
import {countDecrement, countIncrement} from "../../actions/SearchActions";
import {useTranslation} from "react-i18next";

const ADULTS = "adultsCount";
const CHILDREN = "childrenCount";
const INFANTS = "infantsCount";

const AmountComponent = ({counterType}) => {
    const dispatch = useDispatch();
    //Access Redux Store State
    const people = useSelector((state) => state.people);

    const buttonEnabled = () => {
        return people[counterType] > 0;
    };

    const MinusIcon = (style) => (
        <Icon {...style} name='minus-outline'/>
    );

    const PlusIcon = (style) => (
        <Icon {...style} name='plus-outline'/>
    );

    return (
        <View style={style.amountContainer}>
            <Button
                style={[style.iconButton, style.amountButton]}
                size='small'
                appearance='outline' status='primary'
                icon={MinusIcon}
                onPress={() => dispatch(countDecrement(counterType))}
                disabled={!buttonEnabled()}
            />
            <Text
                style={style.amount}
                category='s1'>
                {people[counterType]}
            </Text>
            <Button
                style={[style.iconButton, style.amountButton]}
                size='small'
                appearance='outline' status='primary'
                icon={PlusIcon}
                onPress={() => dispatch(countIncrement(counterType))}
            />
        </View>
    );
};


const PeopleSearchScreenComponent = (props) => {
    const { t } = useTranslation();
    const people = useSelector((state) => state.people);
    const {totalCount} = people;

    const {themedStyle} = props;

    return (
        <SafeAreaView style={{flex: 1}}>
            <Layout style={themedStyle.container}>
                <View style={themedStyle.titleSection}>
                    <Text category='h5'>
                        {t("Add people")}
                    </Text>
                </View>
                <View>
                    <ListItem
                        //style={themedStyle.itemContainer}
                        title={t("Adults")}
                        description={`${t("Minimum age")}: 13`}
                        accessory={
                            () => <AmountComponent counterType={ADULTS}/>
                        }
                    />
                    <ListItem
                        //style={themedStyle.itemContainer}
                        title={t("Children")}
                        description={`${t("Age")}: 2 - 12`}
                        accessory={
                            () => <AmountComponent counterType={CHILDREN}/>
                        }
                    />
                    <ListItem
                        //style={themedStyle.itemContainer}
                        title={t("Infants")}
                        description={`${t("Less than")}: 2`}
                        accessory={
                            () => <AmountComponent counterType={INFANTS}/>
                        }
                    />
                    <Layout style={themedStyle.footer}>
                        <Text category='h6'>{`${t("Total People")}:`}:</Text>
                        <View>
                            <Text category='h6'>{`${totalCount}`}</Text>
                        </View>
                    </Layout>
                </View>
                <Layout style={themedStyle.layout_bottom}>
                    <View style={themedStyle.layout_bottom_view}>
                        <Button
                            appearance='ghost' status='basic'
                            size='giant'
                            onPress={() => props.navigation.goBack()}
                        >
                            {t('Back')}
                        </Button>
                        <Button
                            style={themedStyle.buttonNext}
                            size='giant'
                            onPress={() => props.navigation.navigate('Explore')}
                        >
                            {t('Next')}
                        </Button>
                    </View>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};

export const PeopleSearchScreen = withStyles(PeopleSearchScreenComponent, (theme) => {
    return ({
        container: {
            //backgroundColor: "white",
            height: "100%",
        },
        list: {
            height: "100%"
        },
        listContent: {
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        searchBar: {
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        itemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        titleSection: {
            marginHorizontal: 12,
            marginVertical: 24,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 0.5,
            paddingVertical: 28,
            paddingHorizontal: 16,
        },
        layout_bottom: {
            flex: 1,
            justifyContent: 'flex-end',
            //backgroundColor: theme['color-primary-100'],
            padding: 20,
            //backgroundColor: theme['color-primary-transparent-100'],
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

const style = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    detailsContainer: {
        flex: 1,
        height: '100%',
        padding: 16,
    },
    amountContainer: {
        flexDirection: 'row',
    },
    amountButton: {
        borderRadius: 16,
    },
    amount: {
        textAlign: 'center',
        top: 5,
        width: 40,
    },
    iconButton: {
        paddingHorizontal: 0,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: "black"
    },
});