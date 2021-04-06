import React, { useRef } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import WebView from "react-native-webview";
import YoutubePlayer from "react-native-yt-player";
import { Colors } from "../../constants";
import { AntDesign } from "@expo/vector-icons";

var { width, height } = Dimensions.get("window");

//Video Tile to display YouTube video linked to a post, or in CreatePost
const VideoTile = (props) => {
  const { videoId } = props;
  const url = "https://www.youtube.com/watch?v=" + videoId;
  const thumbnail = "https://i.ytimg.com/vi/" + videoId + "/mqdefault.jpg";
  const refRBSheet = useRef();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          refRBSheet.current.open();
        }}
      >
        <Image
          source={{
            uri: thumbnail,
          }}
          style={{
            width: 300,
            height: 200,
            borderRadius: 20,
            borderColor: "red",
            borderWidth: 1,
          }}
        />
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
              uri: url,
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

export default VideoTile;
