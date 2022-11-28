import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Button, Text,} from 'react-native-ui-kitten';
import {withStyles,} from 'react-native-ui-kitten/theme';

const BookingListElementComponent = (props) => {
    const {style, themedStyle, ...restProps} = props;

    return (
        <View style={[themedStyle.container, style]}>
            <Image
                style={themedStyle.image}
                // source={product.photo.imageSource}
            />
            <View style={themedStyle.infoContainer}>
                <TouchableOpacity
                    style={themedStyle.closeButton}
                    activeOpacity={0.9}
                    // onPress={this.onRemoveProduct}
                >
                    {/*{this.renderCloseIcon()}*/}
                </TouchableOpacity>
                <Text
                    style={[themedStyle.nameLabel, themedStyle.labelMargin]}
                    category='s1'>
                    {/*{product.name}*/}
                </Text>
                <Text
                    style={[themedStyle.typeLabel, themedStyle.labelMargin]}
                    appearance='hint'
                    category='c1'>
                    {/*{product.type}*/}
                </Text>
                <Text style={themedStyle.nameLabel}>
                    {/*{`${this.calculateTotalProductCost()} ${product.currency}`}*/}
                </Text>
                <View style={themedStyle.counterContainer}>
                    <Button
                        style={themedStyle.counterButton}
                        textStyle={textStyle.button}
                        size='small'
                        //icon={this.renderMinusIcon}
                        //onPress={this.onRemoveCopy}
                    />
                    <Text style={[themedStyle.nameLabel, themedStyle.countLabel]}>
                        {/*{`${product.count}`}*/}
                    </Text>
                    <Button
                        style={themedStyle.counterButton}
                        textStyle={textStyle.button}
                        size='small'
                        //icon={this.renderPlusIcon}
                        //onPress={this.onAddCopy}
                    />
                </View>
            </View>
        </View>
    );
};

export const BookingListElement = withStyles(BookingListElementComponent, (theme) => {
    return ({
        container: {
            flexDirection: 'row',
            // paddingLeft: 16,
        },
        image: {
            width: 144,
            height: null,
        },
        infoContainer: {
            flex: 1,
            padding: 16,
        },
        closeIcon: {
            width: 20,
            height: 20,
            position: 'absolute',
            alignSelf: 'center',
            tintColor: theme['text-hint-color'],
            top: 8,
        },
        closeButton: {
            position: 'absolute',
            top: 0,
            right: 0,
            width: 20,
            height: 20,
            padding: 16,
        },
        labelMargin: {
            marginBottom: 4,
        },
        nameLabel: textStyle.subtitle,
        typeLabel: textStyle.paragraph,
        counterContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 18,
        },
        counterIcon: {
            tintColor: 'white',
        },
        counterButton: {
            width: 10,
            height: 10,
            borderRadius: 20,
        },
        countLabel: {
            marginHorizontal: 14,
        },
    });
});