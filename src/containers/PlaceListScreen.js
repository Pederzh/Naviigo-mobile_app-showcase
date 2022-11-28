import React from "react";
import {List, Text, withStyles} from '@ui-kitten/components';
import PlaceCard from "../components/PlaceCard";
import {useTranslation} from "react-i18next";

const exploreData = [
    {
        title: "Lake Como",
        subtitle: "Italy",
        image: "S3_URL/explore-como.jpg",
        location: {
            lat: 46.0160486,
            lng: 9.257167599999999,
        },
        viewport: {
            northeast: {
                lat: 46.17057927016122,
                lng: 9.389043240669228,
            },
            southwest: {
                lat: 45.81308165132218,
                lng: 9.066736196984769,
            },
        },
    },
    {
        title: "Lake Lugano",
        subtitle: "Switzerland",
        image: "S3_URL/explore-lugano.jpg",
        location: {
            lat: 45.9862544,
            lng: 8.969988899999999,
        },
        viewport: {
            northeast: {
                lat: 46.03639972307457,
                lng: 9.125243774938575,
            },
            southwest: {
                lat: 45.90297244362,
                lng: 8.858641572063744,
            },
        },
    },
    {
        title: "Lake Maggiore",
        subtitle: "Italy",
        image: "S3_URL/explore-maggiore.jpg",
        location: {
            lat: 45.9676218,
            lng: 8.6532586,
        },
        viewport: {
            northeast: {
                lat: 46.17990895861853,
                lng: 8.866093523121503,
            },
            southwest: {
                lat: 45.72289542939718,
                lng: 8.4804889845547784,
            },
        },
    }
];

const qrCodeData = {
    title: "Scan Boat QR Code",
    subtitle: "Book directly a boat",
    image: "S3_URL/gradient-blue.png",
};

const PlaceListScreenComponent = (props) => {
    const {navigation, themedStyle} = props;
    const { t } = useTranslation();
    return (
        <List
            style={themedStyle.list}
            contentContainerStyle={themedStyle.listContent}
            data={exploreData}
            renderItem={({item, index}) => <PlaceCard
                item={item}
                index={index}
                {...props}
            />}
            ListHeaderComponent={<Text category='h6'>{t('Explore')}</Text>}
            ListFooterComponent={<PlaceCard
                item={qrCodeData}
                index={100}
                onPress={() => navigation.navigate("BarCodeScannerScreen")}
                {...props}
            />}
        />


    );
};

export const PlaceListScreen = withStyles(PlaceListScreenComponent, (theme) => {
    return ({
        container: {
            flex: 1,
        },
        list: {
            paddingVertical: 24,
        },
        listContent: {
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        searchBar: {
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        item: {
            marginVertical: 8,
        },
        itemHeader: {
            height: 220,
        },
        itemContent: {
            marginVertical: 8,
        },
        itemFooter: {
            flexDirection: 'row',
            marginHorizontal: -8,
        },
        iconButton: {
            paddingHorizontal: 0,
        },
        itemAuthoringContainer: {
            flex: 1,
            justifyContent: 'center',
            marginHorizontal: 16,
        },
        layout_top: {
            flex: 1,
            paddingBottom: 8,
        },
        layout_content: {
            flex: 9,
        },
        layout_middle: {
            flex: 6,
            padding: 16,
        },
        layout_bottom: {
            flex: 1,
            justifyContent: 'flex-end',
            //backgroundColor: theme['color-primary-100'],
            padding: 20,
            //backgroundColor: theme['color-primary-transparent-100'],
        },
        layout_bottom_view: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        layout_filter_view: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 8,
        },
        bottomButton: {
            bottom: 16,
            position: 'absolute',
            borderRadius: 30,
            height: 10,
            alignItems: 'center',
            justifyContent: 'center',
            shadowRadius: 100,
            backgroundColor: '#000000',
            borderColor: '#000000',
            shadowOpacity: 0.3,
            shadowOffset: {height: 10}
        },
        filterButton: {
            borderWidth: 0.5,
            width: "30%",
            borderRadius: 50,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowOpacity: 0.8,
            elevation: 6,
            shadowRadius: 5,
            shadowOffset: {width: 3, height: 3},
        },
    })
});