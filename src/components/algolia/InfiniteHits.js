import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {FlatList, StyleSheet, View} from 'react-native';
import {connectInfiniteHits} from 'react-instantsearch-native';
import {BoatCard} from "./BoatCard";
import {useDispatch, useSelector} from "react-redux";
import {addData} from "../../actions/DataActions";
import {useScreenInfo} from "../../hooks";

const InfiniteHits = (props) => {
    const {hits, hasMore, refineNext, navigation, searchState} = props;
    const screenInfo = useScreenInfo();
    const {height, width, orientation, isTablet} = screenInfo;
    const dispatch = useDispatch();
    /*
    hits: the records that match the search state
    hasMore: a boolean that indicates if there are more pages to load
    refine: the function to call when the end of the page is reached to load more results.
    On the React Native side, we take advantage of the FlatList to render this infinite scroll.
     */
    dispatch(addData(hits));

    useEffect(() => {
        //console.log(hits)
    }, [searchState])

    return (
        <View>
            <FlatList
                horizontal={false}
                //TODO CHANGE if you want dual column
                numColumns={props.numColumns ? props.numColumns : ((!isTablet) ? 1 : 2)}
                //numColumns={(aspectRatio > 1.6) ? 1 : 2}
                data={hits}
                keyExtractor={item => item.objectID}
                onEndReached={() => hasMore && refineNext()}
                renderItem={({item}) =>
                    (
                        <View style={styles.item}>
                            <BoatCard item={item} navigation={navigation}/>
                        </View>
                    )}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    separator: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    item: {
        flex: 1,
        flexDirection: 'column',
    },
    titleText: {
        fontWeight: 'bold',
    },
});

InfiniteHits.propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refine: PropTypes.func.isRequired,
};

export default connectInfiniteHits(InfiniteHits);