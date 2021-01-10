import { Image, View, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import WebView from "react-native-webview";

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
        style={{ marginHorizontal: 10 }}
      >
        <Image
          source={{
            uri: thumbnail,
          }}
          style={{
            width: 100,
            height: 170,
            borderRadius: 20,
          }}
        />
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
              uri: url,
            }}
          />
        </View>
      </RBSheet>
    </View>
  );
};

export default VideoTile;
