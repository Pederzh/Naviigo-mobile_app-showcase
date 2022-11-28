import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Layout, Text, withStyles} from "@ui-kitten/components";
import {CategoryItem} from "./CategoryItem";
import {capitalizeFirstLetter, sanitizeUsername} from "../../utils";
import {useTranslation} from "react-i18next";

const HostInfoSectionComponent = (props) => {
    const { t } = useTranslation();
    const {themedStyle} = props;
    return (
        <React.Fragment>
            {
                (props?.position === 'right') ? (
                    <Layout level='1'>
                        <View style={themedStyle.commentHeaderRight}>
                            <View style={themedStyle.commentAuthorContainerRight}>
                                <Text category='s2'>
                                    {capitalizeFirstLetter(sanitizeUsername(props.name))}
                                </Text>
                                {
                                    (props.type) &&
                                    <CategoryItem
                                        appearance={'outline'}
                                    >
                                        {props.type}
                                    </CategoryItem>
                                }
                            </View>
                            <Avatar
                                style={{marginTop: 4}}
                                size='large'
                                source={{uri: `S3_URL/public/users/${sanitizeUsername(props?.name)}.jpg`}}
                            />
                        </View>
                    </Layout>
                ) : (
                    <Layout level='1'>
                        <View style={themedStyle.commentHeader}>
                            <Avatar
                                style={{marginTop: 4}}
                                size='large'
                                source={{uri: `S3_URL/public/users/${sanitizeUsername(props?.name)}.jpg`}}
                            />
                            <View style={themedStyle.commentAuthorContainer}>
                                <Text category='s2'>
                                    {capitalizeFirstLetter(sanitizeUsername(props.name))}
                                </Text>
                                {
                                    (props.type) &&
                                    <CategoryItem
                                        appearance={'outline'}
                                    >
                                        {t(props.type)}
                                    </CategoryItem>
                                }
                            </View>

                        </View>
                    </Layout>
                )
            }
        </React.Fragment>
    );
};

export const HostInfoSection = withStyles(HostInfoSectionComponent, (theme) => {

    return ({
        commentHeaderRight: {
            marginVertical: 8,
            justifyContent: 'flex-end',
            flexDirection: 'row',
        },
        commentAuthorContainerRight: {
            marginHorizontal: 16,
            alignItems: 'flex-end',
        },
        commentHeader: {
            marginVertical: 8,
            flexDirection: 'row',
        },
        commentAuthorContainer: {
            marginHorizontal: 16,
        },
    });
});

const style = StyleSheet.create({});