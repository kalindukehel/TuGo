import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Slider } from "react-native-elements";
import ImageModal from "react-native-image-modal";
var { width, height } = Dimensions.get("window");
import { usePlayerState, usePlayerDispatch } from "../context/playerContext";
import { Audio } from "expo-av";
import { Colors, Length } from "../../constants";
import { Ticker, Truncate } from "../Helpers/Truncate";
import { getTrackDetails as getTrackDetailsAPI } from "../api"
import GText from "./GText"

//icons
import {
  AntDesign,
  Entypo
} from "@expo/vector-icons";

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

//SearchItem Component for CreatePost Screen
const SearchItem = (props) => {
  const { soundObj } = usePlayerState(); //Use global soundObj from Redux state
  const {
    index,
    coverArt,
    selected,
    selectItem,
    artist,
    title,
    audioLink,
    color,
    genre,
    artistId,
    postable,
    navigation,
    setDisableScroll,
  } = props;
  let tileColor = color ? color : "#ffffff00";
  const { playingId, stopAll, trackId } = usePlayerState();
  const playerDispatch = usePlayerDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [isExplicit, setIsExplicit] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

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
              soundObj.stopAsync();
              setIsPlaying(false);
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

  useEffect(() => {
    async function getTrack () {
      const res = await getTrackDetailsAPI(index)
      setIsExplicit(res.data.tracks[0].isExplicit)
    }
    getTrack()
    return () => {
      //When component exits
      try {
        if (index == playingIdRef.current) {
          //If current playing song is same as current post
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
        setIsPlaying(true);
      } else {
        if (isPlaying && trackId === props.trackId) {
          //if current post is playing
          await soundObj.pauseAsync();
          setIsPlaying(false);
        } else {
          // setLoadingPlayer(true);
          // await loadSound();
          // setLoadingPlayer(false);
          await soundObj.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function seekSliding() {
    setIsSeeking(true);
    setDisableScroll && setDisableScroll(true);
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
    setIsSeeking(false);
    setDisableScroll && setDisableScroll(false);
  }
  stateRef.current = isSeeking;

  return (
    <TouchableWithoutFeedback
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => {
        selectItem
          ? selectItem(
              index,
              artist,
              audioLink,
              title,
              coverArt,
              genre,
              props.trackId,
              artistId
            )
          : {};
      }}
      activeOpacity={0.75}
    >
      <View
        style={{
          width: width,
          height: 80,
          backgroundColor: selected ? Colors.primaryDark : tileColor,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={
              isPlaying && trackId === props.trackId
                ? styles.imageViewPlaying
                : styles.imageViewNotPlaying
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
          <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'space-between', alignItems: 'center'}}>
            <View
              style={{
                flexDirection: "column",
                marginLeft: 20,
                marginTop: 15,
                width: '75%',
                marginBottom: 30,
              }}
            >
              <GText style={{color: Colors.text, fontWeight: "200"}}>
                {Truncate(artist, Length.song.artist)}
              </GText>
                <Ticker
                  string={title}
                  maxLength={Length.song.title}
                  style={{
                    fontWeight: "700",
                    color:
                      isPlaying && trackId === props.trackId
                        ? "#FF4343"
                        : Colors.text,
                  }}
                  isExplicit={isExplicit}
                />
            </View>
            {postable &&
            <TouchableWithoutFeedback
              onPress={() => {
                if (postable) {
                  playerDispatch({ type: "UNLOAD_PLAYER" });
                  navigation.navigate("Video Selection", {
                    song: {
                      id: index,
                      artist: artist,
                      audioLink: audioLink,
                      title: title,
                      coverArt: coverArt,
                      trackId: props.trackId,
                      artistId: artistId,
                      genre: genre,
                    },
                  });
                }
              }}
            >
              <AntDesign name="retweet" size={20} color={Colors.FG} />
            </TouchableWithoutFeedback>}
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
          maximumTrackTintColor={selected ? Colors.BG : Colors.FG}
          onSlidingStart={seekSliding}
          onSlidingComplete={seekComplete}
          thumbStyle={{
            width: 10,
            height: 10,
          }}
          thumbTintColor={Colors.FG}
          value={sliderValue}
          disabled={refreshing ? true : false}
          trackStyle={{ height: 1.5 }}
        />
        {loadingPlayer ? (
          <View style={{ marginLeft: "auto", marginRight: 20 }}>
            <ActivityIndicator
              animating={true}
              size="small"
              color={Colors.FG}
            />
          </View>
        ) : (
          <TouchableWithoutFeedback
            disabled={refreshing ? true : false}
            onPress={doPlay}
          >
            <View style={{ marginLeft: "auto", marginRight: 10}}>
              {isPlaying && trackId === props.trackId ? (
                <Entypo name="controller-paus" size={30} color={Colors.gray} />
              ) : (
                <Entypo name="controller-play" size={30} color={Colors.gray} />
              )}
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableWithoutFeedback>
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

export default SearchItem;
