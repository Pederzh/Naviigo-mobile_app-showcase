import {combineReducers} from "redux";
import {dataReducer} from "./DataReducer";
import {counterReducer, locationReducer, gpsLocationReducer, dateTimeReducer} from "./SearchReducer";
import {boatReducer} from "./BoatReducer";
import {authReducer} from "./AuthReducer";
import {themeReducer} from './ThemeReducer'; 

//when you have multiple reducers
const rootReducer = combineReducers({
    data: dataReducer,
    people: counterReducer,
    location: locationReducer,
    gpsLocation: gpsLocationReducer,
    datetime: dateTimeReducer,
    currentBoat: boatReducer,
    auth: authReducer,
    theme: themeReducer,
});

export default rootReducer;