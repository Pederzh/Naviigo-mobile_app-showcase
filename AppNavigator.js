import React from 'react';
import {AsyncStorage, SafeAreaView, StatusBar, KeyboardAvoidingView} from 'react-native';
import {ApplicationProvider, BottomNavigation, BottomNavigationTab, Icon, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {mapping} from '@eva-design/eva';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// screens
import {LoginScreen} from './src/containers/LoginScreen';
import {RegisterScreen} from './src/containers/RegisterScreen';
import {ConfirmScreen} from './src/containers/ConfirmRegistrationScreen';
import {ForgotPasswordScreen} from './src/containers/ForgotPasswordScreen';
import {ResetPasswordScreen} from './src/containers/ResetPasswordScreen';
import {BoatFormScreen} from './src/containers/formScreens/BoatFormScreen';
import {useDispatch, useSelector} from "react-redux";
import {setDark, setLight} from './src/actions/ThemeActions';
import {LottieLoader} from './src/components/common/LottieLoader';

import {ProfileScreenStyled} from './src/containers/ProfileScreen';
import {SettingsScreenStyled} from './src/containers/SettingsScreen';
import {BookingDetailsScreen} from './src/containers/BookingDetailsScreen';
import {PaymentScreen} from './src/containers/PaymentScreen';
import {ManageBoatsScreen} from './src/containers/ManageBoatsScreen';
import {ManageBookingScreen} from './src/containers/ManageBookingScreen';

import {BoatScreen} from './src/containers/BoatScreen'
import {BoatScreenDualViz} from './src/containers/BoatScreenDualViz'
import LocationSearchScreen from "./src/containers/searchScreens/locationSearchScreen";
import {PeopleSearchScreen} from "./src/containers/searchScreens/peopleSearchScreen";
import {DateSearchScreen} from "./src/containers/searchScreens/dateSearchScreen";
import {CalendarScreen} from "./src/containers/CalendarScreen";
import {ExploreScreen} from "./src/containers/ExploreScreen";
import {BarCodeScannerScreen} from "./src/containers/BarCodeScannerScreen";
import {HostFormScreen} from "./src/containers/formScreens/HostFormScreen";
import {MapScreen} from "./src/containers/MapScreen";
import {BookingConfirmationScreen} from "./src/containers/BookingConfirmationScreen";
import {BookingFailedScreen} from "./src/containers/BookingFailedScreen";
import {DiscoverScreen} from "./src/containers/discoverScreens/DiscoverScreen";
import {BlockPeriodScreen} from "./src/containers/BlockPeriodScreen";
import {FlatlistCarousel} from "./src/containers/FlatlistCarousel"
import Toast from "react-native-toast-message";
import {WeatherText} from "./src/components/weather/WeatherText";
import {ChartScreen} from "./src/containers/ChartScreen";
import {useTranslation} from "react-i18next";


//Amplify.Logger.LOG_LEVEL = 'DEBUG';

const AppNavigator = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const themeState = useSelector((state) => state.theme);

    // handle the saved preferences of the user theme
    handleTheme(themeState.name, dispatch);

    console.log(authState.isComplete);

    return (
        // this should return only one element. React.Fragment allow you to wrap all in only one tag
        <React.Fragment>

            <IconRegistry icons={EvaIconsPack}/>
            <ApplicationProvider mapping={mapping} theme={themeState.theme}>
                <StatusBar barStyle={(themeState.name === 'dark') ? "light-content" : "dark-content"} />
                <SafeAreaView style={{flex: 0, backgroundColor: (themeState.name === 'dark') ? '#222B45' : '#FFFFFF'}}/>
                <SafeAreaView style={{flex: 1, backgroundColor: (themeState.name === 'dark') ? '#222B45' : '#FFFFFF'}}>
                <NavigationContainer>
                    {
                        (authState.isLoading || authState.isLoggingIn) ? (
                            <LottieLoader/>
                        ) : (authState.isLoggedIn && !authState.modeHost) ? (
                            <AppNavigatorUser/>
                        ) : (authState.isLoggedIn && authState.modeHost && authState.isComplete) ? (
                            <AppNavigatorHost/>
                        ) : (authState.isLoggedIn && authState.isHost && !authState.isComplete) ? (
                            <HostFormNavigator/>
                        ) : (
                            <AuthNavigator/>
                        )
                    }
                </NavigationContainer>
            </SafeAreaView>
            </ApplicationProvider>
                {/* Render Toast inside react-navigation: https://github.com/calintamas/react-native-toast-message#how-to-render-the-toast-when-using-react-navigation*/}
                <Toast ref={(ref) => Toast.setRef(ref)}
                       topOffset={50}
                       visibilityTime={3000}
                />

        </React.Fragment>
    );
};

