import React from "react";
import { View, TouchableWithoutFeedback, StyleSheet, Text } from "react-native";
import { Colors } from "../../../constants";

const ChartBlock = (props) => {
  const { id, navigation, image, text } = props;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push("Chart", {
          chart: id,
        });
      }}
    >
      <View style={styles.chartLabel}>
        <Text style={styles.chartName}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  chartLabel: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: Colors.BG,
    borderColor: Colors.FG,
    borderWidth: 1,
  },
  chartName: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: Colors.text,
  },
});

export default ChartBlock;
