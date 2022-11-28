import React from 'react';
import {View} from 'react-native';
import {Layout, Text, withStyles} from "@ui-kitten/components";

const TextualInfoItemComponent = (props) => {
    const {label, value, themedStyle} = props;
    return (
        <React.Fragment>
            <Layout
                level='1'
                style={themedStyle.container}
            >
                    <Text
                        category='s1'>
                        {label}
                    </Text>
                {
                    (typeof value === 'string' || value instanceof String) ? (
                        <Text category='s1'
                              appearance='hint'>
                            {value}
                        </Text>
                    ) : (
                        value
                    )
                }

            </Layout>
        </React.Fragment>
    );
};

export const TextualInfoItem = withStyles(TextualInfoItemComponent, (theme) => {
    return ({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
        },
    });
});

