import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ImageBackground,
  Share,
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
} from "../api";
import { useAuthState } from "../context/authContext";
import { usePlayerState, usePlayerDispatch } from "../context/playerContext";
import { API_URL } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Like from "../../assets/LikeButton.svg";
import DMButton from "../../assets/DMButton.svg";
import CommentsButton from "../../assets/CommentsButton.svg";

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
const PostComponent = (props) => {
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

  const onFullScreen = (fullScreen) => {
    if (fullScreen) {
      Orientation.lockToLandscape();
    }
  };

  //share button function to share posts cross-platforms
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `TuGo | ${self.username} shared ${author.username}'s Post`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        optionsRef.current.close();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  //tab view for more page
  const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: "white" }]} />
  );

  const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: "white" }]} />
  );

  const ThirdRoute = () => (
    <View style={[styles.scene, { backgroundColor: "white" }]} />
  );

  const initialLayout = { width: Dimensions.get("window").width };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Dance Choreos" },
    { key: "second", title: "Voice Covers" },
    { key: "third", title: "Lyrics" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "black" }}
      style={{ backgroundColor: "white" }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: "black" }}>{route.title}</Text>
      )}
    />
  );

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

  async function getFavoriteStates() {
    const favRes = await getPostFavoriteAPI(userToken, postId);
    setIsFavorite(favRes.data.favorited);
  }

  async function favoritePost() {
    const likeRes = await favoritePostAPI(userToken, postId);
    getFavoriteStates();
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

  //delete confirmation alert function
  const deleteConfirmation = () =>
    Alert.alert(
      "Confirmation",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deletePost();
            optionsRef.current.close();
            if (navigation.canGoBack()) navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );

  //delete post async function
  const deletePost = async () => {
    const res = await deletePostAPI(postId, userToken);
  };

  const renderTile = (tile) => {
    const curTile = tile.item;
    let vidLink = curTile.link.substr(curTile.link.length - 11);
    return (
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <TouchableOpacity
          style={{}}
          onPress={() => {
            refRBSheet.current[tile.index].open();
          }}
        >
          <Image
            style={{
              width: 100,
              height: 170,
              borderWidth: 3,
              borderColor: curTile.is_youtube ? "red" : "green",
              borderRadius: 10,
            }}
            source={{
              uri: curTile.image,
            }}
          />
        </TouchableOpacity>
        <RBSheet
          ref={(ref) => {
            //set RBSheet array index equal to this object
            refRBSheet.current[tile.index] = ref;
          }}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            draggableIcon: {
              backgroundColor: "#000",
            },
            container: {
              marginBottom: insets.bottom,
              backgroundColor: "#DCDCDC",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
          }}
        >
          {/* <View style={{ flex: 1, maxHeight: "100%", backgroundColor: "red" }}> */}
          {/* <WebView
              style={{ flex: 1, borderColor: "black" }}
              javaScriptEnabled={true}
              scrollEnabled={false}
              allowsInlineMediaPlayback={true}
              source={{
                uri: curTile.link,
              }}
            /> */}
          <YoutubePlayer
            loop
            videoId={vidLink}
            onStart={() => console.log("onStart")}
            onEnd={() => alert("on End")}
            onFullScreen={onFullScreen}
          />
          {/* </View> */}
        </RBSheet>
      </View>
    );
  };

  return (
    post &&
    author && (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              isPlaying && doPlay(); //if sound is playing toggle it off when going to a profile
              navigation.push("Profile", {
                id: author.id,
              });
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{
                  uri: author
                    ? author.profile_picture
                    : API_URL + "/media/default.jpg",
                }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 20,
                  marginRight: 5,
                }}
              ></Image>
              <Text style={{ fontWeight: "bold", color: "gray" }}>
                {author ? author.username : ""}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "gray" }}>
              {post ? moment(post.created_at).fromNow() : ""}
            </Text>
            <TouchableOpacity
              style={{
                paddingRight: 15,
                paddingLeft: 5,
                marginLeft: 10,
              }}
              onPress={() => {
                optionsRef.current.open();
              }}
            >
              <Octicons name="kebab-horizontal" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <RBSheet
            height={isSelf ? optionHeight * 2 : optionHeight * 2}
            ref={optionsRef}
            closeOnDragDown={false}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
              draggableIcon: {
                backgroundColor: "transparent",
              },
              container: {
                borderRadius: 20,
                marginBottom: insets.bottom || 20,
                width: 0.9 * width,
                alignSelf: "center",
              },
            }}
          >
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
              onPress={onShare}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Share
              </Text>
            </TouchableOpacity>
            {isSelf ? (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  backgroundColor: "#DCDCDC",
                }}
                onPress={deleteConfirmation}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  backgroundColor: "#DCDCDC",
                }}
                onPress={() => {}}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  Report
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
              onPress={() => {
                optionsRef.current.close();
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </RBSheet>
        </View>
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
        <View>
          <FlatList
            data={tiles}
            renderItem={renderTile}
            keyExtractor={(item, index) => item.id.toString()}
            horizontal={true}
          />
        </View>
        <View
          style={{
            margin: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                likePost();
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Like width={40} height={35} fill="red" />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              moreRef.current.open();
            }}
          >
            <Text style={styles.moreButtonText}>More</Text>
          </TouchableOpacity>
          <RBSheet
            height={0.8 * height}
            ref={moreRef}
            closeOnDragDown={true}
            closeOnPressMask={false}
            customStyles={{
              wrapper: {
                backgroundColor: "transparent",
              },
              draggableIcon: {
                backgroundColor: "#000",
              },
            }}
          >
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={renderTabBar}
            />
          </RBSheet>

          <TouchableOpacity
            style={{}}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (maxlimit == 95) setMaxlimit(10000);
              if (maxlimit == 10000) setMaxlimit(95);
            }}
          >
            <DMButton width={40} height={35} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => {
              navigation.push("Likes", {
                postId: post.id,
              });
            }}
          >
            <Text>
              {likes
                ? likes.length == 1
                  ? likes.length + ` like`
                  : likes.length + ` likes`
                : `loading`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginRight: 22 }}
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
        </View>

        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            marginVertical: 10,
          }}
        >
          <Text style={{ flexWrap: "wrap" }}>
            <Text style={{ fontWeight: "bold" }}>{author.username + `: `}</Text>
            <Text style={{}}>
              {post.caption.length > maxlimit
                ? post.caption.substring(0, maxlimit - 3) + "..."
                : post.caption}
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          style={{ marginLeft: 10, marginTop: 5 }}
          onPress={() => {
            navigation.push("Comments", {
              postId: post.id,
            });
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CommentsButton width={40} height={35} fill="#0ff" />
            <Text>{comments ? `${comments.length}` : `loading`}</Text>
          </View>
        </TouchableOpacity>
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

export default PostComponent;
