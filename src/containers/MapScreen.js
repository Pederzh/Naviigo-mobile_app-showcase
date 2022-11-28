import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Icon, Layout, withStyles} from '@ui-kitten/components';
import {useDispatch, useSelector} from "react-redux";
import Carousel from 'react-native-snap-carousel';
import {getGpsLocation, locationSet} from "../actions/SearchActions";
import {LottieLoader} from "../components/common/LottieLoader";
import {SmallBoatCard} from "../components/SmallBoatCard";
import {FALLBACK_REGION} from "../utils/constraints";
import {useScreenInfo} from "../hooks";
import {useTranslation} from "react-i18next";

const CloseIcon = (style) => (
    <Icon {...style} name='close-outline'/>
);

const SyncIcon = (style) => (
    <Icon {...style} name='sync-outline'/>
);

const MapScreenComponent = (props) => {
    const {navigation, themedStyle} = props;
    const { t } = useTranslation();

    //Access Redux Store State
    const gpsLocation = useSelector((state) => state.gpsLocation);
    const location = useSelector((state) => state.location);
    const dataReducer = useSelector((state) => state.data);
    const {data} = dataReducer;

    const dispatch = useDispatch();
    const mapRef = useRef();
    const carouselRef = useRef();
    const markersRef = useRef([...Array(data.length)].map(() => React.createRef()));
    const markersTextRef = useRef([...Array(data.length)].map(() => React.createRef()));

    const [showReload, setShowReload] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [initialMapRegion, setInitialMapRegion] = useState(null);
    const [changedMapRegion, setChangedMapRegion] = useState(null);

    const screenInfo = useScreenInfo();
    const {height, width, orientation, aspectRatio, isTablet} = screenInfo;

    useEffect(() => {
        if (location?.latitude != null && location?.longitude != null) {
            setInitialMapRegion(location);
            return;
        }

        dispatch(getGpsLocation());

    }, []);

    useEffect(() => {
        if (location?.latitude != null && location?.longitude != null) {
            return;
        }

        if ((gpsLocation?.latitude != null && gpsLocation?.longitude != null)) {
            setInitialMapRegion(gpsLocation);
        }
    }, [gpsLocation]);

    //-------------

    const handleOnRegionChange = (region) => {
        setChangedMapRegion(region);
        setShowReload(true);
    };

    const handleReloadPress = () => {
        //TODO call boat with new coordinates with debouncedMapRegion value
        //SET ON THE LOCATION STATE THE "AREA SELECTED FROM THE MAP"
        dispatch(locationSet({
            city: t('Location selected in the map.'),
            latitude: changedMapRegion?.latitude,
            longitude: changedMapRegion?.longitude,
            latitudeDelta: changedMapRegion?.latitudeDelta,
            longitudeDelta: changedMapRegion?.longitudeDelta,
        }));
        setShowReload(false);
    };

    //-------------

    const onCarouselItemChange = (index) => {
        let location = data[index]?.location;

        mapRef?.current?.animateToRegion({
            latitude: location[0],
            longitude: location[1],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        });

        if (selectedMarker != null) {
            markersRef.current[selectedMarker].current.setNativeProps({
                style: {backgroundColor: '#FFFFFF'}
            });
            markersTextRef.current[selectedMarker].current.setNativeProps({
                style: {color: '#000000'}
            });
        }

        markersRef.current[index].current.setNativeProps({
            style: {backgroundColor: '#000000'}
        });

        markersTextRef.current[index].current.setNativeProps({
            style: {color: '#FFFFFF'}
        });

        setSelectedMarker(index);
    };

    const onMarkerPressed = (location, index) => {
        mapRef?.current?.animateToRegion({
            latitude: location[0],
            longitude: location[1],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        });

        carouselRef.current.snapToItem(index);
    };

    return (
        <Layout style={{flex: 1}}>
            <View style={themedStyle.container}>
                {
                    (initialMapRegion) ? (
                        <View>
                            <MapView
                                ref={mapRef}
                                style={{width, height}}
                                provider={PROVIDER_GOOGLE}
                                showsUserLocation={true}
                                initialRegion={(initialMapRegion?.latitude != null && initialMapRegion?.longitude != null) ? initialMapRegion : FALLBACK_REGION}
                                onRegionChangeComplete={handleOnRegionChange}
                            >
                                {
                                    data.map((marker, index) => (
                                        <Marker
                                            key={marker.objectID}
                                            onPress={() => onMarkerPressed(marker?.location, index)}
                                            coordinate={{latitude: marker?.location[0], longitude: marker?.location[1]}}
                                        >
                                            <View style={themedStyle.customMarker}
                                                  ref={markersRef.current[index]}>
                                                <Text style={themedStyle.customMarkerText}
                                                      ref={markersTextRef.current[index]}>{marker?.price?.minHourPrice}</Text>
                                            </View>
                                        </Marker>
                                    ))
                                }
                            </MapView>
                            <View>
                                <Carousel
                                    ref={carouselRef}
                                    data={data}
                                    containerCustomStyle={themedStyle.carousel}
                                    renderItem={(boat) => <SmallBoatCard boat={boat}
                                                                         key={boat}
                                                                         onPress={() => navigation.navigate('BoatScreen', {id: boat?.item?.id, hostUsername: boat?.item?.hostUsername})}
                                    />}
                                    sliderWidth={width}
                                    itemWidth={300}
                                    removeClippedSubviews={false}
                                    onSnapToItem={(index) => onCarouselItemChange(index)}
                                />
                            </View>
                            <Button style={themedStyle.buttonClose} status='basic'
                                    onPress={() => navigation.navigate("ExploreScreen")}
                                    icon={CloseIcon}
                            />
                            {(showReload) ? (
                                <Button style={themedStyle.buttonReload} status='basic'
                                        onPress={handleReloadPress}
                                        icon={SyncIcon}
                                >
                                    {t('Search in this area')}
                                </Button>
                            ) : null
                            }
                        </View>
                    ) : (
                        <LottieLoader/>
                    )
                }
            </View>
        </Layout>

    );
};

