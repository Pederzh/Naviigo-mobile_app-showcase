import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Layout, withStyles} from "@ui-kitten/components";

const BoilerplateComponent = (props) => {
    const {themedStyle} = props;
    return(
        <React.Fragment>
            <Layout level='1'>

            </Layout>
        </React.Fragment>
    );
};

export const Boilerplate = withStyles(BoilerplateComponent, (theme) => {

    return ({


    });
});

const style = StyleSheet.create({

});