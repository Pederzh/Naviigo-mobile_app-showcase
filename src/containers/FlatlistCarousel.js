import * as React from 'react';
import {Animated, AsyncStorage, Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import {StyleService} from "@ui-kitten/components";
import {useScreenInfo} from "../hooks";
import {useTranslation} from "react-i18next";

const bgs = ['#20D5E1', '#36cae4', '#41A9EA', '#2791d2'];
const DATA = [
    {
        "key": "3571572",
        "title": "tutorial-title-1",
        "description": "tutorial-description-1",
        "image": "S3_URL/001-boat.png"
    },
    {
        "key": "3571747",
        "title": "tutorial-title-2",
        "description": "tutorial-description-2",
        "image": "S3_URL/002-keys.png"
    },
    {
        "key": "3571680",
        "title": "tutorial-title-3",
        "description": "tutorial-description-3",
        "image": "S3_URL/003-insurance.png"
    },
    {
        "key": "3571603",
        "title": "tutorial-title-4",
        "description": "tutorial-description-4",
        "image": "S3_URL/004-hat.png"
    }
];

const Indicator = ({scrollX}) => {
    const screenInfo = useScreenInfo();
    const {height, width, isTablet, aspectRatio} = screenInfo;

    return <View style={{position: 'absolute', bottom: 100, flexDirection: 'row'}}>
        {DATA.map((_, i) => {
            // ----------------[previous, current, next slide]
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

            const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.8, 1.4, 0.8],
                extrapolate: 'clamp'
            })
            const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.6, 0.9, 0.6],
                extrapolate: 'clamp'
            })
            return <Animated.View
                key={`indicator-${i}`}
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    opacity,
                    margin: 10,
                    transform: [{
                        scale,
                    }]
                }}
            />
        })}
    </View>
}

const Backdrop = ({scrollX}) => {
    const screenInfo = useScreenInfo();
    const {height, width, isTablet, aspectRatio} = screenInfo;
    const backgroundColor = scrollX.interpolate({
        inputRange: bgs.map((_, i) => i * width),
        outputRange: bgs.map((bg) => bg),
    })
    return <Animated.View
        style={[
            StyleSheet.absoluteFillObject,
            {
                backgroundColor,
            },
        ]}
    />
}

const Square = ({scrollX}) => {
    const screenInfo = useScreenInfo();
    const {height, width, isTablet, aspectRatio} = screenInfo;
    // YOLO is used to animate the square while sliding
    const YOLO = Animated.modulo(
        Animated.divide(
            Animated.modulo(scrollX, width),
            new Animated.Value(width)), 1
    );
    const rotate = YOLO.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['35deg', '0deg', '35deg'],
    });
    const translateX = YOLO.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -height, 0],
    });

    return <Animated.View
        style={{
            width: height,
            height: height,
            backgroundColor: '#fff',
            borderRadius: 86,
            position: 'absolute',
            top: -height * 0.6,
            left: -height * 0.3,
            transform: [
                {
                    rotate,
                },
                {
                    translateX,
                }
            ]
        }}
    />
}

export const FlatlistCarousel = (props) => {
    const { t } = useTranslation();
    const screenInfo = useScreenInfo();
    const {height, width, isTablet, aspectRatio, orientation} = screenInfo;
    // if the tutorial has already been shown (and closed), bypass it by redirecting to the login page
    handleTutorial().then((showTutorial) => {
        if (!showTutorial) {
            props.navigation.navigate('Login')
        }
    });

    const scrollX = React.useRef(new Animated.Value(0)).current;

    return (
        <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
            <StatusBar hidden/>
            <Backdrop scrollX={scrollX}/>
            <Square scrollX={scrollX}/>
            <Animated.FlatList
                data={DATA}
                keyExtractor={(item) => item.key}
                horizontal
                scrollEventThrottle={32}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {x: scrollX}}}],
                    {useNativeDriver: false}
                )}
                contentContainerStyle={{paddingBottom: 100}}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                renderItem={({item}) => {
                    return (
                        <View
                            style={[{width}, (orientation == 'PORTRAIT') ? style.imageLayoutMobile : [style.imageLayoutTablet, {paddingLeft: width / 7}]]}>
                            <View style={{flex: 0.7, justifyContent: 'center'}}>
                                <Image
                                    source={{uri: item.image}}
                                    style={style.image}
                                />
                            </View>
                            <View style={{flex: 0.3}}>
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: '800',
                                    fontSize: 28,
                                    marginBottom: 10
                                }}>
                                    {t(item.title)}
                                </Text>
                                <Text style={{color: '#fff', fontWeight: '300'}}>
                                    {t(item.description)}
                                </Text>
                            </View>
                        </View>
                    )
                }}
            />
            <Indicator scrollX={scrollX}/>
            <Text
                style={{position: 'absolute', bottom: 40}}
                appearance='hint'
                onPress={async () => {
                    await AsyncStorage.setItem('showTutorial', '0');
                    props.navigation.navigate('Login');
                }}>
                {t('Close tutorial')}
            </Text>
        </View>
    );
}

const handleTutorial = async () => {
    const showTutorial = await AsyncStorage.getItem('showTutorial');
    if (showTutorial == '0') {
        return false;
    } else {
        return true;
    }
}

const style = StyleService.create({
    image: {
        width: 150,
        height: "50%",
        resizeMode: 'contain',
        maxWidth: 150
    },
    imageLayoutMobile: {
        alignItems: 'center',
        padding: 20
    },
    imageLayoutTablet: {
        alignItems: 'left',
    }
});