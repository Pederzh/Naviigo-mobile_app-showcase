import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { connectSearchBox } from 'react-instantsearch-native';

const SearchBox = ({ currentRefinement, refine }) => {
    /*
        refine: the function to call when a new category is selected
     */
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={value => refine(value)}
                value={currentRefinement}
                placeholder=""
            />
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#000000'
    },
    input: {
        height: 48,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
});

SearchBox.propTypes = {
    currentRefinement: PropTypes.string.isRequired,
    refine: PropTypes.func.isRequired,
};

export default connectSearchBox(SearchBox);