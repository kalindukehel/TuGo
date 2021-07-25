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
  Button,
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
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Carousel, { Pagination } from "react-native-snap-carousel";
import ShareToDirect from "../screens/Others/ShareToDirect";

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

  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState(null);

  const [likes, setLikes] = useState(null);
  const [comments, setComments] = useState(null);
  const [tiles, setTiles] = useState(null);
  const [author, setAuthor] = useState(null);
  const [maxlimit, setMaxlimit] = useState(95);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tileLoading, setTileLoading] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [status, setStatus] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);

  const [isSelf, setIsSelf] = useState(false);

  const insets = useSafeAreaInsets();

  const shareModal = useRef();
  const refRBSheet = useRef([]);
  const moreRef = useRef();
  const optionsRef = useRef();
  const isLoaded = useRef(false);
  const postRef = useRef();
  const playingIdRef = useRef();
  const tilesRef = useRef();

  const firstRun = useRef(true);

  let WebViewRef = [];

  async function getPostStates() {
    //Update post data from API
    console.log("hi");
    const postRes = await getPostByIdAPI(userToken, postId);
    setPost(postRes.data);
    postRef.current = postRes.data;
    const likesRes = await getPostLikesAPI(userToken, postId);
    setLikes(likesRes.data);
    const commentsRes = await getPostCommentsAPI(userToken, postId);
    setComments(commentsRes.data);
    const authorRes = await getAccountByIdAPI(postRes.data.author, userToken);
    setAuthor(authorRes.data);

    //waiting for tiles to load
    setTileLoading(true);
    const tilesRes = await getPostTilesAPI(userToken, postId);
    setTiles(tilesRes.data);
    setTileLoading(false);

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
  const FirstRoute = () => {
    if (index == 0) {
      return <DanceChoreosTabView inCreatePost={false} song={post} />;
    } else {
      return null;
    }
  };

  const SecondRoute = () => {
    if (index == 1) {
      return <VoiceCoversTabView inCreatePost={false} song={post} />;
    } else {
      return null;
    }
  };

  const ThirdRoute = () =>
    refreshing ? (
      <ScrollView>
        <Text style={{ color: Colors.text }}>{lyrics}</Text>
      </ScrollView>
    ) : (
      <ActivityIndicator animating={true} size="large" color={Colors.FG} />
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
      indicatorStyle={{ backgroundColor: Colors.FG }}
      style={{ backgroundColor: Colors.BG }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: Colors.text }}>{route.title}</Text>
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

  async function onClick() {
    playerDispatch({ type: "UNLOAD_PLAYER" });
    await soundObj.unloadAsync();
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

  //delete tile confirmation alert function
  const deleteTileConfirmation = (tileId) =>
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
            deleteTile(tileId);
          },
        },
      ],
      { cancelable: false }
    );

  //delete post async function
  const deletePost = async () => {
    const res = await deletePostAPI(postId, userToken);
  };

  //delete tile async function
  const deleteTile = async (tileId) => {
    const res = await deleteTileAPI(postId, tileId, userToken);
  };

  const renderTile = ({ item, index }) => {
    if (item.is_youtube)
      var youtube_id = item.youtube_link.substr(item.youtube_link.length - 11);
    return (
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        {/* <Video
          ref={refRBSheet.current[item.id]}
          style={{
            ...styles.video,
            borderColor: item.is_youtube ? "red" : Colors.FG,
          }}
          source={{
            uri: item.is_youtube
              ? item.youtube_video_url
              : item.custom_video_url,
          }} // Can be a URL or a local file.
          useNativeControls
          resizeMode="cover"
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        ></Video> */}
        <View
          style={{
            width: "100%",
            height: 400,
            borderWidth: 2,
          }}
        >
          <WebView
            ref={(WEBVIEW_REF) => (WebViewRef[item.id] = WEBVIEW_REF)}
            scrollEnabled={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            source={{ uri: `https://www.youtube.com/watch?v=${youtube_id}` }}
          />
        </View>
        <View
          style={{
            backgroundColor: Colors.contrastGray,
            position: "absolute",
            right: "3%",
            top: "90%",
            zIndex: 99,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 8,
            borderRadius: 5,
          }}
        >
          {/* <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              deleteTileConfirmation(item.id);
            }}
          >
            <Feather name="trash-2" size={24} color="red" />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{}}
            onPress={() => {
              WebViewRef[item.id] && WebViewRef[item.id].reload();
            }}
          >
            <Foundation name="refresh" size={30} color={Colors.primary} />
          </TouchableOpacity>
        </View>
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
              <Text style={{ fontWeight: "bold", color: Colors.text }}>
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
            <Text style={{ color: Colors.text }}>
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
                  height: 270,
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
                  <Carousel
                    ref={tilesRef}
                    data={tiles}
                    renderItem={renderTile}
                    sliderWidth={width}
                    itemWidth={width}
                    onSnapToItem={(index) => setActiveSlide(index)}
                  />

                  <Pagination
                    carouselRef={tilesRef}
                    dotsLength={tiles.length}
                    activeDotIndex={activeSlide}
                    containerStyle={{ height: 70 }}
                    tappableDots={true}
                    dotStyle={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginHorizontal: 8,
                      backgroundColor: Colors.FG,
                    }}
                    inactiveDotStyle={
                      {
                        // Define styles for inactive dots here
                      }
                    }
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
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
                  <Text style={{ color: Colors.text, marginLeft: 10 }}>
                    {comments ? `${comments.length}` : `loading`}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  moreRef.current.open();
                }}
              >
                <Text style={styles.moreButtonText}>More</Text>
              </TouchableOpacity>

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
                closeOnPressMask={false}
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
              <Fontisto name="arrow-return-right" size={25} color={Colors.FG} />
            </TouchableWithoutFeedback>
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
            <Text style={{ color: Colors.text }}>
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
            <Text style={{ flexWrap: "wrap", color: Colors.text }}>
              <Text style={{ fontWeight: "bold" }}>
                {author.username + `: `}
              </Text>
              <Text style={{}}>
                {post.caption.length > maxlimit
                  ? post.caption.substring(0, maxlimit - 3) + "..."
                  : post.caption}
              </Text>
            </Text>
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
    backgroundColor: "#CDCDCD",
    alignSelf: "center",
  },
  moreButtonText: {
    alignSelf: "center",
    color: Colors.complimentText,
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
