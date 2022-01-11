import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import WebView from "react-native-webview";
import YoutubePlayer from "react-native-yt-player";
import { Colors } from "../../constants";
import { Foundation } from "@expo/vector-icons";
import { inlineStyles } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import TileRender from "../screens/Others/TileRender";
import { Video, AVPlaybackStatus } from "expo-av";
import { API_URL } from "../../constants";
import { useAuthState } from "../context/authContext";
import { s3VideoURL as s3VideoURLAPI } from "../api";

var { width, height } = Dimensions.get("window");

//Video Tile to display YouTube video linked to a post, or in CreatePost
const PostedTile = (props) => {
  const { tile, postId, isAuthor, getTileStates } = props;
  const { userToken } = useAuthState();
  const refRBSheet = useRef();
  const insets = useSafeAreaInsets();
  const [xy, setXY] = useState(
    new Animated.ValueXY({ x: width / 3.4, y: width / 5 })
  );
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [mediaUrl, setMediaUrl] = useState(null);

  useEffect(() => {
    if (!tile.is_youtube) {
      gets3VideoURL();
    }
  }, []);

  async function gets3VideoURL() {
    const res = await s3VideoURLAPI(userToken, postId, tile.id);
    setMediaUrl(res.data.url);
  }

  const imageAnimationIn = () => {
    Animated.timing(xy, {
      toValue: { x: width / 3.4 - 10, y: width / 5 - 5 },
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  const imageAnimationOut = () => {
    Animated.timing(xy, {
      toValue: { x: width / 3.4, y: width / 5 },
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  return tile.is_youtube ? (
    <View>
      <TouchableWithoutFeedback
        onPress={() => {
          // tilePlayerDispatch({type: 'SHOW_TILE', id: youtube_id})
          refRBSheet.current.open();
        }}
        onPressIn={imageAnimationIn}
        onPressOut={imageAnimationOut}
      >
        <View
          style={{
            width: width / 3.4,
            height: width / 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.Image
            style={{
              height: xy.y,
              width: xy.x,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: Colors.primary,
            }}
            source={{ uri: tile.image }}
          />
        </View>
      </TouchableWithoutFeedback>
      <RBSheet
        closeOnDragDown
        onClose={() => getTileStates()}
        height={height}
        ref={refRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: '"transparent"',
          },
          draggableIcon: {
            backgroundColor: "transparent",
          },
          container: {
            backgroundColor: "transparent",
          },
        }}
      >
        <TileRender
          url={tile.youtube_link}
          tileModal={refRBSheet}
          isAuthor={isAuthor}
          tileId={tile.id}
          postId={postId}
          isYoutube={true}
        />
      </RBSheet>
    </View>
  ) : (
    <View>
      <TouchableWithoutFeedback
        onPress={() => {
          // tilePlayerDispatch({type: 'SHOW_TILE', id: youtube_id})
          refRBSheet.current.open();
        }}
        onPressIn={imageAnimationIn}
        onPressOut={imageAnimationOut}
      >
        <View
          style={{
            width: width / 3.4,
            height: width / 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Video
            ref={refRBSheet}
            style={{
              width: "100%",
              height: "100%",
              borderColor: Colors.FG,
              borderWidth: 2,
              borderRadius: 10,
            }}
            source={{ uri: mediaUrl }} // Can be a URL or a local file.
            resizeMode="contain"
            onPlaybackStatusUpdate={(status) => {}}
          ></Video>
        </View>
      </TouchableWithoutFeedback>
      <RBSheet
        onOpen={() => gets3VideoURL()}
        onClose={() => getTileStates()}
        height={500}
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "transparent",
          },
          container: {
            backgroundColor: "transparent",
          },
        }}
      >
        <View style={{ backgroundColor: "black", flex: 1 }}>
          <Video
            resizeMode="cover"
            shouldPlay
            useNativeControls
            style={{ width: "100%", height: "100%" }}
            source={{ uri: mediaUrl }}
          />
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    alignSelf: "center",
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: "white",
  },
});

export default PostedTile;
