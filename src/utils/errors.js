import Toast from "react-native-toast-message";

export function checkBoat(id, hostUsername) {
    if (id == null || hostUsername == null) {
        Toast.show({
            text1: `Object id or hostUsername not specified`,
            text2: `Please go back`,
            type: "error"
        });
        return false;
    }
    return true;
}

export function checkId(id) {
    if (id == null) {
        Toast.show({
            text1: `Not all data specified`,
            text2: `Please go back`,
            type: "error"
        });
        return false;
    }
    return true;
}


export function apiError(message, api) {
    Toast.show({
        text1: `Something went wrong: ${(api) ? api : ''}`,
        text2: `${message}`,
        type: "error"
    });

}