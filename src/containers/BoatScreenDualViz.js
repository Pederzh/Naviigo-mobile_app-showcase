import React, {useEffect} from "react";
import {View} from 'react-native';
import {Layout, withStyles} from '@ui-kitten/components';
import {BoatScreen} from './BoatScreen'
import {ExploreScreen} from "./ExploreScreen";
import {useScreenInfo} from "../hooks";

const BoatScreenDualVizComponent = (props) => {
    const {themedStyle, navigation, route} = props;
    const [idBoat, setIdBoat] = React.useState(route?.params?.id);
    const [hostUsernameBoat, setHostUsernameBoat] = React.useState(route?.params?.hostUsername);
    const screenInfo = useScreenInfo();
    const {height, width, orientation, aspectRatio, isTablet} = screenInfo;

    useEffect(() => {
        setIdBoat(route?.params?.id);
        setHostUsernameBoat(route?.params?.hostUsername);
    }, [route?.params?.id, route?.params?.hostUsername]);

    return (
        <View>
            {
                (!isTablet || orientation == "PORTRAIT") ? (
                    <BoatScreen key={idBoat} id={idBoat} hostUsername={hostUsernameBoat} navigation={navigation}/>
                ) : (
                    <Layout style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start'
                    }}>
                        <Layout style={themedStyle.exploreLayout}>
                            <ExploreScreen numColumns={1} {...props}/>
                        </Layout>
                        <Layout style={{width: '60%'}}>
                            <BoatScreen key={idBoat}
                                        id={idBoat}
                                        hostUsername={hostUsernameBoat}
                                        navigation={navigation}/>
                        </Layout>
                    </Layout>
                )
            }
        </View>
    )
};

export const BoatScreenDualViz = withStyles(BoatScreenDualVizComponent, (theme) => {
    return ({
        container: {
            flex: 1,
        },
        exploreLayout: {
            width: "40%",
            height: "100%",
            borderRightWidth: 2,
            borderRightColor: 'gainsboro'
        }
    })
});