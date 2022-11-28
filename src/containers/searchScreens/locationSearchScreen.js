import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
import {Layout, Text, withStyles} from '@ui-kitten/components';
import {useDebounce} from "../../hooks";
import {useDispatch, useSelector} from "react-redux";
import {locationSet, locationSetFromGps} from "../../actions/SearchActions";
import {LocationInput} from "../../components/forms/LocationInput";
import {connectGeoSearch} from 'react-instantsearch-native';
import {useTranslation} from "react-i18next";

const LocationSearchScreenComponent = (props) => {
    const [isFetching, setIsFetching] = useState(false);
    const [searchValue, setSearchValue] = useState(null);
    const debouncedSearchValue = useDebounce(searchValue, 900);
    const {themedStyle} = props;

    const dispatch = useDispatch();
    const locationReducer = useSelector((state) => state.location);
    const gpsLocationReducer = useSelector((state) => state.gpsLocation);

    const {refine, currentRefinement, hits} = props;
    const { t } = useTranslation();

    const onSelect = (selectedData) => {
        let location = {
            city: selectedData?.city,
            latitude: selectedData?.data?.result?.geometry?.location?.lat,
            longitude: selectedData?.data?.result?.geometry?.location?.lng,
            northeast: selectedData?.data?.result?.geometry?.viewport?.northeast,
            southwest: selectedData?.data?.result?.geometry?.viewport?.southwest,
        };
        dispatch(
            locationSet(location)
        );
        //Algolia refine
        // refine(
        //     {
        //         northEast: location.northeast,
        //         southWest: location.southwest
        //     }
        // );
        props.navigation.navigate("DateSearchScreen");
    };

    const onGPSSelect = (selectedData) => {
        if (selectedData?.city == null) {
            dispatch(locationSetFromGps()); //TODO add northeast southwest
        } else {
            let gpsLocation = {
                city: selectedData?.city,
                latitude: selectedData?.data?.latitude,
                longitude: selectedData?.data?.longitude,
                northeast: selectedData?.data?.northeast,
                southwest: selectedData?.data?.southwest,
            };
            dispatch(locationSet(gpsLocation));
            props.navigation.navigate("DateSearchScreen")
        }
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <Layout style={themedStyle.layout_top}>
                <Text category='h5'>
                    {t("Where do you want to go?")}
                </Text>
            </Layout>
            <Layout style={themedStyle.layout_middle}>
                <LocationInput
                    onSelect={onSelect}
                    showGPSLocation={true}
                    onGPSSelect={onGPSSelect}
                />
            </Layout>
        </SafeAreaView>
    );
};

const LocationSearchScreen = withStyles(LocationSearchScreenComponent, (theme) => {
    return ({
        container: {
           flex: 1,
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
        layout_top: {
            flex: 1,
            justifyContent: 'center',
            padding: 12,
            margin: 0,
        },
        layout_middle: {
            flex: 20,
        },
    });
});

export default LocationSearchScreen;