import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import { Colors } from "../../../constants";
import GText from "../GText"

let {width, height} = Dimensions.get('window')

const outerWidth = width/3-15;
const outerHeight = 100;
const animationWidth = 120;

const ChartBlock = (props) => {
  const { id, navigation, image, text } = props;

  const [sizeValue, setSizeValue] = useState(new Animated.Value(outerWidth));

  const [xy, setXY] = useState(new Animated.ValueXY({ x: outerWidth, y: outerHeight }));

  const imageAnimationIn = () => {
    Animated.timing(xy, {
      toValue: { x: width/3-20, y: 95 },
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  const imageAnimationOut = () => {
    Animated.timing(xy, {
      toValue: { x: outerWidth, y: outerHeight },
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push("Chart", {
          chart: id,
        });
      }}
      onPressIn={imageAnimationIn}
      onPressOut={imageAnimationOut}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: outerHeight,
          width: outerWidth,
          margin: 5
        }}
      >
        <Animated.View
          style={{
            ...styles.chartLabel,
            width: xy.x,
            height: xy.y,
          }}
        >
          <GText style={styles.chartName}>{text}</GText>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  chartLabel: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: Colors.contrastGray,
    alignSelf: "center",
  },
  chartName: {
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: "center",
    color: Colors.text,
    margin: 10,
  },
});

export default ChartBlock;
