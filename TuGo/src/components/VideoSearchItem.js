import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Image } from "react-native";
import WebView from "react-native-webview";
import RBSheet from "react-native-raw-bottom-sheet";
import YoutubePlayer from "react-native-yt-player";
import { Colors } from "../../constants";
import { AntDesign } from "@expo/vector-icons";
import HTML from "react-native-render-html";

var { width, height } = Dimensions.get("window");

//Component used in DanceChoreoTabView to display YouTube video results
const VideoSearchItem = (props) => {
  const { title, thumbnail, videoId, selected, selectVideo, inCreatePost, outlineColor } =
    props;
  const refRBSheet = useRef();
  useEffect(() => {
    console.log(selected);
  }, []);
  return (
    <View>
      <TouchableOpacity
        style={{ flex: 1, flexDirection: "row", paddingLeft: 5 }}
        onPress={() => {
          inCreatePost ? selectVideo(videoId) : refRBSheet.current.open();
        }}
      >
        <Image
          style={{
            width: 145,
            height: 90,
            borderWidth: selected ? 3 : 0,
            borderRadius: 10,
            borderColor: selected ? outlineColor : "black",
            marginEnd: 10,
          }}
          source={{ uri: thumbnail }}
        />
        <View style={{ justifyContent: "space-between" }}>
          {/* <Text style={{ width: 200, paddingBottom: 5, color: Colors.FG }}>
            {title}
          </Text> */}
          <HTML
            source={{
              html: `<p style="color: ${Colors.text}; width: 200"> ${title}`,
            }}
            contentWidth={50}
          />
          {inCreatePost && (
            <TouchableOpacity
              onPress={() => {
                refRBSheet.current.open();
              }}
            >
              <Text
                style={{
                  borderWidth: 1,
                  width: 60,
                  textAlign: "center",
                  color: Colors.FG,
                  borderColor: Colors.FG,
                  borderWidth: 1,
                  borderRadius: 5,
                }}
              >
                Preview
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      <RBSheet
        height={height * 0.8}
        ref={(ref) => {
          //set RBSheet array index equal to this object
          refRBSheet.current = ref;
        }}
        closeOnDragDown={false}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: Colors.FG,
          },
          container: {
            backgroundColor: Colors.BG,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.FG,
          },
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              height: 40,
              backgroundColor: Colors.BG,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              marginHorizontal: 10,
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => refRBSheet.current.close()}
            >
              <AntDesign name="closecircle" size={24} color={Colors.FG} />
            </TouchableWithoutFeedback>
          </View>
          <WebView
            style={{ borderColor: Colors.text }}
            javaScriptEnabled={true}
            allowsInlineMediaPlayback={true}
            source={{
              uri: "https://www.youtube.com/watch?v=" + videoId,
            }}
          />
          {/* <YoutubePlayer
            loop
            videoId={videoId}
            onStart={() => console.log("onStart")}
            onEnd={() => alert("on End")}
          /> */}
        </SafeAreaView>
      </RBSheet>
    </View>
  );
};

export default VideoSearchItem;
