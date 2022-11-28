import Amplify, { API, Auth, Analytics } from 'aws-amplify';
import {POOL_DATA} from "./cognito.config";
//Amplify.Logger.LOG_LEVEL = 'DEBUG';


export const CONFIG_DATA = {
    Auth: {
        // Amazon Cognito Identity Pool ID (find in Federated Identities)
        identityPoolId: "HIDDEN",
        // Amazon Cognito Region
        region: 'eu-west-1',
        // Amazon Cognito User Pool ID
        userPoolId: POOL_DATA.UserPoolId,
        // Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: POOL_DATA.ClientId,
        //mandatorySignIn: false,
        // },
    },
    Storage: {
        AWSS3: {
            bucket: 'HIDDEN', //REQUIRED -  Amazon S3 bucket name
            region: 'eu-west-1', //OPTIONAL -  Amazon service region
        }
    },
    API: {
        endpoints: [
            {
                name: "HIDDEN",
                endpoint: "HIDDEN",
                custom_header: async () => {
                    return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
                }
            },
        ]
    },
    Analytics: {
        // OPTIONAL - disable Analytics if true
        disabled: false,
        // OPTIONAL - Allow recording session events. Default is true.
        autoSessionRecord: true,
        AWSPinpoint: {
                // OPTIONAL -  Amazon Pinpoint App Client ID
                appId: 'HIDDEN',
                region: 'eu-west-1',
                mandatorySignIn: false,
                optOut: "NONE",

            endpoint: {
                channelType: 'GCM'
            }
        }
    }
};