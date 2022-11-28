import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import {Icon, withStyles} from '@ui-kitten/components';
import {useDispatch, useSelector} from "react-redux";
import Carousel from 'react-native-snap-carousel';
import {getGpsLocation} from "../../actions/SearchActions";
import {useScreenInfo} from "../../hooks";
import {LottieLoader} from "../../components/common/LottieLoader";
import {SideImageCard} from "../../components/common/SideImageCard";

const PinIcon = (style) => (
    <Icon {...style} name='pin-outline' width={26} height={26} fill='#C5CEE0'/>
);

const MapDiscoverScreenComponent = (props) => {
    const FALLBACK_REGION = {latitude: 46.01008, latitudeDelta: 0.0922, longitude: 9.96004, longitudeDelta: 0.0421};

    const {data, themedStyle} = props;

    const mapRef = useRef();
    const carouselRef = useRef();
    const markersRef = useRef([...Array(data.length)].map(() => React.createRef()));

    const [showReload, setShowReload] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [initialMapRegion, setInitialMapRegion] = useState(null);
    const [changedMapRegion, setChangedMapRegion] = useState(null);

    const screenInfo = useScreenInfo();
    const {height, width, orientation, aspectRatio, isTablet} = screenInfo;

    //Access Redux Store State
    const gpsLocation = useSelector((state) => state.gpsLocation);
    const location = useSelector((state) => state.location);

    const dispatch = useDispatch();

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

    //-------------

    const onCarouselItemChange = (index) => {
        let location = data[index];

        mapRef?.current?.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        });

        if (selectedMarker != null) {
            markersRef.current[selectedMarker].current.setNativeProps({
                style: {backgroundColor: '#FFFFFF'}
            });
            // markersTextRef.current[selectedMarker].current.setNativeProps({
            //     style: {color: '#000000'}
            // });
        }

        markersRef.current[index].current.setNativeProps({
            style: {backgroundColor: '#000000'}
        });

        // markersTextRef.current[index].current.setNativeProps({
        //     style: {color: '#FFFFFF'}
        // });

        setSelectedMarker(index);
    };

    const onMarkerPressed = (location, index) => {
        mapRef?.current?.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        });

        carouselRef.current.snapToItem(index);
    };

    return (
        <View style={themedStyle.container}>
            {
                (initialMapRegion) ? (
                    <View>
                        <MapView
                            ref={mapRef}
                            style={{width, height: height - 225}}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            initialRegion={(initialMapRegion?.latitude != null && initialMapRegion?.longitude != null) ? initialMapRegion : FALLBACK_REGION}
                            onRegionChangeComplete={handleOnRegionChange}
                        >
                            {
                                data.map((marker, index) => (
                                    <Marker
                                        key={marker.name}
                                        onPress={() => onMarkerPressed(marker, index)}
                                        coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                                    >
                                        <View style={themedStyle.customMarker}
                                              ref={markersRef.current[index]}>
                                            <PinIcon {...props}/>
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
                                renderItem={({item}) => <SideImageCard title={item?.name} image={item?.image}
                                                                       key={`${item?.latitude}${item?.longitude}`}
                                                                       onPress={() => console.log(item)}/>}
                                sliderWidth={width}
                                itemWidth={300}
                                removeClippedSubviews={false}
                                onSnapToItem={(index) => onCarouselItemChange(index)}
                            />
                        </View>
                    </View>
                ) : (
                    <LottieLoader/>
                )
            }
        </View>
    );
};

export const MapDiscoverScreen = withStyles(MapDiscoverScreenComponent, (theme) => {
    return (
        {
            container: {
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