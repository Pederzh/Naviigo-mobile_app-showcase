import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Button, Input, Layout, Text, withStyles} from '@ui-kitten/components';
import {LottieImage} from "../../components/common/LottieImage";
import {Controller, useForm} from "react-hook-form";
import {Divider} from "../../components/common/Divider";
import {ImagePickerButton} from "../../components/forms/ImagePickerButton";
import {OpeningTimes} from "../../components/OpeningTimes";
import {ISO_WEEKDAYS, S3_FOLDER_USER} from "../../utils/constraints";
import {RHFRadio} from "../../components/forms/RHFRadio";
import {RHFSelect} from "../../components/forms/RHFSelect";
import {LocationInput} from "../../components/forms/LocationInput";
import {CognitoUserAttribute} from 'amazon-cognito-identity-js';
import {logOut} from "../../actions/AuthActions";
import {useDispatch, useSelector} from "react-redux";
import Amplify, {Auth} from 'aws-amplify';
import {CONFIG_DATA} from '../../config/amplify.config';
import {useTranslation} from "react-i18next";

Amplify.configure(CONFIG_DATA);
const AuthContext = React.createContext();

const Step1 = ({control, errors, themedStyle}) => {
    const { t } = useTranslation();
    return (
        <View>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <Input
                        label={t("Company name")}
                        placeholder={t("Add your company name")}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                    />
                )}
                name="companyName"
                rules={{required: true}}
                defaultValue=""
            />
            {errors.companyName && <Text>{t('This is required')}</Text>}
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <Input
                        label={t("Phone number")}
                        placeholder={t("Phone number")}
                        textContentType='telephoneNumber'
                        keyboardType='phone-pad'
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                    />
                )}
                name="phoneNumber"
                rules={{required: true}}
                defaultValue=""
            />
            {errors.phoneNumber && <Text>{t('This is required')}</Text>}
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <Input
                        label={t("Description")}
                        placeholder={t("Add company description")}
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
        </View>
    );
};

const Step2 = ({control, errors, themedStyle}) => {
    const { t } = useTranslation();
    return (
        <View style={{flex: 1}}>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <OpeningTimes
                        value={value}
                        onChange={value => onChange(value)}
                    />
                )}
                name="openingTimes"
                rules={{required: true}}
                defaultValue={ISO_WEEKDAYS} //by default all days are selected
            />
            {errors.openingTimes && <Text>{t('This is required')}</Text>}
        </View>
    );
};

const Step3 = ({control, errors, themedStyle}) => {
    const { t } = useTranslation();
    const instantBookingOptions = [
        {value: true, text: t('Allow instant bookings from customers')},
        {value: false, text: t('Accept or deny each booking request')},
    ];
    const availabilityWindows = [
        {value: 'All', text: t('All future dates')},
        {value: '12', text: `12 ${t("months in advance")}`},
        {value: '6', text: `6 ${t("months in advance")}`},
        {value: '3', text: `3 ${t("months in advance")}`},
        {value: '1', text: `1 ${t("months in advance")}`},
    ];
    return (
        <View>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <RHFRadio
                        label={t("Booking Preferences")}
                        data={instantBookingOptions}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
                name="instantBooking"
                rules={{required: true}}
                defaultValue={null}
            />
            {errors.instantBooking && <Text>{t('This is required')}</Text>}
            <Divider/>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <RHFSelect
                        label={t("Availability window")}
                        data={availabilityWindows}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
                name="availabilityWindow"
                rules={{required: true}}
                defaultValue={null}
            />
            {errors.availabilityWindow && <Text>{t('This is required')}</Text>}
        </View>
    );
};
const Step4 = ({control, errors, themedStyle}) => {
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
                name="location"
                rules={{required: true}}
                defaultValue={null}
            />
            {errors.location && <Text>{t('This is required')}</Text>}
        </View>
    );
};
const Step5 = ({authState, control, errors, themedStyle}) => {
    return (
        <View style={{alignItems: 'center'}}>
            <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                    <ImagePickerButton
                        folderName={S3_FOLDER_USER}
                        fileName={authState?.id}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
                name="images"
                rules={{required: true}}
                defaultValue={null}
            />
        </View>
    );
};
const Step6 = ({authState, control, errors, themedStyle}) => {
    return (
        <View style={{alignItems: 'center'}}>
        </View>
    );
};


const HostFormScreenComponent = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const {register, setValue, handleSubmit, control, reset, errors} = useForm({
        shouldUnregister: false
    });
    const onSubmit = data => {


        // TODO: check if the data insertion is successfull
        // only after that you can update the user attribute "isComplete"
        const updateIsComplete = true;

        if (updateIsComplete) {
            // Here we update the cognitoUser attribute "isComplete"
            let attrList = [];
            let dataIsComplete = {
                Name: 'custom:isComplete',
                Value: '1',
            };

            let isCompleteAttribute = new CognitoUserAttribute(dataIsComplete);
            attrList.push(isCompleteAttribute);

            Auth.currentAuthenticatedUser().then(
                (user) => {
                    user.updateAttributes(attrList, function (err, result) {
                        if (err) {
                            alert(t("Uh oh - Something went wrong!") + "" + err.message);
                            console.log(err);
                            return;
                        }
                        alert(t("Your account is now ready! Please log in again"));
                        dispatch(logOut());
                    });
                },
                (error) => {
                    console.log(error);
                    dispatch(logOut());
                }
            );
        } else {
            alert("Your data was not saved properly. Please try again!");
        }
    };

    const onChange = arg => {
        return {
            value: arg.nativeEvent.text,
        };
    };

    const allSteps = [
        {key: 0, name: "Add your information", heading: 'form-add-info', component: Step1},
        {key: 1, name: "Opening times", heading: 'form-add-settings', component: Step2},
        {key: 2, name: "Reservation Preferences", heading: 'form-add-settings', component: Step3},
        {key: 3, name: "Add location", heading: 'form-set-map', component: Step4},
        {key: 4, name: "Add image", heading: 'form-add-image', component: Step5},
        {key: 5, name: "Confirmed", heading: 'success-status', component: Step6}
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

        if(stepIndex === 0){
            props.navigation.navigate("Login");
        }
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
                        authState={authState}
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

export const HostFormScreen = withStyles(HostFormScreenComponent, (theme) => {
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
