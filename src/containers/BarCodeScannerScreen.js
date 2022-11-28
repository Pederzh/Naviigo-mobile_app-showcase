import React, {useState, useEffect} from 'react';
import { View } from 'react-native';
import { ApplicationProvider, IconRegistry, Layout, Text, Button, Input, Icon, useTheme, withStyles } from '@ui-kitten/components';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {boatDataFromQRCode, sanitizeBoatId} from "../utils";
import {BOAT_ID_LENGTH_NO_PREFIX} from "../utils/constraints";
import {useTranslation} from "react-i18next";

const BarCodeScannerScreenComponent = (props) => {
    const { t } = useTranslation();
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const {navigation} = props;

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        //            alert(`Bar code with type ${type} and data ${data} has been scanned!`);

        // console.log(sanitizeBoatId(data))

        if(data.substring(0, data.lastIndexOf("/"))?.length !== BOAT_ID_LENGTH_NO_PREFIX){
            alert(t(`ERROR: QR code doesn't contain boat info!`));
            return;
        }

        navigation.navigate('BoatScreen', boatDataFromQRCode(data));
    };

    if (hasPermission === null) {
        return <Text>{t("Requesting for camera permissions")}</Text>;
    }
    if (hasPermission === false) {
        return <Text>{t("No access to camera")}</Text>;
    }

    return(
    // per far vedere l'immagine utilizzare lo sfondo trasparente nei layout
    <Layout style={{flex: 1}}>

        <Layout style={props.themedStyle.layout_top}>
            <Text style={props.themedStyle.text} category='h1'>{t("QR Code Scanner")}</Text>
            <Text style={props.themedStyle.text} category='h6'>{t("Scan the QR code to view the boat page")}</Text>
        </Layout>

        <Layout style={props.themedStyle.layout_middle}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
                    />

        </Layout>
        <Layout style={props.themedStyle.layout_bottom}>
            {scanned && (<Button onPress={() => setScanned(false)}> {t("Tap to scan again")}</Button>)}
        </Layout>
    </Layout>
    );
};

export const BarCodeScannerScreen = withStyles(BarCodeScannerScreenComponent, theme => ({
    // alignItems -> sinistra, centro o destra
    // justifyContent -> alto, centro o basso
    layout_top: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme['color-primary-500'],
        padding: 20,
        //backgroundColor: theme['color-primary-transparent-100'],
    },
    layout_middle: {
        flex: 6,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme['color-primary-100'],
        padding: 20,
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
}));