export default AppNavigator;

const handleTheme = async (currentTheme, dispatch) => {
    const selectedTheme = await AsyncStorage.getItem('themeName');
    if (currentTheme === selectedTheme) {
        return;
    }
    switch (selectedTheme) {
        case 'light':
            dispatch(setLight());
        case 'dark':
            dispatch(setDark());
    }
};

// navigator shown in case of user not authenticated
const AuthNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="Intro" component={FlatlistCarousel}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="Confirm registration" component={ConfirmScreen}/>
            <Stack.Screen name="Forgot password" component={ForgotPasswordScreen}/>
            <Stack.Screen name="Reset password" component={ResetPasswordScreen}/>
        </Stack.Navigator>
    );
};

// navigator shown in case of user not authenticated
const HostFormNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="HostFormScreen" component={HostFormScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="Confirm registration" component={ConfirmScreen}/>
            <Stack.Screen name="Forgot password" component={ForgotPasswordScreen}/>
            <Stack.Screen name="Reset password" component={ResetPasswordScreen}/>
        </Stack.Navigator>
    );
};


// navigators shown in case of authenticated host or user
const BottomTab = createBottomTabNavigator();
const AppNavigatorHost = () => (
    <BottomTab.Navigator tabBar={props => <BottomTabBar {...props} />}>
        <BottomTab.Screen name="Explore" component={RootExploreStack}/>
        <BottomTab.Screen name="Booking list" component={BookingListStack}/>
        <BottomTab.Screen name="Manage" component={ManageStack}/>
        <BottomTab.Screen name="Profile" component={ProfileSettingsStack}/>
    </BottomTab.Navigator>
);
const AppNavigatorUser = () => (
    <BottomTab.Navigator tabBar={props => <BottomTabBar {...props} />}>
        <BottomTab.Screen name="Explore" component={RootExploreStack}/>
        <BottomTab.Screen name="Booking list" component={BookingListStack}/>
        <BottomTab.Screen name="Discover" component={DiscoverStack}/>
        <BottomTab.Screen name="Profile" component={ProfileSettingsStack}/>
    </BottomTab.Navigator>
);

const BottomTabBar = ({navigation, state}) => {
    const { t } = useTranslation();
    const authState = useSelector((state) => state.auth);
    const ExploreIcon = (style) => (
        <Icon {...style} name='search-outline'/>
    );
    const BookingsIcon = (style) => (
        <Icon {...style} name='calendar-outline'/>
    );
    const ManageIcon = (style) => (
        <Icon {...style} name='grid-outline'/>
    );
    const DiscoverIcon = (style) => (
        <Icon {...style} name='pin-outline'/>
    );
    const ProfileIcon = (style) => (
        <Icon {...style} name='person-outline'/>
    );

    const onSelect = (index) => {
        navigation.navigate(state.routeNames[index]);
    };

    return (
        <SafeAreaView>
            <BottomNavigation selectedIndex={state.index} onSelect={onSelect}>
                <BottomNavigationTab title={t('Explore')} icon={ExploreIcon}/>
                <BottomNavigationTab title={t('Bookings')} icon={BookingsIcon}/>
                {(authState?.isLoggedIn && authState?.modeHost) ?
                    <BottomNavigationTab title={t('Manage')} icon={ManageIcon}/>
                    : <BottomNavigationTab title={t('Discover')} icon={DiscoverIcon}/>
                }
                <BottomNavigationTab title={t('Profile')} icon={ProfileIcon}/>
            </BottomNavigation>
        </SafeAreaView>
    );
};


const BookingListStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="BookingList" component={CalendarScreen}/>
            <Stack.Screen name="BlockPeriod" component={BlockPeriodScreen}/>
            <Stack.Screen name="ChartScreen" component={ChartScreen}/>
            <Stack.Screen name="ManageBooking" component={ManageBookingScreen}/>
        </Stack.Navigator>
    );
};

const DiscoverStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="Discover" component={DiscoverScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

const ManageStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="ManageBoatsScreen" component={ManageBoatsScreen}/>
            <Stack.Screen name="BoatScreen" component={BoatScreen}/>
            <Stack.Screen name="BoatAddEditScreen" component={BoatFormScreen}/>
        </Stack.Navigator>
    );
};

const ProfileSettingsStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="SettingsScreen" component={SettingsScreenStyled}/>
            <Stack.Screen name="HostFormScreen" component={HostFormScreen}/>
            <Stack.Screen name="ProfileScreen" component={ProfileScreenStyled}/>
            <Stack.Screen name="BarCodeScannerScreen" component={BarCodeScannerScreen}/>
            <Stack.Screen name="DiscoverScreen" component={DiscoverScreen}/>
            <Stack.Screen name="BoatScreen" component={BoatScreen}/>
            <Stack.Screen name="Weather" component={WeatherText}/>
            {/* <Stack.Screen name="Cognito" component={CognitoScreen} /> */}

        </Stack.Navigator>
    );
};


const LocationSearchStack = ({navigation, routes}) => {
    const LocationSearchStack = createStackNavigator();
    return (
        <LocationSearchStack.Navigator mode="modal">
            <LocationSearchStack.Screen name="LocationSearchModalScreen" component={LocationSearchScreen} options={{headerShown: false}}/>
        </LocationSearchStack.Navigator>
    );
};

const DateSearchStack = ({navigation, routes}) => {
    const DateSearchStack = createStackNavigator();
    return (
        <DateSearchStack.Navigator mode="modal">
            <DateSearchStack.Screen name="DateSearchModalScreen" component={DateSearchScreen} options={{headerShown: false}}/>
        </DateSearchStack.Navigator>
    );
};

const PeopleSearchStack = ({navigation, routes}) => {
    const PeopleSearchStack = createStackNavigator();
    return (
        <PeopleSearchStack.Navigator mode="modal">
            <PeopleSearchStack.Screen name="PeopleSearchModalScreen" component={PeopleSearchScreen} options={{headerShown: false}}/>
        </PeopleSearchStack.Navigator>
    );
};

const ExploreStack = ({navigation, routes}) => {
    const ExploreStack = createStackNavigator();
    return (
        <ExploreStack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: "horizontal",
            }}
        >
            <ExploreStack.Screen name="ExploreScreen" component={ExploreScreen}/>
            <ExploreStack.Screen name="MapScreen" component={MapScreen}/>
            <ExploreStack.Screen name="BoatScreen" component={BoatScreen}/>
            <ExploreStack.Screen name="BoatScreenDualViz" component={BoatScreenDualViz}/>
            <ExploreStack.Screen name="BookingDetailsScreen" component={BookingDetailsScreen}/>
            <ExploreStack.Screen name="PaymentScreen" component={PaymentScreen}/>
            <ExploreStack.Screen name="BookingConfirmationScreen" component={BookingConfirmationScreen}/>
            <ExploreStack.Screen name="BookingFailedScreen" component={BookingFailedScreen}/>
            <ExploreStack.Screen name="LocationSearchModalScreen" component={LocationSearchScreen}/>
            <ExploreStack.Screen name="DateSearchModalScreen" component={DateSearchScreen}/>
            <ExploreStack.Screen name="PeopleSearchModalScreen" component={PeopleSearchScreen}/>
            <ExploreStack.Screen name="BarCodeScannerScreen" component={BarCodeScannerScreen}/>
        </ExploreStack.Navigator>
    )
};

const RootExploreStack = ({navigation, routes}) => {
    const RootExploreStack = createStackNavigator();
    return (
        <RootExploreStack.Navigator mode="modal">
            <RootExploreStack.Screen
                name="Explore"
                component={ExploreStack}
                options={{headerShown: false}}
            />
            <RootExploreStack.Screen
                name="LocationSearchScreen"
                component={LocationSearchStack}
                options={{headerShown: false}}
            />
            <RootExploreStack.Screen
                name="DateSearchScreen"
                component={DateSearchStack}
                options={{headerShown: false}}
            />
            <RootExploreStack.Screen
                name="PeopleSearchScreen"
                component={PeopleSearchStack}
                options={{headerShown: false}}
            />
        </RootExploreStack.Navigator>
    );
};

