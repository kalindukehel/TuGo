import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Image } from "react-native";
import WebView from "react-native-webview";
import RBSheet from "react-native-raw-bottom-sheet";

//Component used in DanceChoreoTabView to display YouTube video results
const VideoSearchItem = (props) => {
  const { title, thumbnail, videoId, selected, selectVideo } = props;
  const refRBSheet = useRef();
  return (
    <View>
      <TouchableOpacity
        style={{ flex: 1, flexDirection: "row", paddingLeft: 5 }}
        onPress={() => {
          selectVideo(videoId);
        }}
      >
        <Image
          style={{
            width: 145,
            height: 90,
            borderWidth: selected ? 5 : 2,
            borderRadius: 10,
            borderColor: selected ? "yellow" : "black",
            marginEnd: 10,
          }}
          source={{ uri: thumbnail }}
        />
        <View>
          <Text style={{ width: 200, paddingBottom: 5 }}>{title}</Text>
          <TouchableOpacity
            onPress={() => {
              refRBSheet.current.open();
            }}
          >
            <Text style={{ borderWidth: 1, width: 60, textAlign: "center" }}>
              Preview
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <RBSheet
        height={400}
        ref={(ref) => {
          //set RBSheet array index equal to this object
          refRBSheet.current = ref;
        }}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <View style={{ flex: 1, maxHeight: "100%" }}>
          <WebView
            style={{ flex: 1, borderColor: "black" }}
            javaScriptEnabled={true}
            scrollEnabled={false}
            allowsInlineMediaPlayback={true}
            source={{
              uri: "https://www.youtube.com/watch?v=" + videoId,
            }}
          />
        </View>
      </RBSheet>
    </View>
  );
};

export default VideoSearchItem;
