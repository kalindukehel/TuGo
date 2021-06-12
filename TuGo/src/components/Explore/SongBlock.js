import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { getPostById as getPostByIdAPI } from "../../api";
import { useAuthState } from "../../context/authContext";
import { usePlayerState, usePlayerDispatch } from "../../context/playerContext";
import * as Haptics from "expo-haptics";
import { Colors } from "../../../constants";
import { Audio } from "expo-av";

import TextTicker from "react-native-text-ticker";

//icons
import { Entypo } from "@expo/vector-icons";

var { width } = Dimensions.get("window");

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

//the height of each options tile (hamburger options)
const optionHeight = 60;

//PostComponent is a post by a user
export default SongBlock = (props) => {
  let tileColor = "#065581";
  const { soundObj } = usePlayerState(); //Use global soundObj from Redux state
  const { postId, navigation, columns } = props;
  const { userToken } = useAuthState();
  const { playingId, stopAll, trackId } = usePlayerState();
  const playerDispatch = usePlayerDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const stateRef = useRef();
  const isLoaded = useRef(false);
  const postRef = useRef();
  const playingIdRef = useRef();

  const firstRun = useRef(true);

  stateRef.current = isSeeking;

  async function getPostStates() {
    //Update post data from API
    setRefreshing(true);
    const postRes = await getPostByIdAPI(userToken, postId);
    setPost(postRes.data);
    postRef.current = postRes.data;
    setRefreshing(false);
  }

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await getPostStates();
      setRefreshing(false);
    } catch (e) {
      console.log(e);
    }
  };

  const loadSound = async () => {
    const sound_url = postRef.current.audio_url;
    try {
      if (!(await soundObj.getStatusAsync()).isLoaded && sound_url) {
        const res = await soundObj.loadAsync({
          uri: sound_url,
        });
        isLoaded.current = true;
        playerDispatch({
          type: "LOAD_PLAYER",
          id: postRef.current.id,
          trackId: postRef.current.song_id,
          url: postRef.current.audio_url,
        });
        await soundObj.setProgressUpdateIntervalAsync(1000);
        await soundObj.setOnPlaybackStatusUpdate(async (status) => {
          if (isLoaded.current) {
            if (status.didJustFinish && status.isLoaded) {
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

  useEffect(() => {
    let isMounted = true;
    if (isMounted) onRefresh();
    return () => {
      //When component exits
      try {
        if (postRef.current.id == playingIdRef.current && isMounted) {
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

  useEffect(() => {
    playingIdRef.current = playingId;
  }, [playingId]);

  React.useEffect(() => {
    //When navigation is changed update the post states
    const unsubscribe = navigation.addListener("focus", async () => {
      if (firstRun.current) {
        firstRun.current = false;
      } else {
        await getPostStates();
      }
    });

    return unsubscribe;
  }, [navigation]);

  async function doPlay() {
    try {
      //If current post is different from current playing, unload player and load new
      if (postRef.current.id != playingIdRef.current) {
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
        if (isPlaying && trackId === post.song_id) {
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

  return (
    post && (
      <View style={{ flex: 1, marginVertical: 5 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            isPlaying && doPlay(); //if sound is playing toggle it off when going to a profile
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.push("Post", {
              screen: "Post",
              params: {
                postId: postId,
              },
            });
          }}
        >
          <ImageBackground
            source={{
              uri: post.album_cover,
            }}
            imageStyle={{
              opacity: isPlaying && trackId === post.song_id ? 0.2 : 0.9,
              borderRadius: 20,
              flex: 1,
              paddingRight: 2,
              paddingLeft: 2,
            }}
            style={{
              width: width / columns,
              height: width / columns,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: Colors.BG,
                opacity: 0.8,
                height: 40,
                flexDirection: "row",
                paddingLeft: 15,
                borderRadius: 20,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <TextTicker
                  style={{
                    color: Colors.text,
                    height: 20,
                  }}
                  duration={7000}
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={1000}
                  shouldAnimateTreshold={40}
                >
                  {post.song_artist}
                </TextTicker>
                <TextTicker
                  style={{
                    color: Colors.text,
                    fontWeight: "bold",
                    height: 20,
                  }}
                  duration={7000}
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={1000}
                  shouldAnimateTreshold={40}
                >
                  {post.song_name}
                </TextTicker>
              </View>
              {loadingPlayer ? (
                <View style={{ marginLeft: "auto", marginRight: 10 }}>
                  <ActivityIndicator animating={true} color={Colors.FG} />
                </View>
              ) : (
                <TouchableOpacity
                  disabled={refreshing ? true : false}
                  onPress={doPlay}
                  style={{ marginLeft: "auto", marginRight: 10 }}
                >
                  {isPlaying && trackId === post.song_id ? (
                    <Entypo
                      name="controller-paus"
                      size={25}
                      color={Colors.FG}
                    />
                  ) : (
                    <Entypo
                      name="controller-play"
                      size={25}
                      color={Colors.FG}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  moreButton: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#CDCDCD",
    alignSelf: "center",
  },
  moreButtonText: {
    alignSelf: "center",
    color: Colors.text,
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
