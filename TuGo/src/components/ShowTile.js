import React, { useRef, useEffect, useState } from "react";
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useTilePlayerState, useTilePlayerDispatch } from "../context/tilePlayerContext";
import { Colors } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import RBSheet from "react-native-raw-bottom-sheet";

var { width, height } = Dimensions.get("window");

const toRight = width - 45;

const ShowTile = () => {
  const { isActive, id } = useTilePlayerState(); //Use global soundObj from Redux state
  const [song, setSong] = useState(null);
  const [xy, setXY] = useState(new Animated.ValueXY(0));
  const [sideState, setSideState] = useState(true);
  const [show, setShow] = useState(isActive)
  const insets = useSafeAreaInsets();
const showRef = useRef();

  useEffect(() => {
    setShow(isActive)
    if(isActive) {
        if(showRef.current) showRef.current.open();
    }
  }, [isActive]); 

  // useEffect(() => {
  //   async function getTrack() {
  //     const res = await getTrackDetailsAPI(trackId);
  //     setSong(res.data.tracks[0]);
  //   }
  //   if (trackId) getTrack();
  // }, [isError]);

  if (!show) return <></>;
  return (           
  <RBSheet
    height={0.5 * height}
    ref={showRef}
    closeOnDragDown={true}
    closeOnPressMask={false}
    customStyles={{
        wrapper: {
        backgroundColor: "transparent",
        },
        draggableIcon: {
        backgroundColor: Colors.FG,
        },
        container: {
        backgroundColor: Colors.BG,
        },
    }}
    >
    {/* <WebView
      ref={(WEBVIEW_REF) => (WebViewRef[item.id] = WEBVIEW_REF)}
      scrollEnabled={false}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsInlineMediaPlayback={true}
      source={{ uri: `https://www.youtube.com/watch?v=${youtube_id}` }}
    /> */}
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "maroon",
    width: "100%",
    opacity: 1,
    borderRadius: 10,
    height: 400,
    top: 100
  },
  progress: {
    height: 3,
    backgroundColor: "#bcbcbc",
  },
  row: {
    flexDirection: "row",
    alignItems: 'center',
    flex: 1
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 5,
    margin: 5,
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    justifyContent: "space-around",
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "bold",
    width: width * 0.6,
  },
  artist: {
    color: Colors.text,
    fontSize: 15,
  },
});

export default ShowTile;
