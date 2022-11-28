import React, {useState, useEffect} from 'react';
import {Image, ScrollView, View} from 'react-native';
import {Button, CheckBox, Layout, Text, withStyles} from "@ui-kitten/components";
import {TextualInfoItem} from "./common/TextualInfoItem";
import {Divider} from "./common/Divider";
import RefinementList from "./algolia/RefinementList";
import RangePicker from "./algolia/RangePicker";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const BoatListFilterHeaderComponent = (props) => {
    const {themedStyle} = props;
    return (
        <Layout>
            <View style={themedStyle.header}>
                <View style={themedStyle.panelHeader}>
                    <View style={themedStyle.panelHandle}/>
                </View>
            </View>
        </Layout>
    );
};


const BoatListFilterContentComponent = (props) => {
    const themeReducer = useSelector((state) => state.theme);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const {themedStyle, sheetRef} = props;
    const { t } = useTranslation();

    return (
        <Layout>
            <View style={themedStyle.panel}>
                <Layout style={{flex: 9}}>
                    <ScrollView scrollEnabled={scrollEnabled}>
                        <RangePicker
                            title={t("Price")}
                            attribute="price.minHourPrice"
                            onValuesChangeStart={() => setScrollEnabled(false)}
                            onValuesChangeFinish={() => setScrollEnabled(true)}
                        />
                        <Divider/>
                        <RefinementList
                            title={t("Driving mode")}
                            attribute="drivingMode"
                            limit={5}
                        />
                        <Divider/>
                        <RefinementList
                            title={t("Boat type")}
                            attribute="category"
                            limit={15}
                        />
                        <Divider/>
                        <View style={themedStyle.layout_bottom_view}>
                            {
                                (themeReducer.name === 'dark') ? (
                                    <Image style={{height: 17, width: 120}}  source={{uri: 'https://res.cloudinary.com/hilnmyskv/image/upload/q_auto,f_auto/v1629366174/Algolia_com_Website_assets/images/shared/algolia_logo/search-by-algolia-dark-background.png'}}/>
                                ) : (
                                    <Image style={{height: 17, width: 120}} source={{uri: 'https://res.cloudinary.com/hilnmyskv/image/upload/q_auto,f_auto/v1629366174/Algolia_com_Website_assets/images/shared/algolia_logo/search-by-algolia-light-background.png'}}/>

                                )
                            }

                        </View>
                    </ScrollView>
                </Layout>
                {/*<Layout style={{flex: 2}}>*/}
                    {/*<View style={themedStyle.layout_bottom_view}>*/}
                        {/*<Button*/}
                            {/*appearance='ghost' status='basic'*/}
                            {/*size='giant'*/}
                            {/*onPress={() => sheetRef.current.snapTo(1)}>*/}
                            {/*back*/}
                        {/*</Button>*/}
                        {/*<Button*/}
                            {/*style={themedStyle.buttonNext}*/}
                            {/*size='giant'*/}
                        {/*>*/}
                            {/*Filter*/}
                        {/*</Button>*/}
                    {/*</View>*/}
                {/*</Layout>*/}
            </View>
        </Layout>
    );
};

export const BoatListFilterHeader = withStyles(BoatListFilterHeaderComponent, (theme) => {

    return ({
        header: {
            shadowColor: '#000000',
            paddingTop: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderRightWidth: 2,
            borderColor: '#E8E8E8'
        },
        panelHeader: {
            alignItems: 'center',
        },
        panelHandle: {
            width: 40,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#00000040',
            marginBottom: 10,
        },

    });
});

export const BoatListFilterContent = withStyles(BoatListFilterContentComponent, (theme) => {

    return ({
        panel: {
            height: "100%",
            padding: 20,
        },
        panelTitle: {
            fontSize: 27,
            height: 35,
        },
        panelSubtitle: {
            fontSize: 14,
            color: 'gray',
            height: 30,
            marginBottom: 10,
        },
        panelButton: {
            padding: 20,
            borderRadius: 10,
            backgroundColor: '#318bfb',
            alignItems: 'center',
            marginVertical: 10,
        },
        panelButtonTitle: {
            fontSize: 17,
            fontWeight: 'bold',
            color: 'white',
        },
        sectionLabel: {
            marginVertical: 8,
        },
        layout_bottom_view: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        buttonNext: {
            width: "35%",
            height: 50,
            borderRadius: 30
        }
    });
});