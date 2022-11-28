import React from 'react';
import {View} from 'react-native';
import {Button, ButtonGroup, Icon, Layout, withStyles} from '@ui-kitten/components';
import {Ionicons} from "@expo/vector-icons";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const SearchComponent = (props) => {
    const {themedStyle} = props;
    const { t } = useTranslation();
    const maxCapacityIcon = () => (<Ionicons iconStyle={style.facilityIcon} name="md-people"/>);

    const location = useSelector((state) => state.location);
    const datetime = useSelector((state) => state.datetime);
    const people = useSelector((state) => state.people);

    let locationText = (location?.city == null) ? t('Search') : location?.city;
    let datetimeText = (datetime?.startingDateTime == null) ? `${t('When')}?` : `${datetime?.startingDateTime.toLocaleDateString()}, ${datetime?.startingDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
    let peopleText = (people?.totalCount === 0)
        ? t('People') :
        ((people?.totalCount === 1) ? `${people?.totalCount} ${t('Person')}` : `${people?.totalCount} ${t('People')}`);

    return (
        <Layout style={themedStyle.componentContainer}>
            <View>
            <View style={themedStyle.container}>
                <ButtonGroup appearance='outline' status='basic' size='small' style={themedStyle.searchButtonGroupTop}
                >
                    <Button style={themedStyle.searchButtonTop}
                            appearance='outline' status='basic'
                            icon={(props) => (<Icon {...props} name='search'/>)}
                            onPress={() => props.navigation.navigate('LocationSearchScreen')}
                    >
                        {locationText}
                    </Button>
                </ButtonGroup>
            </View>
            <View style={themedStyle.container}>
                <ButtonGroup appearance='outline' status='basic' size='small'
                             style={themedStyle.searchButtonGroupBottom}>
                    <Button style={themedStyle.searchButtonBottom}
                            icon={(props) => (<Icon {...props} name='calendar-outline'/>)}
                            onPress={() => props.navigation.navigate('DateSearchScreen')}
                    >
                        {datetimeText}
                    </Button>
                    <Button style={themedStyle.searchButtonBottom}
                            icon={(props) => (<Icon {...props} name='people-outline'/>)}
                            onPress={() => props.navigation.navigate('PeopleSearchScreen')}
                    >
                        {peopleText}
                    </Button>
                </ButtonGroup>
            </View>
            </View>
        </Layout>
    );
};

export const Search = withStyles(SearchComponent, (theme) => {
    return ({
        componentContainer: {
            paddingHorizontal: 8,
            paddingVertical: 8,
        },
        container: {
            flexDirection: 'row',
        },
        searchButtonGroupTop: {
            width: "100%",
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomWidth: 0,
        },
        searchButtonGroupBottom: {
            width: "100%",
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
        },
        searchButtonTop: {
            width: "100%",
            justifyContent: 'flex-start',
        },
        searchButtonBottom: {
            width: "50%",
            justifyContent: 'flex-start',
            flexShrink: 1,
            flexWrap: 'wrap'
        }
    });
});