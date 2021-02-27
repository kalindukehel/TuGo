import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
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
  pushNotification as pushNotificationAPI,
  getPosts as getPostsAPI,
  deletePost as deletePostAPI,
} from "../../api";
import { useAuthState } from "../../context/authContext";
import { usePlayerState, usePlayerDispatch } from "../../context/playerContext";
import { API_URL } from "../../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import moment from "moment";
import ImageModal from "react-native-image-modal";
import * as Haptics from "expo-haptics";
import RBSheet from "react-native-raw-bottom-sheet";

import { Audio } from "expo-av";
import { Slider } from "react-native-elements";

//icons
import { Octicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import { WebView } from "react-native-webview";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import YoutubePlayer from "react-native-yt-player";
import Orientation from "react-native-orientation";
import TextTicker from "react-native-text-ticker";

var { width, height } = Dimensions.get("window");

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

//the height of each options tile (hamburger options)
const optionHeight = 60;

//PostComponent is a post by a user
export default SongBlock = (props) => {
  let tileColor = "#065581";
  const { soundObj } = usePlayerState(); //Use global soundObj from Redux state
  const { postId, authorId, navigation } = props;
  const { userToken, self } = useAuthState();
  const { playingId, stopAll } = usePlayerState();
  const playerDispatch = usePlayerDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState(null);
  const [allPost, setAllPost] = useState(null);
  const [likes, setLikes] = useState(null);
  const [comments, setComments] = useState(null);
  const [tiles, setTiles] = useState(null);
  const [author, setAuthor] = useState(null);
  const [maxlimit, setMaxlimit] = useState(95);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelf, setIsSelf] = useState(false);

  const insets = useSafeAreaInsets();

  //push notifications expo
  const notificationListener = useRef();
  const responseListener = useRef();

  const refRBSheet = useRef([]);
  const moreRef = useRef();
  const optionsRef = useRef();
  const stateRef = useRef();
  const isLoaded = useRef(false);
  const postRef = useRef();
  const playingIdRef = useRef();

  const firstRun = useRef(true);

  stateRef.current = isSeeking;

  async function getPostStates() {
    //Update post data from API
    const postRes = await getPostByIdAPI(userToken, postId);
    setPost(postRes.data);
    postRef.current = postRes.data;
    const likesRes = await getPostLikesAPI(userToken, postId);
    setLikes(likesRes.data);
    const commentsRes = await getPostCommentsAPI(userToken, postId);
    setComments(commentsRes.data);
    const authorRes = await getAccountByIdAPI(postRes.data.author, userToken);
    setAuthor(authorRes.data);
    const tilesRes = await getPostTilesAPI(userToken, postId);
    setTiles(tilesRes.data);
    const favRes = await getPostFavoriteAPI(userToken, postId);
    setIsFavorite(favRes.data.favorited);
    const postsState = await getPostsAPI(userToken, self.id);
    const postIds = postsState.data.map((item) => item.id);
    setIsSelf(postIds.includes(postRes.data.id));
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
    let isMounted = true;
    if (isMounted) onRefresh();
    return () => {
      //When component exits
      try {
        if (postRef.current.id == playingIdRef.current && isMounted) {
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

  async function getLikesStates() {
    const likesRes = await getPostLikesAPI(userToken, postId);
    setLikes(likesRes.data);
  }

  async function likePost() {
    const likeRes = await likePostAPI(userToken, postId);
    getLikesStates();
    console.log(likeRes.status);
    if (
      likeRes.status == 201 &&
      author.notification_token != self.notification_token
    ) {
      const notifRes = await pushNotificationAPI(
        author.notification_token,
        self.username,
        "like"
      );
    }
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
    post &&
    author && (
      <View style={{ flex: 1, marginVertical: 5 }}>
        <TouchableWithoutFeedback
          onPress={doPlay}
          onLongPress={() => {
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
              uri: post.soundcloud_art,
            }}
            imageStyle={{
              opacity: isPlaying ? 0.2 : 0.9,
              borderRadius: 20,
              flex: 1,
              paddingRight: 2,
              paddingLeft: 2,
              paddingBottom: 4,
            }}
            style={{
              width: width / 2,
              height: width / 2,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                opacity: 0.8,
                height: 40,
                flexDirection: "column",
                paddingHorizontal: 10,
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
          </ImageBackground>
        </TouchableWithoutFeedback>
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
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#CDCDCD",
    alignSelf: "center",
  },
  moreButtonText: {
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
  scene: {
    flex: 1,
  },
});
