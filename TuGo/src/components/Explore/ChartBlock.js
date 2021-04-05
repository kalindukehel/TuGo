import React, { useState, useEffect } from "react";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import { Colors } from "../../../constants";

const outerWidth = 130;
const animationWidth = 120;

const ChartBlock = (props) => {
  const { id, navigation, image, text } = props;

  const [sizeValue, setSizeValue] = useState(new Animated.Value(outerWidth));

  const imageAnimationIn = () => {
    Animated.timing(sizeValue, {
      toValue: animationWidth,
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  const imageAnimationOut = () => {
    Animated.timing(sizeValue, {
      toValue: outerWidth,
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
          height: outerWidth,
          width: outerWidth,
        }}
      >
        <Animated.View
          style={{
            ...styles.chartLabel,
            width: sizeValue,
            height: sizeValue,
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
    fontSize: 15,
    textAlign: "center",
    color: Colors.text,
    margin: 10,
  },
});

export default ChartBlock;
