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
import { Video, AVPlaybackStatus } from 'expo-av';
import { API_URL } from "../../constants";

var { width, height } = Dimensions.get("window");

//Video Tile to display YouTube video linked to a post, or in CreatePost
const PostedTile = (props) => {
  const { tile, postId, isAuthor, getTileStates } = props;
  const refRBSheet = useRef();
  const insets = useSafeAreaInsets();
  const [xy, setXY] = useState(new Animated.ValueXY({ x: width/3.4, y: width/5 }));
  const video = useRef(null);
  const [status, setStatus] = useState({});

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
            <Animated.Image style={{height: xy.y, width: xy.x, borderRadius: 10, borderWidth: 2}} source={{uri: tile.image}}/>
          </View>
      </TouchableWithoutFeedback>
      {tile.is_youtube ? <RBSheet
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
          <TileRender url={tile.youtube_link} tileModal={refRBSheet} isAuthor={isAuthor} tileId={tile.id} postId={postId} isYoutube={true} /> 
      </RBSheet> :
      <RBSheet
          onClose={() => getTileStates()}
          height={500}
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: "transparent",
            },
            container: {
              backgroundColor: "transparent",
            },
          }}
        >
          <View style={{backgroundColor: 'black', flex: 1}}>              
          <Image style={{height: 100, width: 100}} source={{uri: "http://0.0.0.0:8000/media/profilePictures/20200816_192744_VCyaYIn.jpg"}}/>
          <Video   rate={1.0}
  volume={1.0}
  isMuted={false}
  resizeMode="cover"
  shouldPlay
  isLooping
  style={{ width: 1000, height: 1000}}
                  source={{uri: "http://0.0.0.0:8000/media/videoUploads/AppDemo_I3VH7Yi.mp4/"}}
          />
          </View>
      </RBSheet>}
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: 'white'
  }
})

export default PostedTile;
