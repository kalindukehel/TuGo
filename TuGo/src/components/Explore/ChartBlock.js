import React from "react";
import {
  ImageBackground,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
} from "react-native";
const ChartBlock = (props) => {
  const { type, navigation, image, text } = props;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push("Chart", {
          chart: type,
        });
      }}
    >
      <ImageBackground
        imageStyle={styles.chartImage}
        style={styles.chartLabel}
        source={{
          uri: image,
        }}
      >
        <Text style={styles.chartName}>{text}</Text>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  chartImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    opacity: 0.4,
  },
  chartLabel: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  chartName: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});

export default ChartBlock;
