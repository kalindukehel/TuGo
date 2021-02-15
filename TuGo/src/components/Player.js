import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  setSoundCloudAudio as setSoundCloudAudioAPI,
  getAudioLink as getAudioLinkAPI,
  getSoundCloudSearch as getSoundCloudSearchAPI,
} from "../api";
import { useAuthState } from "../context/authContext";
import { usePlayerState, usePlayerDispatch } from "../context/playerContext";

import ImageModal from "react-native-image-modal";

import { Audio } from "expo-av";
import { Slider } from "react-native-elements";

//icons

import { Entypo } from "@expo/vector-icons";

import TextTicker from "react-native-text-ticker";
var { width } = Dimensions.get("window");
Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

//Player Component used by PostComponent and Search Results
const Player = (props) => {
  const { soundObj, playingId, stopAll } = usePlayerState(); //Use global soundObj from Redux state
  const playerDispatch = usePlayerDispatch();
  const {
    id,
    soundCloudArt,
    artist,
    songName,
    url,
    refreshing,
    soundCloudSearchQuery,
    isPlaying,
    setIsPlaying,
  } = props;

  const [isSeeking, setIsSeeking] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  const stateRef = useRef();

  const playingIdRef = useRef();
  const isLoaded = useRef(false);
  const { userToken } = useAuthState();

  stateRef.current = isSeeking;

  const loadSound = async () => {
    const sound_url = (
      await getAudioLinkAPI(url)
        .then((result) => {
          return result;
        })
        .catch(
          (error = async () => {
            const searchData = (
              await getSoundCloudSearchAPI(
                soundCloudSearchQuery ? soundCloudSearchQuery : "Popstar Drake"
              ).then((result) => result.data)
            ).collection[0].media.transcodings[0].url;
            const tempSoundUrl = await getAudioLinkAPI(searchData).then(
              (result) => result.data.url
            );
            if (tempSoundUrl) {
              setSoundCloudAudioAPI(searchData, userToken, id);
            }
            return {
              data: {
                url: tempSoundUrl,
              },
            };
          })
        )
    ).data.url;
    try {
      if (!(await soundObj.getStatusAsync()).isLoaded && sound_url) {
        await soundObj.loadAsync({ uri: sound_url });
        isLoaded.current = true;
        playerDispatch({ type: "LOAD_PLAYER", id: id });
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
    let isMounted = true;
    return () => {
      //When component exits
      try {
        if (id == playingIdRef.current && isMounted) {
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

  useEffect(() => {
    playingIdRef.current = playingId;
  }, [playingId]);

  useEffect(() => {
    setIsPlaying(false);
  }, [stopAll]);

  async function doPlay() {
    try {
      /* if current post is different from current playing */
      if (id != playingIdRef.current) {
        playerDispatch({ type: "UNLOAD_PLAYER" });
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
    if (id == playingIdRef.current) {
      const playerStatus = await soundObj.getStatusAsync();
      await soundObj.setStatusAsync({
        positionMillis: playerStatus.durationMillis * args,
      });
    }
    setIsSeeking(false);
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <ImageBackground
        source={{
          uri: soundCloudArt,
        }}
        imageStyle={{
          opacity: 0.3,
        }}
        style={{
          width: width,
          height: 80,
          // backgroundColor: tileColor,
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
                uri: soundCloudArt,
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
            <TextTicker
              style={{
                color: "black",
                height: 20,
              }}
              duration={7000}
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
              shouldAnimateTreshold={40}
            >
              {artist}
            </TextTicker>
            <TextTicker
              style={{
                color: "black",
                fontWeight: "bold",
                height: 20,
              }}
              duration={7000}
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
              shouldAnimateTreshold={40}
            >
              {songName}
            </TextTicker>
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
          minimumTrackTintColor="black"
          maximumTrackTintColor="#C4C4C4"
          onSlidingStart={seekSliding}
          onSlidingComplete={seekComplete}
          thumbStyle={{ width: 15, height: 15 }}
          thumbTintColor="black"
          value={sliderValue}
          disabled={refreshing ? true : false}
        />
        <TouchableOpacity
          disabled={refreshing ? true : false}
          onPress={() => {
            doPlay(id);
          }}
          style={{ marginLeft: "auto", marginRight: 10 }}
        >
          {isPlaying ? (
            <Entypo name="controller-paus" size={35} color="black" />
          ) : (
            <Entypo name="controller-play" size={35} color="black" />
          )}
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default Player;