export const MapScreen = withStyles(MapScreenComponent, (theme) => {
    return (
        {
            container: {
                flex: 1,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
            },
            carousel: {
                position: 'absolute',
                bottom: 10,
                marginBottom: 48
            },
            buttonClose: {
                flex: 1,
                flexDirection: 'row',
                position: 'absolute',
                marginHorizontal: 16,
                top: 100,
                height: 45,
                width: 45,
                alignSelf: "flex-start",
                borderWidth: 0.5,
                borderRadius: 10,
                shadowColor: 'rgba(0, 0, 0, 0.15)',
                shadowOpacity: 0.8,
                elevation: 6,
                shadowRadius: 5,
                shadowOffset: {width: 3, height: 3},
            },
            buttonReload: {
                flex: 1,
                flexDirection: 'row',
                position: 'absolute',
                marginHorizontal: 16,
                top: 100,
                height: 45,
                alignSelf: "center",
                borderWidth: 0.5,
                borderRadius: 10,
                shadowColor: 'rgba(0, 0, 0, 0.15)',
                shadowOpacity: 0.8,
                elevation: 6,
                shadowRadius: 5,
                shadowOffset: {width: 3, height: 3},
            },
            customMarker: {
                padding: 10,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
                shadowRadius: 100,
                backgroundColor: '#FFFFFF',
                borderColor: '#FFFFFF',
            },
            customMarkerText: {
                fontWeight: 'bold',
            }
        }
    );
});

const style = StyleSheet.create({

    cardContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        height: 200,
        width: 300,
        padding: 24,
        borderRadius: 24
    },
    cardImage: {
        height: 120,
        width: 300,
        bottom: 0,
        position: 'absolute',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    },
    cardTitle: {
        color: 'white',
        fontSize: 22,
        alignSelf: 'center'
    }
});