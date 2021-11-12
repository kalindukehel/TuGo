import React, { useRef, useState } from "react";
import {
  Image,
  View,
  Text,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
  Animated
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import WebView from "react-native-webview";
import YoutubePlayer from "react-native-yt-player";
import { Colors } from "../../constants";
import { Video } from "expo-av";

var { width, height } = Dimensions.get("window");

//Video Tile to display YouTube video linked to a post, or in CreatePost
const CustomVideoTile = (props) => {
  const { videosRef, item } = props;
  const refRBSheet = useRef();
  const [xy, setXY] = useState(new Animated.ValueXY({ x: width/3.4, y: width/5 }));
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
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
      <TouchableWithoutFeedback onPress={()=> {
          // tilePlayerDispatch({type: 'SHOW_TILE', id: youtube_id})
          refRBSheet.current.open()
        }}
        onPressIn={imageAnimationIn}
        onPressOut={imageAnimationOut}
      >
          <View style={{width: width/3.4, height: width/5, alignItems: 'center', justifyContent: 'center'}}>
          <Video
            ref={videosRef.current[item.uri]}
            style={{width: "100%", height: '100%', borderColor: Colors.FG, borderWidth: 1, borderRadius: 10}}
            source={{ uri: item.uri }} // Can be a URL or a local file.
            resizeMode="contain"
            onPlaybackStatusUpdate={(status) => {}}
          ></Video>
          </View>
      </TouchableWithoutFeedback>
      <RBSheet
        height={300}
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
        <Video
            ref={videosRef.current[item.uri]}
            style={{width: "100%", height: '90%'}}
            source={{ uri: item.uri }} // Can be a URL or a local file.
            useNativeControls
            resizeMode="contain"
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          ></Video>
        </SafeAreaView>
      </RBSheet>
    </View>
  );
};

export default CustomVideoTile;
