import React from "react";
import {SafeAreaView,} from 'react-native';
import {Layout, StyleService, withStyles} from '@ui-kitten/components';
import {Search} from "../components/Search";
import {useDispatch, useSelector} from 'react-redux';
import {BoatListScreen} from "./BoatListScreen";
import {PlaceListScreen} from "./PlaceListScreen";

//Logger.LOG_LEVEL = 'DEBUG';

const ExploreScreenComponent = (props) => {
    const {navigation} = props;
    const {themedStyle} = props;
    const location = useSelector((state) => state.location);

    return (
            <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
                <Layout style={themedStyle.layout_top}>
                    <Search
                        navigation={navigation}
                    />
                </Layout>
                <Layout style={themedStyle.layout_content}>
                    {
                        (location.city != null) ?
                            <BoatListScreen {...props}/>
                            :
                            <PlaceListScreen {...props}/>
                    }
                </Layout>
            </SafeAreaView>
    );
};

export const ExploreScreen = withStyles(ExploreScreenComponent, (theme) => {
    return ({
        layout_top: {
            flex: 1,
            minHeight: 5,
            paddingBottom: 8,
        },
        layout_content: {
            flex: 9,
        },
    })
});

const style = StyleService.create({
});