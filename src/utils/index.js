import {
    BOAT_ID_PREFIX,
    BOOKING_FEES_FIXED, BOOKING_FEES_GUEST,
    BOOKING_FEES_GUEST_FIXED, BOOKING_FEES_PERCENTAGE,
    DEFAULT_BOAT_IMAGE
} from "./constraints";

export const getHour = (time) => {
    if (time == null) return '00';

    let arr = time.split(':');
    return arr[0];
};

export const getMinute = (time) => {
    if (time == null) return '00';

    let arr = time.split(':');
    return arr[1];
};

export const timeToInt = (timeString) => {
    if (timeString == null) return null;
    return parseInt(timeString.replace(':', ''));
};

export const timeToMinutes = (timeString) => {
    if (timeString == null) return 0;
    let hoursInMinutes = parseInt(getHour(timeString), 10) * 60;
    let minutes = parseInt(getMinute(timeString), 10);

    return hoursInMinutes + minutes;
};

export const minutesToTime = (time) => {
    if (time == null) return null;
    let hours = Math.floor(time/60);
    let minutes = time % 60 ;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const fromTime = (time1, time2) => {
    if (time1 == null && time2 == null) return null;
    if (time1 != null && time2 != null) {
        if (timeToInt(time1) < timeToInt(time2)) {
            return time1
        }
        else {
            return time2;
        }
    }
    return null;
};

export const toTime = (time1, time2) => {
    if (time1 == null && time2 == null) return null;
    if (time1 != null && time2 != null) {
        if (timeToInt(time1) > timeToInt(time2)) {
            return time1
        }
        else {
            return time2;
        }
    }
    return null;
};

export function capitalizeFirstLetter(string) {
    if(!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const getFirstImage = (images) => {
    return (images != null) ? images[0].path : DEFAULT_BOAT_IMAGE;
};

export function boatDataFromQRCode(data){
    /*
        e.g. QR CODE VALUE: 1x8fBAEg3joV8u9cpTR7eSJlo3M/luigi.pederzani
     */
    return {
        id: data.substring(0, data.lastIndexOf("/")),
        hostUsername: data.substring(data.lastIndexOf("/") +1)
    }
}

export function sanitizeBoatId(boatId){
    if(boatId && boatId.startsWith(BOAT_ID_PREFIX)){
        return boatId.replace(BOAT_ID_PREFIX, '');
    }
    return boatId;
}

export function sanitizeUsername(username){
    if(!username) return '';

    if(!validateEmail(username)) return username;

    return username.substring(0, username.lastIndexOf("@"));
}

export function calculateServiceCost(bookingFeesType, price){
    /*
        bookingFeesType = BOOKING_FEES_TYPE (constant)
     */
    return (bookingFeesType === BOOKING_FEES_FIXED)
        ? `${BOOKING_FEES_GUEST_FIXED}` : (
            (bookingFeesType === BOOKING_FEES_PERCENTAGE)
                ? `${Number(price) * Number(BOOKING_FEES_GUEST)}`
                : `0`
        )
}

export function showServiceCost(bookingFeesType, price, currency) {
    return `${calculateServiceCost(bookingFeesType, price)} ${currency}`;
}


export function calculateTotalCost(bookingFeesType, price){
    /*
        bookingFeesType = BOOKING_FEES_TYPE (constant)
     */
    return (bookingFeesType === BOOKING_FEES_FIXED)
        ? `${Number(price) + Number(BOOKING_FEES_GUEST_FIXED)}` : (
            (bookingFeesType === BOOKING_FEES_PERCENTAGE)
                ? `${Number(price) + Number(price * BOOKING_FEES_GUEST)}`
                : `${price}`
        )
}

export function showTotalCost(bookingFeesType, price, currency){
    return `${calculateTotalCost(bookingFeesType, price)} ${currency}`;
}

export function rightHost(authState){
    return (authState?.isHost && authState?.modeHost);
}

export const convertToUTCTime = (dateString) => {
    if(!dateString) return dateString;
    const [fullDate, time] = dateString.split('T');
    const [year, month, date] = fullDate.split('-');
    const [hour, minute, second] = time.split(':');
    const dateTime = new Date(year, month, date, hour, minute, second);
    console.log('UTC', dateTime.toISOString())
    return dateTime.toISOString();
};

export const convertToLocalTime = (dateString) => {
    if(!dateString) return dateString;
    let date = new Date(dateString);
    const milliseconds = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    );
    const localTime = new Date(milliseconds);
    console.log('local', localTime)
    return localTime.toISOString();
    // localTime.getDate(); // local date
    // localTime.getHours(); // local hour
};

export const convertToLocalDate = (dateString) => {
    if(!dateString) return dateString;
    let date = new Date(dateString);
    const milliseconds = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    );
    const localTime = new Date(milliseconds);
    let month = `${localTime.getUTCMonth() + 1}`;
    let day = `${localTime.getUTCDate()}`;
    let year = `${localTime.getUTCFullYear()}`;
    //console.log(year + "-" + month + "-" + day)
    //console.log(year + "-" + month + "-" + day)
    return year + "-" + month.padStart(2, '0') + "-" + day.padStart(2, '0');
};

export const convertToLocalSimpleDate = (dateString) => {
    if(!dateString) return dateString;
    let date = new Date(dateString);
    const milliseconds = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    );
    const localTime = new Date(milliseconds);
    let month = `${localTime.getUTCMonth() + 1}`;
    let day = `${localTime.getUTCDate()}`;
    return day.padStart(2, '0') + "/" + month.padStart(2, '0');
};

export function diffHours(dt2, dt1){
    if(!dt2 || !dt1) return 0;
    dt2 = new Date(dt2);
    dt1 = new Date(dt1);
    let diff =(dt2.getTime() - dt1.getTime()) / 1000; //todo check
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
}

export const isToday = (someDate) => {
    if(!someDate) return 0;
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
};

export function getNumberOfDays(date2) {
    const date1 = new Date();

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();
    console.log(date2);
    console.log(date1);
    console.log(diffInTime)

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    console.log(diffInDays)
    return diffInDays;
}

export const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};

export function makeFilename() {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < 16; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
