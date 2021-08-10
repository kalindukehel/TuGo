import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useErrorState, useErrorDispatch } from "../context/errorContext";
import { getTrackDetails as getTrackDetailsAPI } from "../api";
import { Truncate, Ticker } from "../Helpers/Truncate";
import { Colors } from "../../constants";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';

var { width, height } = Dimensions.get("window");

const toRight = width - 45;

const PlayerWidget = () => {
  const { isError, errorMessage } = useErrorState(); //Use global soundObj from Redux state
  const [song, setSong] = useState(null);
  const [xy, setXY] = useState(new Animated.ValueXY(0));
  const errorDispatch = useErrorDispatch();
  const [sideState, setSideState] = useState(true);
  const [show, setShow] = useState(isError)
  const insets = useSafeAreaInsets();

  const onSwipeUp = async (gestureState) => {
    Animated.spring(xy, {
      toValue: { x: xy.x, y: -200 },
      useNativeDriver: true,
    }).start();
    setShow(false)
  };

  const resetX = () => {
    Animated.spring(xy, {
      toValue: { x: 0, y: xy.y },
      useNativeDriver: true,
    }).start();
    setSideState(false);
  };

  const onSwipeRight = (gestureState) => {
    Animated.spring(xy, {
      toValue: { x: width - 50, y: xy.y },
      useNativeDriver: true,
    }).start();
    setSideState(true);
  };

  useEffect(() => {
    if(show) {
      Animated.spring(xy, {
        toValue: { x: xy.x, y: 0 },
        useNativeDriver: true,
      }).start();
    }
    else{
      errorDispatch({type: 'CLEAR_ERROR'})
    }
  },[show])

  useEffect(() => {
    setShow(isError)
  }, [isError]);

  // useEffect(() => {
  //   async function getTrack() {
  //     const res = await getTrackDetailsAPI(trackId);
  //     setSong(res.data.tracks[0]);
  //   }
  //   if (trackId) getTrack();
  // }, [isError]);

  const getImage = (albumId) => {
    return `https://api.napster.com/imageserver/v2/albums/${albumId}/images/500x500.jpg`;
  };

  const blank =
    "https://www.publicdomainpictures.net/pictures/30000/velka/plain-white-background.jpg";

  async function doPlay() {
    if (isPlaying) {
      //if current post is playing
      await soundObj.pauseAsync();
      playerDispatch({ type: "PAUSE" });
    } else {
      // setLoadingPlayer(true);
      // await loadSound();
      // setLoadingPlayer(false);
      await soundObj.playAsync();
      playerDispatch({ type: "PLAY" });
    }
  }

  const config = {
    velocityThreshold: 0.2,
    directionalOffsetThreshold: 20,
  };

  useEffect(() => {
    console.log(xy.y)
  }, [xy.y]);

  if (!show) return <></>;
  return (
    <GestureRecognizer
      onSwipeUp={(state) => onSwipeUp(state)}
      // onSwipeRight={(state) => onSwipeRight(state)}
      config={config}
      style={{}}
    >
      <Animated.View
        style={[
          styles.container,
          { top: insets.top - height },
          { transform: xy.getTranslateTransform() },
        ]}
      >
        <View style={styles.row}>
          <MaterialIcons name="error-outline" size={45} color={Colors.FG} />
          <View style={{marginLeft: 20}}>
            <Text style={{color: Colors.text }}>{errorMessage}</Text>
          </View>
        </View>
      </Animated.View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "maroon",
    width: "100%",
    opacity: 1,
    borderRadius: 10,
    height: 60
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

export default PlayerWidget;
