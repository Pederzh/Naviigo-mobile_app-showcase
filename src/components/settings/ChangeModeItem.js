import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon, Text, withStyles} from "@ui-kitten/components";
import {Auth} from 'aws-amplify';
import {changeMode, logIn} from "../../actions/AuthActions";
import {useDispatch, useSelector} from "react-redux";
import Toast from "react-native-toast-message";
import {useTranslation} from "react-i18next";

const ChangeModeItemComponent = (props) => {
    const {themedStyle} = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const ChangeIcon = (style) => (
        <Icon {...style} name='shuffle-2' width={26} height={26} fill='#C5CEE0'/>
    );

    return(
        <TouchableOpacity
            onPress={() => {
                    dispatch(changeMode());
                    Toast.show({
                        text1: t('Mode switched'),
                        text2: `${t('You have switched the app mode to')}: ${!authState.modeHost ? t("Renter") : t("Tourist")}`
                    });
                }
            }
        >
            <View style={themedStyle.row}>
                <Text>
                    {`${t('Change mode to')}: ${!authState.modeHost ? t("Renter") : t("Tourist")}`}
                </Text>
                <ChangeIcon {...props}/>
            </View>
        </TouchableOpacity>
    );
};

export const ChangeModeItem = withStyles(ChangeModeItemComponent, (theme) => {

    return ({
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: theme['border-basic-color-3'],
            paddingHorizontal: 20,
            paddingVertical: 15,
            height: 75,
        },
    });
});