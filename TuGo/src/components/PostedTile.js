import React, { useRef, useState } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  TouchableHighlight,
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

var { width, height } = Dimensions.get("window");

//Video Tile to display YouTube video linked to a post, or in CreatePost
const PostedTile = (props) => {
  const { url, thumbnail, tileId, postId, isAuthor, getTileStates } = props;
  const refRBSheet = useRef();
  const insets = useSafeAreaInsets();
  const [xy, setXY] = useState(new Animated.ValueXY({ x: width/3.4, y: width/5 }));

  const imageAnimationIn = () => {
    Animated.timing(xy, {
      toValue: { x: width/3.4 - 10, y: width/5 - 5},
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  const imageAnimationOut = () => {
    Animated.timing(xy, {
      toValue: { x: width/3.4, y: width/5 },
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={()=> {
          // tilePlayerDispatch({type: 'SHOW_TILE', id: youtube_id})
          refRBSheet.current.open()
        }}
        onPressIn={imageAnimationIn}
        onPressOut={imageAnimationOut}
      >
          <View style={{width: width/3.4, height: width/5, alignItems: 'center', justifyContent: 'center'}}>
            <Animated.Image style={{height: xy.y, width: xy.x, borderRadius: 10}} source={{uri: thumbnail}}/>
          </View>
      </TouchableWithoutFeedback>
      <RBSheet
          onClose={() => getTileStates()}
          height={height}
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={false}
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
          <TileRender url={url} tileModal={refRBSheet} isAuthor={isAuthor} tileId={tileId} postId={postId} />
      </RBSheet>
    </View>
  );
};

export default PostedTile;
