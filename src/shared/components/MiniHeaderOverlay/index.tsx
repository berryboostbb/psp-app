import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');

const MiniOverlay = (props: any) => {
    const { bgColor, opacity, top } = props;
    return <View style={[styles.overlay, { backgroundColor: bgColor, opacity: opacity, top: top }]}>{props.children}</View>;
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        paddingBottom: 3,
        // height: height,
    },
});

export default MiniOverlay;
