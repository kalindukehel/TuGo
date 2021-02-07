import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  getPostById as getPostByIdAPI,
  getPostLikes as getPostLikesAPI,
  getPostComments as getPostCommentsAPI,
  getAccountById as getAccountByIdAPI,
  getPostTiles as getPostTilesAPI,
  likePost as likePostAPI,
  setSoundCloudAudio as setSoundCloudAudioAPI,
  getPostFavorite as getPostFavoriteAPI,
  favoritePost as favoritePostAPI,
  getAudioLink as getAudioLinkAPI,
  getSoundCloudSearch as getSoundCloudSearchAPI,
} from "../api";
import { useAuthState } from "../context/authContext";
import { usePlayerState, usePlayerDispatch } from "../context/playerContext";
import { API_URL } from "../../constants";

import ImageModal from "react-native-image-modal";
import * as Haptics from "expo-haptics";
import TextTicker from "react-native-text-ticker";
// import Modal from 'react-native-modal';

import { Audio } from "expo-av";

import { Slider } from "react-native-elements";
import PostComponent from "./PostComponent";

//icons
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

var { width, height } = Dimensions.get("window");

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

//SongTile component for Favorites Screen
const SongTile = (props) => {
  let tileColor = "#065581";
  const { soundObj } = usePlayerState(); //Use global soundObj from Redux state
  const { postId, navigation } = props;
  const { userToken } = useAuthState();
  const { playingId, stopAll } = usePlayerState();
  const playerDispatch = usePlayerDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const stateRef = useRef();
  const isLoaded = useRef(false);
  const postRef = useRef();
  const playingIdRef = useRef();

  stateRef.current = isSeeking;

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      async function getPostStates() {
        const postRes = await getPostByIdAPI(userToken, postId);
        setPost(postRes.data);
        postRef.current = postRes.data;
        const favRes = await getPostFavoriteAPI(userToken, postId);
        setIsFavorite(favRes.data.favorited);
      }
      await getPostStates();
      setRefreshing(false);
    } catch (e) {
      console.log(e);
    }
  };

  const loadSound = async () => {
    const sound_url = (
      await getAudioLinkAPI(postRef.current.soundcloud_audio)
        .then((result) => result)
        .catch(
          (error = async () => {
            const searchData = (
              await getSoundCloudSearchAPI(
                postRef.current.soundcloud_search_query
              ).then((result) => result.data)
            ).collection[0].media.transcodings[0].url;
            const tempSoundUrl = await getAudioLinkAPI(searchData).then(
              (result) => result.data.url
            );
            if (tempSoundUrl) {
              setSoundCloudAudioAPI(searchData, userToken, postId);
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
        playerDispatch({ type: "LOAD_PLAYER", id: postRef.current.id });
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
    onRefresh();
    return () => {
      //When component exits
      try {
        if (postRef.current.id == playingIdRef.current) {
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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const postRes = await getPostByIdAPI(userToken, postId);
      setPost(postRes.data);
      const favRes = await getPostFavoriteAPI(userToken, postId);
      setIsFavorite(favRes.data.favorited);
    });

    return unsubscribe;
  }, [navigation]);

  async function favoritePost() {
    const likeRes = await favoritePostAPI(userToken, postId);
    const favRes = await getPostFavoriteAPI(userToken, postId);
    setIsFavorite(favRes.data.favorited);
  }

  async function doPlay() {
    try {
      /* if current post is different from current playing */
      if (postRef.current.id != playingIdRef.current) {
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
    if (postRef.current.id == playingIdRef.current) {
      const playerStatus = await soundObj.getStatusAsync();
      await soundObj.setStatusAsync({
        positionMillis: playerStatus.durationMillis * args,
      });
    }
    setIsSeeking(false);
  }

  return (
    post && (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ImageBackground
            source={{
              uri: post.soundcloud_art,
            }}
            imageStyle={{
              opacity: 0.3,
            }}
            style={{
              width: width,
              height: 80,
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 20,
              borderTopRightRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <View
                style={
                  isPlaying
                    ? styles.imageViewPlaying
                    : styles.imageViewNotPlaying
                }
              >
                <ImageModal
                  resizeMode="contain"
                  imageBackgroundColor="#00000000"
                  style={styles.image}
                  source={{
                    uri: post.soundcloud_art,
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
                  {post.song_artist}
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
                  {post.song_name}
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
              onPress={doPlay}
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
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 10 }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              favoritePost();
            }}
          >
            {isFavorite ? (
              <AntDesign name="pluscircle" size={25} color="black" />
            ) : (
              <AntDesign name="pluscircleo" size={25} color="black" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewPostButton}
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
            <Text style={styles.viewPostButtonText}>View Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  viewPostButton: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#CDCDCD",
    alignSelf: "center",
    marginTop: 10,
  },
  viewPostButtonText: {
    alignSelf: "center",
    color: "black",
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
  song: {
    width: "100%",
    height: 80,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "flex-end",
  },
});

export default SongTile;
