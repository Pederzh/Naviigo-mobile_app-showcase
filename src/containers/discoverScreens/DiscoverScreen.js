import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Tab, TabBar, TopNavigation, withStyles} from "@ui-kitten/components";
import lakeComoDiscoverData from '../../core/models/discover-lakecomo.json';
import {MapDiscoverScreen} from "./MapDiscoverScreen";
import {ListDiscoverScreen} from "./ListDiscoverScreen";

const DiscoverScreenComponent = (props) => {
    const {themedStyle} = props;
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    return (
        <SafeAreaView style={{flex: 1}}>
            <View>
                <TopNavigation
                    alignment='center'
                    title='Discover places'
                />
            </View>
            <View style={{flex: 1}}>
                <TabBar
                    selectedIndex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}>
                    <Tab title='List'/>
                    <Tab title='Map'/>
                </TabBar>
                {
                    (selectedIndex === 0) && <ListDiscoverScreen
                        data={lakeComoDiscoverData}
                    />
                }
                {
                    (selectedIndex === 1) && <MapDiscoverScreen
                        data={lakeComoDiscoverData}
                    />
                }
            </View>
        </SafeAreaView>
    );
};

export const DiscoverScreen = withStyles(DiscoverScreenComponent, (theme) => {

    return ({
        tabContainer: {
            height: 64,
            alignItems: 'center',
            justifyContent: 'center',
        },

    });
});

const style = StyleSheet.create({});