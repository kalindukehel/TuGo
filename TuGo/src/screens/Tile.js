import React from "react";
import { View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { Colors } from "../../constants";

const Tile = () => {
  return (
    <View style={{ flex: 1, maxHeight: "75%" }}>
      <WebView
        style={{ flex: 1, borderColor: Colors.text }}
        javaScriptEnabled={true}
        source={{
          uri: "https://www.youtube.com/watch?v=3CxtK7-XtE0",
        }}
      />
    </View>
  );
};

export default Tile;
