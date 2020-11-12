import React from 'react';
import { Dimensions, View } from 'react-native';
export const deviceWidth = Dimensions.get('window').width;

const Tiles = props => {
    console.log(props)
    return (
        <View
            style={{backgroundColor: "black"}}></View>
    )
}


export default Tiles;