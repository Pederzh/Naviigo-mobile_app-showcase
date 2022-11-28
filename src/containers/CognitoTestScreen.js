import React from 'react';
import { StyleSheet, View, ImageBackground, ScrollView, AsyncStorage } from 'react-native';
import { ApplicationProvider, IconRegistry, Layout, Text, Input, Button, Icon, useTheme, withStyles } from '@ui-kitten/components';
import { LottieLoader } from '../components/common/LottieLoader'
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';
import { useDispatch, useSelector } from "react-redux";
import Amplify, { API, Auth } from 'aws-amplify';

import { CognitoUserPool } from 'amazon-cognito-identity-js';

import { POOL_DATA } from '../config/cognito.config';
import { CONFIG_DATA } from '../config/amplify.config';

// Amplify.configure(CONFIG_DATA);

const userPool = new CognitoUserPool(POOL_DATA);

const CognitoScreenComponent = (props) => {

    const authState = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = React.useState(false);

    const get_data_non_auth = async () => {
        console.log("get data function started");
        try {
            setIsLoading(true);
            const apiResponse = await API.get("prova_non_auth",'');
            setIsLoading(false);
            console.log(apiResponse);
        } catch (e) {
            setIsLoading(false);
            console.log("ERRORE");
            console.log(e);
        }    
    }
     
    const get_data = async () => {
        console.log("get data function started");
        try {
            setIsLoading(true);
            const apiResponse = await API.get("prova_auth",'');
            setIsLoading(false);
            console.log(apiResponse);
        } catch (e) {
            setIsLoading(false);
            console.log("ERRORE");
            console.log(e);
        }
    }

    return(
        
        <React.Fragment>
        {
            (!isLoading) ? (       
                <ImageBackground source={{uri: 'https://facebook.github.io/react/logo-og.png'}} style={{flex: 1}}>
                    
                    <Layout style={props.themedStyle.layout_top}>
                    <Text style={props.themedStyle.text} category='h1'>naviigo</Text>
                    <Text style={props.themedStyle.text} category='h5'>COGNITO TEST SCREEN</Text>
                    </Layout>
                    <Layout style={props.themedStyle.layout_middle}>
                    <Button style={props.themedStyle.button}
                        onPress={() => logout()}>
                        Logout
                    </Button>
                    <Button style={props.themedStyle.button}
                        onPress={() => get_data_non_auth()}>
                        Get data (non auth)
                    </Button>
                    <Button style={props.themedStyle.button}
                        onPress={() => get_data()}>
                        Get data
                    </Button>
                    <Button style={props.themedStyle.button}
                        onPress={() => get_item()}>
                        get item
                    </Button>
                    </Layout>
                </ImageBackground>
            ) : (
                <LottieLoader></LottieLoader>
            )
        }
        </React.Fragment>
    );
}


const get_item = async () => {
    console.log('Get token from Auth');
    console.log((await Auth.currentSession()).getIdToken().getJwtToken());

    console.log('Get user from Auth');
    console.log((await Auth.currentAuthenticatedUser()))
}


const logout = async () => {
    // using this function, tokens stored in local storage (by the sdk) about the user will be deleted (again by the sdk)
    console.log("Logout started");

    (await Auth.currentAuthenticatedUser()).signOut();
}

const send_data = () => {
    data = {
      firstParam: 'yourValue',
      secondParam: 'yourOtherValue',
    };
    
    getAuthenticatedUser().getSession((err, session) => {
      if (err) {
        // handle the error occurred while getting the session
        return;
      }
      // send the request to the API. Notice the token passed in the header.
      fetch('https://api_url_to_be_invoked/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.getIdToken().getJwtToken()
          },
          body: JSON.stringify(data)
        }
      ).then((result) => {
        // richieta post andata a buon fine
        console.log(result);
      }).catch((error) => {
        // richieta post fallita
        console.log(err);
      });
    });
  }

// custom method to retrieve the authenticated user
function getAuthenticatedUser() {
    console.log("getAuthenticatedUser started");

    return new Promise((resolve, reject) => {
        userPool.storage.sync((err, result) => {
            if (err) {
                alert(err.message || JSON.stringify(err));
            } else if (result === 'SUCCESS') {
                var cognitoUser = userPool.getCurrentUser();                
                if (!cognitoUser) {
                    reject();
                } 
                cognitoUser.getSession((err, session) => {
                    if (err || !session.isValid()) {
                        reject();
                    }
                    resolve(cognitoUser);
                });
            }
        });
    });
}
  
export const CognitoScreen = withStyles(CognitoScreenComponent, theme => ({
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
    flex: 5,
    justifyContent: 'flex-start', 
    alignItems: 'stretch',
    padding: 20,
    //backgroundColor: theme['color-primary-transparent-100'],
  },
  input: {
    margin: 5,
  },
  button: {
    margin: 5,
  },
  text: {
    color: theme['color-primary-100'],
    fontWeight: 'bold',
  },
  forgotPsw: {
    alignSelf: 'flex-end',
    margin: 10,
  },
  goRegister: {
    alignSelf: 'flex-end',
    margin: 10,
  }
}));

const FacebookIcon = (style) => (
    <Icon name='facebook-outline' {...style} />
  );
  
  const LockIcon = (style) => (
    <Icon name='lock-outline' {...style} />
  );
  
  const EmailIcon = (style) => (
    <Icon name='email-outline' {...style} />
  );
  
  // use <LoginButton /> to use the button with the fb icon
  const LoginButton = () => (
    <Button icon={FacebookIcon}>Login with Facebook</Button>
  );
  
