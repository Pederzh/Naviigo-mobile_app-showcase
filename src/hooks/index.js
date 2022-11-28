import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';

export const useDebounce = (searchValue, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(searchValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(searchValue);
        }, delay);

        return () => {
            clearTimeout(handler);
        }
    }, [searchValue]);

    return debouncedValue;
};

/**
 * A React Hook which updates when the orientation changes
 * @returns whether screen dimensions, if is tablet and whether the user is in 'PORTRAIT' or 'LANDSCAPE',
 */
export function useScreenInfo() {
    // State to hold the connection status
    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    const getAspectRatio = () => {
        if(isPortrait()){
            return Dimensions.get('screen').height / Dimensions.get('screen').width
        } else {
            return Dimensions.get('screen').width / Dimensions.get('screen').height
        }
    };

    const isTablet = () => getAspectRatio() < 1.6;

    const [dimensions, setDimensions] = useState({
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        aspectRatio: getAspectRatio(),
        orientation: (isPortrait() ? 'PORTRAIT' : 'LANDSCAPE'),
        isTablet: isTablet()
    });

    useEffect(() => {
        const callback = () => setDimensions({
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
            aspectRatio: getAspectRatio(),
            orientation: (isPortrait() ? 'PORTRAIT' : 'LANDSCAPE'),
            isTablet: isTablet()
        });

        Dimensions.addEventListener('change', callback);

        return () => {
            Dimensions.removeEventListener('change', callback);
        };
    }, []);

    return dimensions;
}