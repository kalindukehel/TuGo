import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from "react-native";

var { width, height } = Dimensions.get("window");

const SavedVoice = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Saved Voice",
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>SavedVoice</Text>
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

export default SavedVoice;
