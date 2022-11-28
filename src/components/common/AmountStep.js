import {useDispatch, useSelector} from "react-redux";
import {StyleSheet, View} from "react-native";
import {Button, Icon, Text} from "@ui-kitten/components";
import {countDecrement, countIncrement} from "../../actions/SearchActions";
import React from "react";

export const AmountStep = ({counterType}) => {
    const dispatch = useDispatch();
    //Access Redux Store State
    const people = useSelector((state) => state.people);

    const buttonEnabled = () => {
        return people[counterType] > 0;
    };

    return (
        <View style={style.amountContainer}>
            <Button
                style={[style.iconButton, style.amountButton]}
                size='small'
                appearance='outline' status='primary'
                icon={() => (<Icon {...style} name='minus'/>)}
                onPress={() => dispatch(countDecrement(counterType))}
                disabled={!buttonEnabled()}
            />
            <Text
                style={style.amount}
                category='s1'>
                {people[counterType]}
            </Text>
            <Button
                style={[style.iconButton, style.amountButton]}
                size='small'
                appearance='outline' status='primary'
                icon={() => (<Icon {...style} name='plus'/>)}
                onPress={() => dispatch(countIncrement(counterType))}
            />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    detailsContainer: {
        flex: 1,
        height: '100%',
        padding: 16,
    },
    amountContainer: {
        flexDirection: 'row',
    },
    amountButton: {
        borderRadius: 16,
    },
    amount: {
        textAlign: 'center',
        top: 5,
        width: 40,
    },
    iconButton: {
        paddingHorizontal: 0,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: "black"
    },
});