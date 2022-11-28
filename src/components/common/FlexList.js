import React from 'react';
import {StyleSheet} from 'react-native';
import {List, withStyles} from "@ui-kitten/components";
import {useScreenInfo} from "../../hooks";

const FlexListComponent = (props) => {
    const {style, numColumns, contentContainerStyle, data, renderItem, ListHeaderComponent, ListFooterComponent, themedStyle} = props;
    const screenInfo = useScreenInfo();
    const {height, width, orientation, aspectRatio} = screenInfo;

    return (
        <List
            style={style}
            contentContainerStyle={contentContainerStyle}
            data={data}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            numColumns={numColumns ? props.numColumns : ((aspectRatio > 1.6) ? 1 : 2)}
            {...props}
        />
    );
};

export const FlexList = withStyles(FlexListComponent, (theme) => {
    return ({});
});
