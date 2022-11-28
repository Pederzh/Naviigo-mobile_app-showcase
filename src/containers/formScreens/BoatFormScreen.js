import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {Button, Icon, Input, Layout, Select, Text, TopNavigation, withStyles} from '@ui-kitten/components';
import {LottieLoader} from "../../components/common/LottieLoader";
import {API} from 'aws-amplify';
import {useDispatch, useSelector} from "react-redux";
import {Controller, useForm} from "react-hook-form";
import {LottieImage} from "../../components/common/LottieImage";
import {LocationInput} from "../../components/forms/LocationInput";
import {ImagePickerButton} from "../../components/forms/ImagePickerButton";
import {RHFRadio} from "../../components/forms/RHFRadio";
import {Divider} from "../../components/common/Divider";
import {RHFSelect} from "../../components/forms/RHFSelect";
import {MultiplePriceTimePicker} from "../../components/forms/MultiplePriceTimePicker";
import Toast from "react-native-toast-message";
import {S3_FOLDER_BOAT} from "../../utils/constraints";
import {makeFilename} from "../../utils";
import {useTranslation} from "react-i18next";

const Step1 = ({control, errors, themedStyle}) => {
    const { t } = useTranslation();

    const categoryOptions = [
        {value: "MOTORBOAT", text: t('Motorboat')},
        {value: "SAILBOAT", text: t('Sailboat')},
/*        TODO ADD:
        {value: "YACHT", text: 'Yacht'},
        {value: "MOTOR_YACHT", text: 'Motor Yacht'},
        {value: "SAILING_YACHT", text: 'Sailing Yacht'},
        {value: "RIB", text: 'RIB (Rigid inflatable boat)'},
        {value: "HOUSEBOAT", text: 'Houseboat'},
        {value: "CATAMARAN", text: 'Catamaran'},
        {value: "JET_SKI", text: 'Jet Ski'},*/
    ];
    return (
        <ScrollView>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <Input
                        label={t("Boat name")}
                        placeholder={t('Add the boat name')}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                    />
                )}
                name="name"
                rules={{required: true}}
                defaultValue=""
            />
            {errors.name && <Text>{t('This is required')}</Text>}
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <Input
                        label={t("Description")}
                        placeholder={t("Add boat description")}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        multiline
                        numberOfLines={4}
                        textStyle={{minHeight: 64}}
                    />
                )}
                name="description"
                rules={{required: true}}
                defaultValue=""
            />
            {errors.description && <Text>{t('This is required')}</Text>}
            <Divider/>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <RHFSelect
                        label={t("Category")}
                        data={categoryOptions}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
                name="category"
                rules={{required: true}}
                defaultValue={null}
            />
            {errors.category && <Text>{t('This is required')}</Text>}
            <Divider/>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <Input
                        label={t("Manufacturer")}
                        placeholder={t("Add the boat manufacturer")}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                    />
                )}
                name="manufacturer"
                rules={{required: true}}
                defaultValue=""
            />
            {errors.manufacturer && <Text>{t('This is required')}</Text>}
        </ScrollView>
    );
};

const Step2 = ({control, errors, themedStyle}) => {
    const { t } = useTranslation();
    const drivingModeOptions = [
        {value: "WITHOUT_LICENSE", text: t('Free (no license)')},
        {value: "WITH_LICENSE", text: t('With license')},
        {value: "WITH_DRIVER", text: t('With driver')},
    ];
    return (
        <ScrollView>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <Input
                        label={t("Max people capacity")}
                        placeholder={t('Add the boat max people capacity')}
                        keyboardType='numeric'
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                    />
                )}
                name="maxCapacity"
                rules={{required: true}}
                defaultValue={null}
            />
            {errors.maxCapacity && <Text>{t('This is required')}</Text>}
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <Input
                        label={t("Length (in meters)")}
                        placeholder={t('Add the boat length')}
                        keyboardType='numeric'
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                    />
                )}
                name="length"
                rules={{required: true}}
                defaultValue={null}
            />
            {errors.length && <Text>{t('This is required')}</Text>}
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <Input
                        label={t("Horsepower")}
                        placeholder={t('Add the boat horsepower')}
                        keyboardType='numeric'
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                    />
                )}
                name="hp"
                rules={{required: true}}
                defaultValue={null}
            />
            {errors.hp && <Text>{t('This is required')}</Text>}
            <Divider/>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <RHFRadio
                        label={t("Driving mode options")}
                        data={drivingModeOptions}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
                name="drivingMode"
                rules={{required: true}}
                defaultValue={null}
            />
            {errors.drivingMode && <Text>{t('This is required')}</Text>}

        </ScrollView>
    );
};

const Step3 = ({control, errors, themedStyle}) => {
    const { t } = useTranslation();
    return (
        <ScrollView style={{flex: 1}}>
            <Controller
                control={control}
                render={({onChange, value}) => (
                    <MultiplePriceTimePicker
                        value={value}
                        onChange={onChange}
                    />
                )}
                name="price"
                rules={{required: true}}
                defaultValue={null}
            />
            {errors.price && <Text>{t('This is required')}</Text>}
        </ScrollView>
    );
};

