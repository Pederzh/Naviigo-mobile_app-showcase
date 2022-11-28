import React from 'react'
import { View, Text } from 'react-native'
import { withStyles } from '@ui-kitten/components'



export const LoadingScreen = () =>  {
    console.log("loading screen component");
    return (
        <View style={{backgroundColor: "white", flex:1}}>
            <Text> LOADING </Text>
            <LottieView
                style={{
                    width: 300,
                    aspectRatio: 300 / 600,
                    flexGrow: 1,
                    alignSelf: 'center'
                }}
                source={require('../core/lottie/wave-loop-loading.json')}
                autoPlay loop 
            />
        </View>
    );
}