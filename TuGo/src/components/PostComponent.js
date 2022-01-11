import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Share,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
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
  getSongLyrics as getSongLyricsAPI,
  songLyrics as songLyricsAPI,
  deleteTile as deleteTileAPI,
} from "../api";
import { useAuthState } from "../context/authContext";
import { usePlayerState, usePlayerDispatch } from "../context/playerContext";
import { API_URL } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FontAwesome, Foundation } from "@expo/vector-icons";

import moment from "moment";
import ImageModal from "react-native-image-modal";
import * as Haptics from "expo-haptics";
import RBSheet from "react-native-raw-bottom-sheet";

import { Audio, Video, AVPlaybackStatus } from "expo-av";
import { Slider } from "react-native-elements";
import YouTube from "react-native-youtube";

//icons
import {
  Octicons,
  FontAwesome5,
  AntDesign,
  Fontisto,
  Feather,
} from "@expo/vector-icons";

import { WebView } from "react-native-webview";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Orientation from "react-native-orientation";
import TextTicker from "react-native-text-ticker";
import Player from "./Player";
import { Colors } from "../../constants";
import DanceChoreosTabView from "../components/TabViews/DanceChoreosTabView";
import VoiceCoversTabView from "../components/TabViews/VoiceCoversTabView";
import {
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Carousel, { Pagination } from "react-native-snap-carousel";
import ShareToDirect from "../screens/Others/ShareToDirect";
import TileRender from "../screens/Others/TileRender";
import { useTilePlayerDispatch } from "../context/tilePlayerContext";
import PostedTile from "./PostedTile";
import GText from "./GText";
import ImageS3 from "./ImageS3";

var { width, height } = Dimensions.get("window");

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

//the height of each options tile (hamburger options)
const optionHeight = 60;

//PostComponent is a post by a user
const PostComponent = ({
  postId,
  authorId,
  navigation,
  setDisableScroll,
  goBackOnDelete = true,
}) => {
  let tileColor = "#065581";
  const { soundObj } = usePlayerState(); //Use global soundObj from Redux state
  const { userToken, self } = useAuthState();
  const { playingId, stopAll } = usePlayerState();
  const playerDispatch = usePlayerDispatch();
  const tilePlayerDispatch = useTilePlayerDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState(null);

  const [likes, setLikes] = useState(null);
  const [comments, setComments] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [author, setAuthor] = useState(null);
  const [maxlimit, setMaxlimit] = useState(95);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tileLoading, setTileLoading] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [status, setStatus] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);
  const [animatedTileValue, setAnimatedTileValue] = useState(
    new Animated.Value(0)
  );
  const [isSelf, setIsSelf] = useState(false);

  const insets = useSafeAreaInsets();

  const tileModal = useRef();
  const shareModal = useRef();
  const refRBSheet = useRef([]);
  const moreRef = useRef();
  const optionsRef = useRef();
  const isLoaded = useRef(false);
  const postRef = useRef();
  const playingIdRef = useRef();
  const tilesRef = useRef();

  async function getTileStates() {
    const tilesRes = await getPostTilesAPI(userToken, postId);
    setTiles(tilesRes.data);
  }

  async function getCommentStates() {
    const commentsRes = await getPostCommentsAPI(userToken, postId);
    setComments(commentsRes.data);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      getCommentStates();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    async function onRefresh() {
      if (isMounted) {
        try {
          isMounted && setRefreshing(true);
          //Update post data from API
          const postRes = await getPostByIdAPI(userToken, postId);
          isMounted && setPost(postRes.data);
          postRef.current = postRes.data;
          isMounted &&
            setIsSelf(postRes.data.author === self.id ? true : false);
          const likesRes = await getPostLikesAPI(userToken, postId);
          isMounted && setLikes(likesRes.data);
          const commentsRes = await getPostCommentsAPI(userToken, postId);
          isMounted && setComments(commentsRes.data);
          const authorRes = await getAccountByIdAPI(
            postRes.data.author,
            userToken
          );
          isMounted && setAuthor(authorRes.data);

          //waiting for tiles to load
          isMounted && setTileLoading(true);
          const tilesRes = await getPostTilesAPI(userToken, postId);
          isMounted && setTiles(tilesRes.data);
          isMounted && setTileLoading(false);

          const favRes = await getPostFavoriteAPI(userToken, postId);
          isMounted && setIsFavorite(favRes.data.favorited);
          // const postsState = await getPostsAPI(userToken, self.id);
          // const postIds = postsState.data.map((item) => item.id);
          // isMounted && setIsSelf(postIds.includes(postRes.data.id));
          isMounted && setRefreshing(false);
        } catch (e) {
          console.log(e);
        }
      }
    }

    if (isMounted) {
      onRefresh();
    }
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
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    playingIdRef.current = playingId;
  }, [playingId]);

  useEffect(() => {
    let isMounted = true;
    isMounted && setIsPlaying(false);
    return () => {
      isMounted = false;
    };
  }, [stopAll]);

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
  const initialLayout = { width: Dimensions.get("window").width };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Dance Choreos" },
    { key: "second", title: "Voice Covers" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <DanceChoreosTabView inCreatePost={false} song={post} />;
      case "second":
        return <VoiceCoversTabView inCreatePost={false} song={post} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: Colors.FG }}
      style={{ backgroundColor: Colors.BG }}
      renderLabel={({ route, focused, color }) => (
        <GText style={{ color: Colors.text }}>{route.title}</GText>
      )}
    />
  );

  async function getLikesStates() {
    const likesRes = await getPostLikesAPI(userToken, postId);
    setLikes(likesRes.data);
  }

  const isLiked = () => {
    const ids = likes.map((like) => like.author);
    return ids.includes(self.id);
  };

  async function likePost() {
    const likeRes = await likePostAPI(userToken, postId);
    getLikesStates();
    if (
      likeRes.status == 201 &&
      author.notification_token != self.notification_token
    ) {
      const notifRes = await pushNotificationAPI(
        author.notification_token,
        { creator: self.username },
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
            if (goBackOnDelete) navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );

  //delete post async function
  const deletePost = async () => {
    const res = await deletePostAPI(postId, userToken);
  };

  const renderTileTest = ({ item, index }) => {
    return (
      <View style={{ margin: (width - (3 * width) / 3.4) / 8 }}>
        <PostedTile
          isAuthor={isSelf}
          postId={postId}
          tile={item}
          getTileStates={getTileStates}
        />
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
              isPlaying && playerDispatch({ type: "UNLOAD_PLAYER" }); //if sound is playing toggle it off when going to a profile
              navigation.push("Profile", {
                id: author.id,
              });
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ImageS3
                accountId={author.id}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 20,
                  marginRight: 5,
                }}
              ></ImageS3>
              <GText style={{ fontWeight: "bold", color: Colors.text }}>
                {author ? author.username : ""}
              </GText>
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <GText style={{ color: Colors.text }}>
              {post ? moment(post.created_at).fromNow() : ""}
            </GText>
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
              <Octicons name="kebab-horizontal" size={24} color={Colors.FG} />
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
              <GText
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Share
              </GText>
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
                <GText
                  style={{
                    fontSize: 15,
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  Delete
                </GText>
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
                <GText
                  style={{
                    fontSize: 15,
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  Report
                </GText>
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
              <GText
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Cancel
              </GText>
            </TouchableOpacity>
          </RBSheet>
        </View>
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
            trackId={post.song_id}
            setDisableScroll={setDisableScroll}
          />
          <View>
            {tileLoading && post.video_count > 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: Math.ceil(post.video_count / 3) * (width / 5),
                  marginVertical: 10,
                }}
              >
                <ActivityIndicator
                  animating={true}
                  size="large"
                  color={Colors.FG}
                />
              </View>
            ) : (
              tiles && (
                <View>
                  <FlatList
                    contentContainerStyle={{
                      flexGrow: 1,
                      alignItems: "center",
                    }}
                    ref={tilesRef}
                    data={tiles}
                    renderItem={renderTileTest}
                    numColumns={3}
                    style={goBackOnDelete ? {} : { alignItems: "center" }}
                  />
                </View>
              )
            )}
          </View>
          {/* post action buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                width: 250,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  likePost();
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <FontAwesome5
                    name="fire"
                    size={25}
                    color={isLiked() ? "red" : Colors.FG}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{}}
                onPress={() => {
                  navigation.push("Comments", {
                    postId: post.id,
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome5 name="comment" size={25} color={Colors.FG} />
                  <GText style={{ color: Colors.text, marginLeft: 10 }}>
                    {comments ? `${comments.length}` : `loading`}
                  </GText>
                </View>
              </TouchableOpacity>

              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate("Video Selection", {
                    song: {
                      id: post.song_id,
                      artist: post.song_artist,
                      audioLink: post.audio_url,
                      title: post.song_name,
                      coverArt: post.album_cover,
                      trackId: post.song_id,
                      artistId: post.artist_id,
                      genre: post.song_tags,
                    },
                  });
                }}
              >
                <AntDesign name="retweet" size={25} color={Colors.FG} />
              </TouchableWithoutFeedback>

              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  shareModal.current.open();
                }}
              >
                <FontAwesome name="send" size={25} color={Colors.FG} />
              </TouchableOpacity>
              <RBSheet
                height={height}
                ref={shareModal}
                closeOnDragDown={false}
                closeOnPressMask={false}
                customStyles={{
                  wrapper: {
                    backgroundColor: "transparent",
                  },
                  draggableIcon: {
                    backgroundColor: "transparent",
                  },
                  container: {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <ShareToDirect shareItem={post} shareModal={shareModal} />
              </RBSheet>

              <RBSheet
                height={0.8 * height}
                ref={moreRef}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                  wrapper: {
                    backgroundColor: "transparent",
                  },
                  draggableIcon: {
                    backgroundColor: Colors.FG,
                  },
                  container: {
                    backgroundColor: Colors.BG,
                  },
                }}
              >
                <TabView
                  navigationState={{ index, routes }}
                  renderScene={renderScene}
                  onIndexChange={setIndex}
                  initialLayout={initialLayout}
                  renderTabBar={renderTabBar}
                  swipeEnabled={true}
                />
              </RBSheet>
            </View>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                moreRef.current.open();
              }}
            >
              <GText style={styles.moreButtonText}>More</GText>
            </TouchableOpacity>
          </View>
        </ImageBackground>

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
            <GText style={{ color: Colors.text }}>
              {likes
                ? likes.length == 1
                  ? likes.length + ` like`
                  : likes.length + ` likes`
                : `loading`}
            </GText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginRight: 22 }}
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
        </View>

        {post.caption.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 20,
              marginVertical: 10,
            }}
          >
            <GText style={{ flexWrap: "wrap", color: Colors.text }}>
              <GText style={{ fontWeight: "bold" }}>
                {author.username + `: `}
              </GText>
              <GText style={{}}>
                {post.caption.length > maxlimit
                  ? post.caption.substring(0, maxlimit - 3) + "..."
                  : post.caption}
              </GText>
            </GText>
          </View>
        )}
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
    alignSelf: "center",
    marginRight: 5,
  },
  moreButtonText: {
    alignSelf: "center",
    color: Colors.close,
    fontWeight: "bold",
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
  video: {
    alignSelf: "center",
    width: width * 0.9,
    height: 200,
    borderWidth: 1,
    borderRadius: 20,
  },
  scene: {
    flex: 1,
  },
});

export default React.memo(PostComponent);

const Preview = ({ style, item, imageKey, onPress, index, active, local }) => {
  return (
    <TouchableOpacity
      style={[styles.videoContainer]}
      onPress={() => onPress(item)}
    >
      <View style={[styles.imageContainer, styles.shadow]}>
        <Image
          style={[styles.videoPreview, active ? {} : { height: 120 }]}
          source={{ uri: item[imageKey] }}
        />
      </View>
      <GText style={styles.desc}>{item.desc}</GText>
    </TouchableOpacity>
  );
};
