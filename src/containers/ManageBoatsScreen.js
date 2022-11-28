import React, {useEffect, useState} from 'react';
import {RefreshControl, SafeAreaView, ScrollView, View} from 'react-native';
import {Layout, List, Text, withStyles, TopNavigation, TopNavigationAction, Icon} from '@ui-kitten/components';
import {SmallBoatCard} from "../components/SmallBoatCard";
import {LottieLoader} from "../components/common/LottieLoader";
import {addData} from "../actions/DataActions";
import {dataReducer} from "../reducers/DataReducer";
import {API} from 'aws-amplify';
import {useDispatch, useSelector} from "react-redux";
import Toast from "react-native-toast-message";
import {BOOKING_CATEGORY_STANDARD} from "../utils/constraints";
import {checkBoat, checkId} from "../utils/errors";
import {useTranslation} from "react-i18next";

const ManageBoatsScreenComponent = (props) => {
    const authState = useSelector((state) => state.auth);
    const {navigation, themedStyle} = props;
    const [boatsData, setBoatsData] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { t } = useTranslation();

    //2 - MAIN CODE BEGINS HERE
    useEffect(() => getData(), []);

    //3 - GET FLATLIST DATA
    const getData = () => {
        setIsFetching(true);

        if (!checkId(authState?.id)) {
            return;
        }

        API.get("naviigo_api", `/${authState?.id}/boats`, null)
            .then(response => setBoatsData(response))
            .catch(error => {
                Toast.show({text1: t('Something went wrong'), text2: `${t('Error')}: ${error.message}`, type: "error"})
            })
            .finally(() => {
                setIsFetching(false);
                setRefreshing(false);
            });
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getData();
    }, []);

    const PlusIcon = (props) => (
        <Icon {...props} name={"plus-outline"}/>
    );

    const PlusAction = (props) => (
        <TopNavigationAction {...props} icon={PlusIcon}/>
    );

    const RightControls = (props) => [
        <PlusAction key={1} onPress={() => props.navigation.navigate("BoatAddEditScreen")}/>
    ];

    return (
        <SafeAreaView style={{flex: 1}}>
            <TopNavigation
                alignment='center'
                title={t('Manage Boats')}
                rightControls={<RightControls {...props}/>}
            />
            <Layout style={themedStyle.layout_middle}>
                <View  style={{width: "100%"}}>
                    {(isFetching) ? (
                        <LottieLoader/>
                    ) : (
                        <View>
                            <List
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                                contentContainerStyle={themedStyle.listContent}
                                data={boatsData}
                                renderItem={(item) => <SmallBoatCard style={themedStyle.item}
                                                                               boat={item} key={item?.item?.id}
                                                                               onPress={() => navigation.navigate('BoatScreen', {id: item?.item?.id, hostUsername: item?.item?.hostUsername})}/>}
                            />
                        </View>
                    )
                    }
                </View>
            </Layout>
        </SafeAreaView>
    );
};

export const ManageBoatsScreen = withStyles(ManageBoatsScreenComponent, theme => ({
    layout_top: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        margin: 0,
        //backgroundColor: theme['color-primary-transparent-100'],
    },
    layout_middle: {
        flex: 7,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme['color-primary-100'],
        padding: 0,
        //backgroundColor: theme['color-primary-transparent-100'],
    },
    layout_bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        backgroundColor: theme['color-primary-100'],
        padding: 20,
        //backgroundColor: theme['color-primary-transparent-100'],
    },
    text: {
        color: theme['color-primary-100'],
        fontWeight: 'bold',
    },
    item: {
        paddingVertical: 8,
        marginVertical: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
}));

