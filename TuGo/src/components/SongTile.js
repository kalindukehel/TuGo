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
  processColor,
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
} from "../api";
import { useAuthState } from "../context/authContext";
import { usePlayerState, usePlayerDispatch } from "../context/playerContext";
import { API_URL } from "../../constants";

import Like from "../../assets/LikeButton.svg";
import Play from "../../assets/PlayButton.svg";
import Pause from "../../assets/PauseButton.svg";
import DMButton from "../../assets/DMButton.svg";
import CommentsButton from "../../assets/CommentsButton.svg";

import moment from "moment";
import ImageModal from "react-native-image-modal";
import * as Haptics from "expo-haptics";
// import Modal from 'react-native-modal';

import { Audio } from "expo-av";
import Axios from "axios";

import { Slider } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import PostComponent from "./PostComponent";

var { width, height } = Dimensions.get("window");

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

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
      await Axios.get(
        postRef.current.soundcloud_audio +
          "?client_id=HpnNV7hjv2C95uvBE55HuKBUOQGzNDQM"
      )
        .then((result) => result)
        .catch(
          (error = async () => {
            const searchData = (
              await Axios.get(
                "https://api-v2.soundcloud.com/search?q=" +
                  postRef.current.soundcloud_search_query +
                  "&variant_ids=&facet=model&user_id=448421-41791-230292-46720&client_id=HpnNV7hjv2C95uvBE55HuKBUOQGzNDQM&limit=20&offset=0&linked_partitioning=1&app_version=1607696603&app_locale=en"
              ).then((result) => result.data)
            ).collection[0].media.transcodings[0].url;
            const tempSoundUrl = await Axios.get(
              searchData + "?client_id=HpnNV7hjv2C95uvBE55HuKBUOQGzNDQM"
            ).then((result) => result.data.url);
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
    const playerStatus = await soundObj.getStatusAsync();
    await soundObj.setStatusAsync({
      positionMillis: playerStatus.durationMillis * args,
    });
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
          <View style={{ ...styles.song, backgroundColor: tileColor }}>
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
                  marginBottom: 20,
                }}
              >
                <Text style={{ color: "white" }}>{post.song_artist}</Text>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {post.song_name}
                </Text>
              </View>
            </View>
            <Slider
              style={{
                marginLeft: "20%",
                width: "50%",
                alignSelf: "flex-end",
                position: "absolute",
                height: 35,
                left: 20,
              }}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#C4C4C4"
              maximumTrackTintColor="white"
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
            style={styles.moreButton}
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
            <Text style={styles.moreButtonText}>View Post</Text>
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
  moreButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "gray",
    alignSelf: "center",
    marginTop: 10,
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
