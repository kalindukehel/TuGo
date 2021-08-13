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

var { width, height } = Dimensions.get("window");

//Video Tile to display YouTube video linked to a post, or in CreatePost
const PostedTile = (props) => {
  const { url, thumbnail } = props;
  const refRBSheet = useRef();
  const insets = useSafeAreaInsets();
  const [xy, setXY] = useState(new Animated.ValueXY({ x: width/3.4, y: width/5 }));
  let WebViewRef;

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
        height={400+insets.bottom}
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
          <View>
            <View
            style={{
                width: "100%",
                height: 400,
                borderWidth: 2,
            }}
            >
            <WebView
                ref={(WEBVIEW_REF) => (WebViewRef = WEBVIEW_REF)}
                scrollEnabled={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}
                source={{ uri: url }}
            />
            </View>
            <View
            style={{
                backgroundColor: Colors.contrastGray,
                position: "absolute",
                right: "3%",
                top: "90%",
                zIndex: 99,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 8,
                borderRadius: 5,
            }}
            >
            {/* <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => {
                deleteTileConfirmation(item.id);
                }}
            >
                <Feather name="trash-2" size={24} color="red" />
            </TouchableOpacity> */}
            <TouchableOpacity
                style={{}}
                onPress={() => {
                WebViewRef && WebViewRef.reload();
                }}
            >
                <Foundation name="refresh" size={30} color={Colors.primary} />
            </TouchableOpacity>
            </View>
        </View>
      </RBSheet>
    </View>
  );
};

export default PostedTile;
