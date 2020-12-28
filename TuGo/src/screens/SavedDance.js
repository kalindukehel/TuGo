import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from "react-native";

var { width, height } = Dimensions.get("window");

const SavedDance = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Saved Dance",
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>SavedDance</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SavedDance;