const Step4 = ({control, errors, themedStyle}) => {
    const { t } = useTranslation();
    return (
        <View style={{flex: 1}}>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <LocationInput
                        showGPSLocation={false}
                        selectedOption={value?.location?.city}
                        onSelect={onChange}
                    />
                )}
                name="googleLocation"
                rules={{required: true}}
                defaultValue={null}
            />
            {errors.googleLocation && <Text>{t('This is required')}</Text>}
        </View>
    );
};

const Step5 = ({control, errors, themedStyle}) => {
    const { t } = useTranslation();
    return (
        <View style={{alignItems: 'center'}}>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <ImagePickerButton
                        folderName={S3_FOLDER_BOAT}
                        fileName={makeFilename()}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
                name="images"
                rules={{required: true}}
                defaultValue={null}
            />
            {errors.location && <Text>{t('This is required')}</Text>}
        </View>
    );
};


const BoatFormScreenComponent = (props) => {
    const { t } = useTranslation();
    const authState = useSelector((state) => state.auth);

    const {register, setValue, handleSubmit, control, reset, errors} = useForm({
        shouldUnregister: false
    });

    const onSubmit = data => {
        if(authState?.id == null || !authState?.isHost){
            Toast.show({
                text1: t("You are not allowed"),
                text2: t("If you are an host please contact us"),
                type: "error"
            });
            return;
        }

        //add location and address
        data.location = [data?.googleLocation?.data?.result?.geometry?.location.lat, data?.googleLocation?.data?.result?.geometry?.location.lng];
        data.formatted_address = data?.googleLocation?.data?.result?.formatted_address;
        delete data["googleLocation"];


        //add userId
        data.hostUsername = authState.id;

        //parse to int
        data.length = parseInt(data?.length);
        data.hp = parseInt(data?.hp);
        data.maxCapacity = parseInt(data?.maxCapacity);

        let params = {
            body: data
        };

        API.post("naviigo_api", `/boats`, params)
            .then(
                () => Toast.show({
                    text1: t("Boat added successfully"),
                    text2: t("You can see the new added boat on the manage page")
                })
            )
            .catch(error => {
                Toast.show({
                    text1: t('Something went wrong`'),
                    text2: `${t('Error')}: ${error.message}`,
                    type: "error"
                })
            });

    };

    const allSteps = [
        {key: 0, name: "Boat information", heading: 'form-add-info', component: Step1},
        {key: 1, name: "Detailed boat information", heading: 'form-add-settings', component: Step2},
        {key: 2, name: "Pricing information", heading: 'form-add-settings', component: Step3},
        {key: 3, name: "Add location", heading: 'form-set-map', component: Step4},
        {key: 4, name: "Add images", heading: 'form-add-image', component: Step5}
    ];
    const {themedStyle} = props;
    const [stepIndex, setStepIndex] = useState(0);
    const Step = allSteps[stepIndex].component;

    const onNext = () => {
        if (stepIndex !== allSteps.length - 1) {
            setStepIndex(stepIndex + 1)
        }
    };

    const onBack = () => {
        stepIndex !== 0 && setStepIndex(stepIndex - 1);
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <Layout style={themedStyle.container}>
                <Layout style={themedStyle.layout_top}>
                    <View style={themedStyle.iconContainer}>
                        <LottieImage type={allSteps[stepIndex]?.heading}/>
                    </View>
                    <View style={themedStyle.titleSection}>
                        <Text category='h5'>
                            {t(allSteps[stepIndex]?.name)}
                        </Text>
                    </View>
                </Layout>
                <Layout style={themedStyle.layout_content}>
                    <Step
                        control={control}
                        errors={errors}
                        themedStyle={themedStyle}
                    />
                </Layout>
                <Layout style={themedStyle.layout_bottom}>
                    <View style={themedStyle.layout_bottom_view}>
                        <Button
                            appearance='ghost' status='basic'
                            size='giant'
                            onPress={() => onBack()}
                        >
                            {t("Back")}
                        </Button>
                        <Button
                            style={themedStyle.buttonNext}
                            size='giant'
                            onPress={(stepIndex !== allSteps.length - 1) ? () => onNext() : handleSubmit(onSubmit)}
                        >
                            {(stepIndex !== allSteps.length - 1) ? t("Next") : t("Save")}
                        </Button>
                    </View>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};

export const BoatFormScreen = withStyles(BoatFormScreenComponent, theme => {
    return ({
        container: {
            //backgroundColor: "white",
            height: "100%",
        },
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
        iconContainer: {
            flex: 10,
            //width: 300,
            backgroundColor: '#fff',
            alignItems: 'center',
        },
        list: {
            height: "100%"
        },
        listContent: {
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        searchBar: {
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        itemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        titleSection: {
            marginHorizontal: 12,
            marginVertical: 24,
            flex: 3,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 0.5,
            paddingVertical: 28,
            paddingHorizontal: 16,
        },
        layout_top: {
            flex: 3,
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        layout_content: {
            flex: 6,
            padding: 20,
        },
        layout_bottom: {
            flex: 1,
            justifyContent: 'flex-end',
            //backgroundColor: theme['color-primary-100'],
            padding: 20,
            //backgroundColor: theme['color-primary-transparent-100'],
        },
        layout_bottom_view: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        buttonNext: {
            width: "35%",
            borderRadius: 30
        }
    });
});
