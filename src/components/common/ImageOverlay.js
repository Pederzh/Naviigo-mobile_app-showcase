import React from 'react';
import {ImageBackground, ImageBackgroundProps, StyleProp, StyleSheet, View, ViewStyle,} from 'react-native';

const DEFAULT_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.05)';

export const ImageOverlay = (props) => {
    const {style, children, ...imageBackgroundProps} = props;
    const {overlayColor, ...imageBackgroundStyle} = StyleSheet.flatten(style);

    return (
        <ImageBackground
            {...imageBackgroundProps}
            style={imageBackgroundStyle}>
            <View style={[
                StyleSheet.absoluteFill,
                {backgroundColor: overlayColor || DEFAULT_OVERLAY_COLOR},
            ]}/>
            {children}
        </ImageBackground>
    );
}