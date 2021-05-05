import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
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
import TextTicker from "react-native-text-ticker";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "../../constants";

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

//SearchItem Component for CreatePost Screen
const Player = (props) => {
  const { soundObj } = usePlayerState(); //Use global soundObj from Redux state
  const {
    index,
    coverArt,
    artist,
    title,
    audioLink,
    color,
    artistId,
    navigation,
    isSeeking,
    setIsSeeking,
  } = props;
  let tileColor = color ? color : "#ffffff00";
  const { playingId, stopAll, isPlaying, trackId } = usePlayerState();
  const playerDispatch = usePlayerDispatch();

  const [refreshing, setRefreshing] = useState(false);
  // const [isSeeking, setIsSeeking] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [loadingPlayer, setLoadingPlayer] = useState(false);

  const stateRef = useRef();
  const isLoaded = useRef(false);
  const playingIdRef = useRef();

  const loadSound = async () => {
    const sound_url = audioLink;
    try {
      if (!(await soundObj.getStatusAsync()).isLoaded && sound_url) {
        const res = await soundObj.loadAsync({
          uri: sound_url,
        });
        isLoaded.current = true;
        playerDispatch({
          type: "LOAD_PLAYER",
          id: index,
          trackId: props.trackId,
          url: audioLink,
        });
        await soundObj.setProgressUpdateIntervalAsync(1000);
        await soundObj.setOnPlaybackStatusUpdate(async (status) => {
          if (isLoaded.current) {
            if (status.didJustFinish && status.isLoaded) {
              playerDispatch({ type: "PAUSE" });
              soundObj.stopAsync();
            } else if (status.isLoaded && stateRef.current != true) {
              setSliderValue(status.positionMillis / status.durationMillis);
            }
          }
        });
      }
    } catch (error) {
      console.log("error");
    }
  };

  // useEffect(() => {
  //   return () => {
  //     //When component exits
  //     try {
  //       if (index == playingIdRef.current) {
  //         //If current playing song is same as current post
  //         // setIsPlaying(false);
  //         isLoaded.current = false;
  //         soundObj.unloadAsync();
  //         playerDispatch({ type: "UNLOAD_PLAYER" });
  //       }
  //     } catch (error) {
  //       console.log("Error");
  //     }
  //   };
  // }, []);

  //Stop playing if redux global state is set to false
  // useEffect(() => {
  //   setIsPlaying(false);
  // }, [stopAll]);

  //Change local ref state when playingId redux state changes
  useEffect(() => {
    playingIdRef.current = playingId;
  }, [playingId]);

  async function doPlay() {
    try {
      //If current post is different from current playing, unload player and load new
      if (index != playingIdRef.current) {
        playerDispatch({ type: "UNLOAD_PLAYER" });
        await soundObj.unloadAsync();
        setLoadingPlayer(true);
        await loadSound();
        setLoadingPlayer(false);
        //If new song is starting and user has pre-set slider value
        if (sliderValue != 0) {
          const playerStatus = await soundObj.getStatusAsync();
          //Start from pre-set slider value
          await soundObj.setStatusAsync({
            positionMillis: playerStatus.durationMillis * sliderValue,
          });
        }
        await soundObj.playAsync();
        playerDispatch({ type: "PLAY" });
      } else {
        if (isPlaying && trackId === props.trackId) {
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
    } catch (error) {
      console.log(error);
    }
  }
  async function seekSliding() {
    playerDispatch({
      type: "SEEKING",
    });
  }

  async function seekComplete(args) {
    setSliderValue(args);
    //Change song player position only if player is playing the song to which the slider corresponds
    if (playingIdRef.current == index) {
      const playerStatus = await soundObj.getStatusAsync();
      await soundObj.setStatusAsync({
        positionMillis: playerStatus.durationMillis * args,
      });
    }
    playerDispatch({
      type: "STOP_SEEKING",
    });
  }
  stateRef.current = isSeeking;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        ...props.styles,
      }}
    >
      <View
        style={{
          width: width,
          height: 100,
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
                uri: coverArt,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              marginLeft: 20,
              marginTop: 15,
              width: 220,
              marginBottom: 30,
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                if (artistId && artistId != "") {
                  navigation.push("Artist", {
                    artist: artistId,
                    image: coverArt,
                  });
                }
              }}
            >
              <TextTicker
                style={{
                  height: 20,
                  color: Colors.text,
                }}
                duration={7000}
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
                shouldAnimateTreshold={40}
              >
                {artist}
              </TextTicker>
            </TouchableWithoutFeedback>

            <TextTicker
              style={{
                fontWeight: "bold",
                height: 20,
                color: Colors.text,
              }}
              duration={7000}
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
              shouldAnimateTreshold={40}
            >
              {title.length > 32 ? title.substring(0, 32 - 3) + "..." : title}
            </TextTicker>
          </View>
        </View>
        <Slider
          style={{
            marginLeft: "20%",
            width: "55%",
            alignSelf: "flex-end",
            position: "absolute",
            height: 30,
          }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={"white"}
          maximumTrackTintColor={"black"}
          onSlidingStart={seekSliding}
          onSlidingComplete={seekComplete}
          thumbStyle={{
            width: 10,
            height: 10,
          }}
          thumbTintColor={Colors.BG}
          value={sliderValue}
          disabled={refreshing ? true : false}
          trackStyle={{ height: 3 }}
        />
        {loadingPlayer ? (
          <View style={{ marginLeft: "auto", marginRight: 10 }}>
            <ActivityIndicator
              animating={true}
              size="large"
              color={Colors.FG}
            />
          </View>
        ) : (
          <TouchableOpacity
            disabled={refreshing ? true : false}
            onPress={doPlay}
            style={{ marginLeft: "auto", marginRight: 10 }}
          >
            {isPlaying && trackId === props.trackId ? (
              <Entypo name="controller-paus" size={35} color={Colors.FG} />
            ) : (
              <Entypo name="controller-play" size={35} color={Colors.FG} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.BG,
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
    borderRadius: 999,
  },
  scene: {
    flex: 1,
  },
});

export default Player;
