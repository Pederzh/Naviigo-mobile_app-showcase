import React, {useEffect, useRef, useState, useCallback} from "react";
import {View,} from 'react-native';
import {Button, Icon, Layout, StyleService, Text, withStyles} from '@ui-kitten/components';
import BottomSheet from 'reanimated-bottom-sheet';
import {SimpleLineIcons} from "@expo/vector-icons";
import {useDispatch, useSelector} from 'react-redux';
import {LottieLoader} from "../components/common/LottieLoader";
import {boatUnset} from "../actions/BoatActions";
import {BoatListFilterContent, BoatListFilterHeader} from "../components/BoatListFilter";
import {Configure, connectStats} from 'react-instantsearch-native';
import InfiniteHits from "../components/algolia/InfiniteHits";
import {WeatherText} from "../components/weather/WeatherText";
import {searchClient} from "../config/api.config";
import {InstantSearch} from 'react-instantsearch-native';
import algoliasearch from 'algoliasearch';
import {useTranslation} from "react-i18next";

const BoatListScreenComponent = (props) => {
    const {navigation, themedStyle} = props;
    const [isFetching, setIsFetching] = useState(false);
    const [filterIsOpen, setFilterIsOpen] = useState(false);
    const [searchState, setSearchState] = useState({});
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const locationReducer = useSelector((state) => state.location);
    useEffect(() => {

    }, [locationReducer.longitude, locationReducer.latitude]);


    const sheetRef = useRef(null);

    /*
 * Unset the state of the boat when going back to the search screen
 */
    useEffect(() => {
    const unsetBoat = navigation.addListener('focus', () => {
        dispatch(boatUnset());
    });
    return unsetBoat;
}, [navigation]);


    const onSearchStateChange = (newState) => {
        setSearchState(newState);
    }
    return (
        <>
        {
        (searchState) ?  <Layout style={themedStyle.layout_content}>
            <InstantSearch
                searchClient={searchClient}
                indexName="boat"
                //routing={true}
                searchState={searchState}
                onSearchStateChange={onSearchStateChange}
            >
                {(isFetching) ? (
                    <Layout style={themedStyle.layout_middle}>
                        <LottieLoader/>
                    </Layout>
                ) : (
                    <Layout style={themedStyle.layout_middle}>
                        <View style={themedStyle.layout_filter_view}>
                            <ConnectedStats label={` ${t('boats')} + ${t('other results')}`}/>
                            <Button style={themedStyle.filterButton} appearance='outline' status='basic' size='small'
                                    icon={(props) => <Icon {...props} name='options-2-outline'/>}
                                    onPress={() => sheetRef.current.snapTo(0)}
                            >
                                {t("Filter")}
                            </Button>
                        </View>
                        <View style={themedStyle.layout_list_view}>
                            <Configure
                                aroundLatLng={`${locationReducer.latitude}, ${locationReducer.longitude}`}
                                aroundRadius={30000} //taking a radius of x meters
                            />
                            <InfiniteHits searchState={searchState} {...props} />
                        </View>
                        <View style={themedStyle.layout_bottom_view}>
                            <Button
                                style={themedStyle.bottomButton}
                                onPress={() => props.navigation.navigate('MapScreen')}>
                                <SimpleLineIcons name="map"/>
                                {`  ${t('Maps')}`}
                            </Button>
                        </View>
                    </Layout>
                )
                }
                <BottomSheet
                    ref={sheetRef}
                    snapPoints={['58%', 0]}
                    initialSnap={1}
                    borderRadius={10}
                    enabledContentGestureInteraction={false}
                    renderHeader={() => (<BoatListFilterHeader/>)}
                    renderContent={() => (
                        <BoatListFilterContent
                            sheetRef={sheetRef}
                            searchState={searchState}
                            //onSearchStateChange={onSearchStateChange}
                            setSearchState={setSearchState}
                            {...props}
                        />)}
                    {...props}
                />
            </InstantSearch>
        </Layout> : null
        }
    </>
    );
};

const ConnectedStats = connectStats(({nbHits, label}, ...props) => (
    <View>
        <Text category='h6'>
            {nbHits.toLocaleString() + label}
        </Text>
        <WeatherText {...props}/>
    </View>
));

export const BoatListScreen = withStyles(BoatListScreenComponent, (theme) => {
    return ({
        layout_top: {
            flex: 1,
            paddingBottom: 8,
        },
        layout_content: {
            flex: 1,
            flexDirection: 'column'
        },
        layout_middle: {
            flex: 1,
            paddingTop: 4,
            paddingLeft: 16,
            paddingRight: 16,
        },
        layout_bottom: {
            flex: 1,
            justifyContent: 'flex-end',
            //backgroundColor: theme['color-primary-100'],
            padding: 20,
            //backgroundColor: theme['color-primary-transparent-100'],
        },
        layout_list_view: {
            flex: 13,
        },
        layout_bottom_view: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        layout_filter_view: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 0,
            minHeight: 50
        },
        bottomButton: {
            bottom: 16,
            position: 'absolute',
            borderRadius: 30,
            height: 10,
            alignItems: 'center',
            justifyContent: 'center',
            shadowRadius: 100,
            backgroundColor: '#000000',
            borderColor: '#000000',
            shadowOpacity: 0.3,
            shadowOffset: {height: 10}
        },
        filterButton: {
            borderWidth: 0.5,
            width: 100,
            height: 44,
            borderRadius: 50,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowOpacity: 0.8,
            elevation: 6,
            shadowRadius: 5,
            shadowOffset: {width: 3, height: 3},
        },
    })
});

const style = StyleService.create({
});