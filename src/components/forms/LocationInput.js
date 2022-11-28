import React, {useEffect, useState} from 'react';
import {SafeAreaView, Image, View} from 'react-native';
import {Icon, Input, Layout, List, ListItem, Spinner, withStyles} from '@ui-kitten/components';
import {useDebounce} from "../../hooks";
import {useDispatch, useSelector} from "react-redux";
import axios from 'axios';
import {suggestionsSet} from "../../actions/SearchActions";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

//TODO MAKE ANOTHER FILE FOR URIS
const GOOGLE_PLACE_API_AUTOCOMPLETE_URI = "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=HIDDEN&option=(cities)"
const GOOGLE_PLACE_API_DETAILS_URI = "https://maps.googleapis.com/maps/api/place/details/json?key=HIDDEN";

const GPSLocationItem = (props) => {
    const {onGPSSelect} = props;
    const gpsLocation = useSelector((state) => state.gpsLocation);
    const {city} = gpsLocation;
    const { t } = useTranslation();

    let title = (city != null) ? `${city}` : t('Get your current location');
    let description = (city != null) ? t('Use your current location') : '';

    const handleOnPress = () => {
        onGPSSelect({data: gpsLocation, city: city});
    };

    const NavigationIcon = (style) => (
        <Icon {...style} name='navigation-2-outline'/>
    );

    return (
        <ListItem
            title={title}
            description={description}
            icon={NavigationIcon}
            onPress={handleOnPress}
        />
    );
};

const LocationItem = (props) => {
    const {item, index, onSelect} = props;

    let city = item?.structured_formatting?.main_text;

    const handleOnPress = () => {
        /*
         * Get coordinates from the selected place
         */
        let uri = GOOGLE_PLACE_API_DETAILS_URI;
        uri += `&place_id=${item?.place_id}`;
        axios.get(uri)
            .then(res => res.data)
            .then(
                (data) => {
                    onSelect({data: data, city: city})
                }
            )
            .catch(error => alert(error.message));
    };

    const PinIcon = (style) => (
        <Icon {...style} name='pin-outline'/>
    );

    return (
        <ListItem
            index={index}
            title={city}
            description={(item?.structured_formatting?.secondary_text) ? `${item?.structured_formatting?.secondary_text}` : null}
            icon={PinIcon}
            /*            accessory={() => (
                            <Text
                                appearance='hint'
                                category='c1'>
                                {item?.distance_meters}
                            </Text>)}*/
            onPress={(city) => handleOnPress(city)}
        />
    );
};

const LocationInputComponent = (props) => {
    const { t } = useTranslation();
    const {selectedOption, showGPSLocation} = props;
    const [isFetching, setIsFetching] = useState(false);
    const [searchValue, setSearchValue] = useState(selectedOption);
    const debouncedSearchValue = useDebounce(searchValue, 900);

    const dispatch = useDispatch();
    const themeReducer = useSelector((state) => state.theme);
    const locationReducer = useSelector((state) => state.location);
    const gpsLocationReducer = useSelector((state) => state.gpsLocation);

    const handleSearchChange = (value) => {
        if (value != null) {
            setSearchValue(value);
        }
    };

    useEffect(() => {
        if (debouncedSearchValue) {
            let uri = GOOGLE_PLACE_API_AUTOCOMPLETE_URI;

            if (gpsLocationReducer.isoCountryCode != null) {
                uri += `&region=${gpsLocationReducer.isoCountryCode}`
            }

            uri += `&input=${debouncedSearchValue}`;

            getData(uri);
        } else {
            dispatch(suggestionsSet([]));
        }
    }, [debouncedSearchValue]);

    const getData = (uri) => {
        setIsFetching(true);

        axios.get(uri)
            .then(res => res.data)
            .then((data) => dispatch(suggestionsSet(data?.predictions)))
            .catch(error => alert(error.message))
            .finally(() => setIsFetching(false));

    };

    const {themedStyle} = props;
    return (
        <SafeAreaView style={{flex: 1}}>
            <Layout>
                <Input
                    style={themedStyle.searchBar}
                    placeholder={t('Search')}
                    icon={() => (<Icon name='search'/>)}
                    autoCorrect={false}
                    value={searchValue}
                    onChangeText={(value) => handleSearchChange(value)}
                />
                <Layout style={themedStyle.container}>
                    {
                        (showGPSLocation) ?
                            <Layout style={themedStyle.listContent}>
                                <GPSLocationItem {...props}/>
                            </Layout>
                            : null
                    }

                    {
                        (!isFetching) ? (
                            <Layout>
                                {
                                    (locationReducer.suggestions.length > 0) ? (
                                        <List
                                            style={themedStyle.list}
                                            contentContainerStyle={themedStyle.listContent}
                                            data={locationReducer.suggestions}
                                            renderItem={({item, index}) => <LocationItem item={item}
                                                                                         index={index} {...props}/>}
                                            ListFooterComponent={
                                                <View style={themedStyle.layout_bottom_view}>
                                                    {
                                                        (themeReducer.name === 'dark') ? (
                                                            <Image  source={require('../../core/img/powered_by_google_on_non_white.png')}/>
                                                        ) : (
                                                            <Image  source={require('../../core/img/powered_by_google_on_white.png')}/>
                                                        )
                                                    }

                                                </View>
                                            }
                                        />
                                    ) : (
                                        null
                                    )
                                }
                            </Layout>
                        ) : (
                            <Layout style={themedStyle.loadingContainer}>
                                <Spinner/>
                            </Layout>
                        )
                    }
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};

export const LocationInput = withStyles(LocationInputComponent, (theme) => {
    return ({
        container: {
            height: "100%",
        },
        list: {
            height: "100%"
        },
        listContent: {
            paddingHorizontal: 0,
            paddingVertical: 0,
        },
        searchBar: {
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        loadingContainer: {
            flex: 1,
            width: "100%",
            minHeight: 60,
            alignItems: 'center',
            justifyContent: 'center',
        },
        layout_bottom_view: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
    });
});

LocationInput.propTypes = {
    showGPSLocation: PropTypes.bool,
    selectedOption: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
};