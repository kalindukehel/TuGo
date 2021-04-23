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
import { usePlayerState, usePlayerDispatch } from "../context/playerContext";
import { getTrackDetails as getTrackDetailsAPI } from "../api";
import { Truncate, Ticker } from "../Helpers/Truncate";
import { Colors } from "../../constants";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

var { width, height } = Dimensions.get("window");

const toRight = width - 45;

const PlayerWidget = () => {
  const { isPlaying, trackId, soundObj, url } = usePlayerState(); //Use global soundObj from Redux state
  const [song, setSong] = useState(null);
  const [xy, setXY] = useState(new Animated.ValueXY(0));
  const playerDispatch = usePlayerDispatch();
  const [sideState, setSideState] = useState(true);

  const insets = useSafeAreaInsets();

  const onSwipeDown = async (gestureState) => {
    Animated.spring(xy, {
      toValue: { x: xy.x, y: 200 },
      useNativeDriver: true,
    }).start();
    if (isPlaying) {
      await soundObj.pauseAsync();
      playerDispatch({ type: "PAUSE" });
    }
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
    Animated.spring(xy, {
      toValue: { x: xy.x, y: 0 },
      useNativeDriver: true,
    }).start();
  }, [trackId]);

  useEffect(() => {
    async function getTrack() {
      const res = await getTrackDetailsAPI(trackId);
      setSong(res.data.tracks[0]);
    }
    if (trackId) getTrack();
  }, [trackId]);

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

  if (!url) return <></>;

  return (
    <GestureRecognizer
      // onSwipeDown={(state) => onSwipeDown(state)}
      onSwipeRight={(state) => onSwipeRight(state)}
      config={config}
      style={{}}
    >
      <Animated.View
        style={[
          styles.container,
          { bottom: 49 + insets.bottom },
          { transform: xy.getTranslateTransform() },
        ]}
      >
        <View style={styles.row}>
          <TouchableWithoutFeedback onPress={resetX}>
            <Image
              source={{ uri: song ? getImage(song.albumId) : blank }}
              style={styles.image}
            />
          </TouchableWithoutFeedback>
          <View style={styles.rightContainer}>
            <View style={styles.nameContainer}>
              <Ticker
                string={song ? song.name : ""}
                style={{ ...styles.title, marginTop: 5 }}
              />
              <Ticker
                string={song ? song.artistName : ""}
                style={styles.artist}
              />
            </View>

            <View style={styles.iconsContainer}>
              <AntDesign name="pluscircle" size={20} color={Colors.FG} />
              <TouchableOpacity onPress={doPlay}>
                <FontAwesome
                  name={isPlaying ? "pause" : "play"}
                  size={20}
                  color={Colors.FG}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: Colors.gray,
    width: "100%",
    opacity: 0.9,
    borderRadius: 10,
  },
  progress: {
    height: 3,
    backgroundColor: "#bcbcbc",
  },
  row: {
    flexDirection: "row",
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
