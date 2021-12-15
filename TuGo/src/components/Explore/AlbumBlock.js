import React, { useState, useEffect } from "react";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import { Colors, Length } from "../../../constants";
import { Truncate } from "../../Helpers/Truncate";
import GText from "../GText"

const outerWidth = 120;
const outerHeight = 120;
const animationWidth = 120;

const AlbumBlock = (props) => {
  const { id, navigation, image, text } = props;

  const [sizeValue, setSizeValue] = useState(new Animated.Value(outerWidth));

  const [xy, setXY] = useState(new Animated.ValueXY({ x: outerWidth, y: outerHeight }));

  const imageAnimationIn = () => {
    Animated.timing(xy, {
      toValue: { x: 115, y: 115 },
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
        <View style={{flexDirection: 'column' }}>
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
                    borderRadius: 10,
                    width: xy.x,
                    height: xy.y,
                }}
                source={{uri: image}}
                />
            </View>
            <GText style={{ flexWrap: "wrap", width: 120, marginTop: 5 }}>
              <GText style={{color: Colors.text}}>{text}</GText>
            </GText>
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
