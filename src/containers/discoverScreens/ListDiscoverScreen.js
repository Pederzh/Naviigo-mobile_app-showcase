import React from 'react';
import {SafeAreaView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Card, Layout, List, Text, withStyles} from "@ui-kitten/components";
import {SideImageCard} from "../../components/common/SideImageCard";

const ListDiscoverScreenComponent = (props) => {
    const {data, themedStyle} = props;
    return(
            <Layout level='1'>
                <List
                    contentContainerStyle={themedStyle.listContent}
                    data={data}
                    renderItem={({item}) => <SideImageCard title={item?.name} image={item?.image} key={`${item?.latitude}${item?.longitude}`} onPress={() => console.log(item)}/>}
                />
            </Layout>
    );
};

export const ListDiscoverScreen = withStyles(ListDiscoverScreenComponent, (theme) => {

    return ({
        listContent: {
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
    });
});

const style = StyleSheet.create({
    item: {
        borderRadius: 24,
        marginVertical: 8,
    },
});