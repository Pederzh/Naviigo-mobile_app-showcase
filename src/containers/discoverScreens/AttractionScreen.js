import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Layout, Text, withStyles} from "@ui-kitten/components";
import {ImageOverlay} from "../../components/common/ImageOverlay";
import boatData from "../../core/models/boat";

const AttractionScreenComponent = (props) => {
    const {data, themedStyle} = props;
    return(
         <SafeAreaView style={{flex: 1}}>
                <ScrollView>
                    <Layout level='1'>
                        <ImageOverlay
                            style={themedStyle.backgroundImage}
                            source={require('naviigo/assets/img/boat1.jpg')}
                        />

                        <View style={themedStyle.aboutSection}>
                            <Text
                                style={themedStyle.sectionLabel}
                                category='h6'>
                                {data.name}
                            </Text>
                            <Text style={themedStyle.description} appearance='hint'>
                                {data.description}
                            </Text>
                        </View>
                    </Layout>
                </ScrollView>
         </SafeAreaView>
    );
};

export const AttractionScreen = withStyles(AttractionScreenComponent, (theme) => {

    return ({
        container: {
            width: "100%",
            height: "100%",
        },
        backgroundImage: {
            minHeight: 240,
        },
        aboutSection: {
            marginHorizontal: 12,
            marginVertical: 12,
        },
        sectionLabel: {
            marginVertical: 8,
        },
        aboutLabel: {
            marginVertical: 16,
            //fontFamily: 'opensans-regular',
            fontWeight: 'normal',
        },
    });
});

const style = StyleSheet.create({

});