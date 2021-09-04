import React, { useState, useEffect } from "react";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import { Colors } from "../../../constants";

const outerWidth = 120;
const outerHeight = 120;
const animationWidth = 120;

const AlbumBlock = (props) => {
  const { id, navigation, image, text } = props;

  const [sizeValue, setSizeValue] = useState(new Animated.Value(outerWidth));

  const [xy, setXY] = useState(new Animated.ValueXY({ x: outerWidth, y: outerHeight }));

  const imageAnimationIn = () => {
    Animated.timing(xy, {
      toValue: { x: 110, y: 110 },
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  const imageAnimationOut = () => {
    Animated.timing(xy, {
      toValue: { x: outerWidth, y: outerHeight   },
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push("Album", {
          album: id,
        });
      }}
      onPressIn={imageAnimationIn}
      onPressOut={imageAnimationOut}
    >
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View
                style={{
                justifyContent: "center",
                alignItems: "center",
                height: outerHeight,
                width: outerWidth,
                }}
            >
                <Animated.Image
                style={{
                    width: xy.x,
                    height: xy.y,
                }}
                source={{uri: image}}
                />
            </View>
            <Text style={{color: Colors.text, marginTop: 10}}>{text}</Text>
        </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  chartLabel: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: Colors.BG,
    borderColor: Colors.FG,
    borderWidth: 1,
    alignSelf: "center",
  },
  chartName: {
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
    color: Colors.text,
    margin: 10,
  },
});

export default AlbumBlock;
