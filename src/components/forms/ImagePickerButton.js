import React, {useEffect, useState} from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Button, Icon, Text, withStyles} from '@ui-kitten/components';
import Amplify, {Auth, Storage} from 'aws-amplify';
import {CONFIG_DATA} from "../../config/amplify.config";
import {useTranslation} from "react-i18next";
Amplify.configure(CONFIG_DATA);

const ImagePickerButtonComponent = (props) => {
    const { t } = useTranslation();
    const [image, setImage] = useState(null);
    const [percentage, setPercentage] = useState(0);
    const {folderName, fileName, value, onChange, themedStyle} = props;
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert(t('Sorry, we need camera roll permissions to make this work!'));
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            handleImagePicked(result);
            //setImage(result.uri);
        }
    };

    const handleImagePicked = async (pickerResult) => {
        try {
            if (pickerResult.cancelled) {
                alert(t('Upload cancelled'));
                return;
            } else {
                setPercentage(0);
                const img = await fetchImageFromUri(pickerResult.uri);
                const uploadUrl = await uploadImage(`${folderName}/${fileName}.jpg`, img);
                downloadImage(uploadUrl);
            }
        } catch (e) {
            console.log(e);
            alert(t('Upload failed'));
        }
    };

    const uploadImage = (filename, img) => {
        Auth.currentCredentials();
        return Storage.put(filename, img, {
            level: 'public',
            contentType: 'image/jpeg',
            progressCallback(progress) {
                setLoading(progress);
            },
        })
            .then((response) => {
                return response.key;
            })
            .catch((error) => {
                console.log(error);
                return error.response;
            });
    };

    const setLoading = (progress) => {
        const calculated = parseInt((progress.loaded / progress.total) * 100);
        updatePercentage(calculated); // due to s3 put function scoped
    };

    const updatePercentage = (number) => {
        setPercentage(number);
    };

    const downloadImage = (uri) => {
        Storage.get(uri)
            .then((result) => {
                setImage(result);
                //TODO IN FUTURE: CHANGE WITH ONLY URI AND USE STORATE.GET WHEN LOAD IMAGES
                onChange([
                    {
                        alt: "not loaded",
                        title: "image1",
                        path: `S3_URL/public/${uri}`
                    }
                ]);
            })
            .catch((err) => console.log(err));
    };

    const fetchImageFromUri = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };

    return (
        <View>
            {
                image &&
                <View style={{alignItems: 'center'}}>
                    <Text category='label'>{t("Selected Picture")}</Text>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            source={{uri: image}}
                               style={{width: 300, height: 200, borderRadius: 8, marginVertical: 8,}}
                        />
                    </View>
                </View>
            }
            <View style={{alignItems: 'center'}}>
            {percentage !== 0 && <Text style={themedStyle.percentage} category='label'>{percentage}%</Text>}
            </View>
            <Button
                status='primary'
                style={themedStyle.buttonAction}
                icon={() => <Icon fill='white' name='image-outline'/>}
                onPress={pickImage}
            >
                {t("Pick a picture")}
            </Button>
        </View>
    );
};

export const ImagePickerButton = withStyles(ImagePickerButtonComponent, (theme) => {

    return ({
        buttonAction: {
            flexDirection: 'row',
            marginHorizontal: 4,
            borderWidth: 0.5,
            borderRadius: 10,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowOpacity: 0.8,
            elevation: 6,
            shadowRadius: 5,
            width: 300,
            shadowOffset: {width: 3, height: 3},
        },
        imageRow: {
            alignItems: 'center',
            marginHorizontal: 10,
        },
        percentage: {
            marginBottom: 10,
        },
    });
});

const style = StyleSheet.create({});