import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  getPostById as getPostByIdAPI,
  setSoundCloudAudio as setSoundCloudAudioAPI,
  getPostFavorite as getPostFavoriteAPI,
  favoritePost as favoritePostAPI,
  getAudioLink as getAudioLinkAPI,
  getSoundCloudSearch as getSoundCloudSearchAPI,
} from "../api";
import { useAuthState } from "../context/authContext";
import { usePlayerState, usePlayerDispatch } from "../context/playerContext";
import { Colors } from "../../constants";

//components
import Player from "../components/Player";
import * as Haptics from "expo-haptics";
import GText from "./GText"
import { Audio } from "expo-av";

//icons
import { AntDesign } from "@expo/vector-icons";

var { width } = Dimensions.get("window");

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

//SongTile component for Favorites Screen
const FavoritesTile = (props) => {
  const { soundObj } = usePlayerState(); //Use global soundObj from Redux state
  const { postId, navigation, isSeeking, setIsSeeking } = props;
  const { userToken } = useAuthState();
  const { playingId, stopAll } = usePlayerState();
  const playerDispatch = usePlayerDispatch();

  const [, setRefreshing] = useState(false);
  const [post, setPost] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const stateRef = useRef();
  const isLoaded = useRef(false);
  const postRef = useRef();
  const playingIdRef = useRef();

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
    const favRes = await favoritePostAPI(userToken, postId);
    if (favRes.status === 201) setIsFavorite(!isFavorite);
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

  return (
    post && (
      <ImageBackground
        source={{
          uri: post.album_cover,
        }}
        imageStyle={{
          opacity: 0.3,
          backgroundColor: "#ffffff00",
          borderRadius: 20,
          borderColor: Colors.FG,
          borderWidth: 1,
        }}
        style={{
          width: width,
          marginBottom: 10,
          paddingBottom: 20,
        }}
      >
        <Player
          index={post.id}
          coverArt={post.album_cover}
          artist={post.song_artist}
          title={post.song_name}
          audioLink={post.audio_url}
          artistId={post.artist_id}
          navigation={navigation}
          isSeeking={isSeeking}
          setIsSeeking={setIsSeeking}
          trackId={post.song_id}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 10 }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              favoritePost();
            }}
          >
            {isFavorite ? (
              <AntDesign name="pluscircle" size={25} color={Colors.FG} />
            ) : (
              <AntDesign name="pluscircleo" size={25} color={Colors.FG} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewPostButton}
            onPress={() => {
              playerDispatch({ type: "UNLOAD_PLAYER" });
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
            <GText style={styles.viewPostButtonText}>View Post</GText>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    )
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.BG,
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

export default FavoritesTile;
