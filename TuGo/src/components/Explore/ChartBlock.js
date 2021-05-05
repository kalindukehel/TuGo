import React, { useState, useEffect } from "react";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import { Colors } from "../../../constants";

const outerWidth = 105;
const outerHeight = 55;
const animationWidth = 120;

const ChartBlock = (props) => {
  const { id, navigation, image, text } = props;

  const [sizeValue, setSizeValue] = useState(new Animated.Value(outerWidth));

  const [xy, setXY] = useState(new Animated.ValueXY({ x: 105, y: 55 }));

  const imageAnimationIn = () => {
    Animated.timing(xy, {
      toValue: { x: 100, y: 50 },
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  const imageAnimationOut = () => {
    Animated.timing(xy, {
      toValue: { x: 105, y: 55 },
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
        }}
      >
        <Animated.View
          style={{
            ...styles.chartLabel,
            width: xy.x,
            height: xy.y,
          }}
        >
          <Text style={styles.chartName}>{text}</Text>
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

export default ChartBlock;
