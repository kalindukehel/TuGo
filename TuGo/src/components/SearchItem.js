import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Slider } from "react-native-elements";
import ImageModal from "react-native-image-modal";
var { width, height } = Dimensions.get("window");
import Play from "../../assets/PlayButton.svg";
import Pause from "../../assets/PauseButton.svg";
import { useAuthState } from "../context/authContext";
import { usePlayerState, usePlayerDispatch } from "../context/playerContext";
import { Audio } from "expo-av";
import { getAudioLink as getAudioLinkAPI } from "../api";

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

//SearchItem Component for CreatePost Screen
const SearchItem = (props) => {
  let tileColor = "#E8E8E8";
  const { soundObj } = usePlayerState(); //Use global soundObj from Redux state
  const { postId, authorId, navigation } = props;
  const { playingId, stopAll } = usePlayerState();
  const playerDispatch = usePlayerDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  const stateRef = useRef();
  const isLoaded = useRef(false);
  const playingIdRef = useRef();

  const loadSound = async () => {
    const sound_url = (
      await getAudioLinkAPI(props.audioLink)
        .then((result) => result)
        .catch((e) => {
          console.log(e);
        })
    ).data.url;
    try {
      if (!(await soundObj.getStatusAsync()).isLoaded && sound_url) {
        await soundObj.loadAsync({ uri: sound_url });
        isLoaded.current = true;
        playerDispatch({ type: "LOAD_PLAYER", id: props.index });
        await soundObj.setProgressUpdateIntervalAsync(1000);
        await soundObj.setOnPlaybackStatusUpdate(async (status) => {
          if (isLoaded.current) {
            if (status.didJustFinish && status.isLoaded) {
              setIsPlaying(false);
              soundObj.stopAsync();
            } else if (status.isLoaded && stateRef.current != true) {
              setSliderValue(status.positionMillis / status.durationMillis);
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      //When component exits
      try {
        if (props.index == playingIdRef.current) {
          //If current playing song is same as current post
          setIsPlaying(false);
          isLoaded.current = false;
          soundObj.unloadAsync();
          playerDispatch({ type: "UNLOAD_PLAYER" });
        }
      } catch (error) {
        console.log("Error");
      }
    };
  }, []);

  //Stop playing if redux global state is set to false
  useEffect(() => {
    setIsPlaying(false);
  }, [stopAll]);

  //Change local ref state when playingId redux state changes
  useEffect(() => {
    playingIdRef.current = playingId;
  }, [playingId]);

  async function doPlay() {
    try {
      //If current post is different from current playing, unload player and load new
      if (props.index != playingIdRef.current) {
        playerDispatch({ type: "UNLOAD_PLAYER" });
        await soundObj.unloadAsync();
        await loadSound();
        //If new song is starting and user has pre-set slider value
        if (sliderValue != 0) {
          const playerStatus = await soundObj.getStatusAsync();
          //Start from pre-set slider value
          await soundObj.setStatusAsync({
            positionMillis: playerStatus.durationMillis * sliderValue,
          });
        }
        await soundObj.playAsync();
      } else {
        if (isPlaying) {
          //if current post is playing
          await soundObj.pauseAsync();
        } else {
          await loadSound();
          await soundObj.playAsync();
        }
      }

      setIsPlaying(!isPlaying);
    } catch (error) {
      console.log(error);
    }
  }
  async function seekSliding() {
    setIsSeeking(true);
  }

  async function seekComplete(args) {
    setSliderValue(args);
    //Change song player position only if player is playing the song to which the slider corresponds
    if (playingIdRef.current == props.index) {
      const playerStatus = await soundObj.getStatusAsync();
      await soundObj.setStatusAsync({
        positionMillis: playerStatus.durationMillis * args,
      });
    }
    setIsSeeking(false);
  }
  stateRef.current = isSeeking;

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => {
        props.selectItem(
          props.index,
          props.artist,
          props.audioLink,
          props.title,
          props.coverArt
        );
      }}
      activeOpacity={0.75}
    >
      <View
        style={{
          width: width,
          height: 80,
          backgroundColor: props.selected ? "purple" : tileColor,
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 20,
          borderTopRightRadius: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={
              isPlaying ? styles.imageViewPlaying : styles.imageViewNotPlaying
            }
          >
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor="#00000000"
              style={styles.image}
              source={{
                uri: props.coverArt,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              marginLeft: 20,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: props.selected ? "white" : "black" }}>
              {props.artist}
            </Text>
            <Text
              style={{
                color: props.selected ? "white" : "black",
                fontWeight: "bold",
              }}
            >
              {props.title.length > 32
                ? props.title.substring(0, 32 - 3) + "..."
                : props.title}
            </Text>
          </View>
        </View>
        <Slider
          style={{
            marginLeft: "20%",
            width: "55%",
            alignSelf: "flex-end",
            position: "absolute",
            height: 35,
          }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#C4C4C4"
          maximumTrackTintColor={props.selected ? "white" : "black"}
          onSlidingStart={seekSliding}
          onSlidingComplete={seekComplete}
          thumbStyle={{ width: 15, height: 15 }}
          thumbTintColor="#C4C4C4"
          value={sliderValue}
          disabled={refreshing ? true : false}
        />
        <TouchableOpacity
          disabled={refreshing ? true : false}
          onPress={doPlay}
          style={{ marginLeft: "auto", marginRight: 10 }}
        >
          {isPlaying ? (
            <Pause width={40} height={35} style={{ marginTop: "30%" }} />
          ) : (
            <Play width={40} height={45} style={{ marginTop: "30%" }} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  moreButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "gray",
    alignSelf: "center",
  },
  moreButtonText: {
    alignSelf: "center",
    color: "white",
  },
  imageViewNotPlaying: {
    marginLeft: 8,
  },
  imageViewPlaying: {
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  image: {
    width: 60,
    height: 60,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  scene: {
    flex: 1,
  },
});

export default SearchItem;
