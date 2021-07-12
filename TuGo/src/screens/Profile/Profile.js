import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableHighlight,
  RefreshControl,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Linking,
  Button,
} from "react-native";
import {
  getUserInfo as getUserInfoAPI,
  getPosts as getPostsAPI,
  getAccountById as getAccountByIdAPI,
  getFollowing as getFollowingAPI,
  changeFollow as changeFollowAPI,
  getRequested as getRequestedAPI,
  pushNotification as pushNotificationAPI,
} from "../../api";
import { onSignOut } from "../../auth";
import { useAuthState, useAuthDispatch } from "../../context/authContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { API_URL } from "../../../constants";
import { Fontisto } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useScrollToTop } from "@react-navigation/native";
import { Colors } from "../../../constants";

//images
import SoundcloudIcon from "../../../assets/soundcloud.svg";
import SpotifyIcon from "../../../assets/spotify.svg";
import YoutubeIcon from "../../../assets/youtube.svg";

var { width, height } = Dimensions.get("window");
const blank =
  "https://www.publicdomainpictures.net/pictures/30000/velka/plain-white-background.jpg";

const leftSpacing = 20;

const styles = StyleSheet.create({
  profilePicture: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  list: {
    paddingBottom: height / 100,
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  userStatsNumber: {
    fontSize: 30,
    alignSelf: "center",
    color: Colors.text,
  },
  userStatsText: {
    backgroundColor: "#EDEDED",
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "#EDEDED",
    overflow: "hidden",
    borderRadius: 10,
  },
  settingsIcon: {
    flexDirection: "row-reverse",
    width: "100%",
    height: "100%",
    zIndex: 2,
    position: "absolute",
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ffffff00",
    width: "70%",
    paddingVertical: 7,
    alignSelf: "center",
  },
  actionButtonText: {
    alignSelf: "center",
  },
  ProfileHeaderView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 10,
  },
});

const Profile = (props) => {
  const { navigation } = props;
  let id = null;
  if (props.route.params) {
    id = props.route.params.id;
  }
  const { userToken, self } = useAuthState();
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [posts, setPosts] = useState([]);
  const [postsLength, setPostsLength] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(200);
  const [isFollowing, setIsFollowing] = useState(false);
  const firstRun = useRef(true);
  const [offset, setOffset] = useState(0);

  //tap active tab to scroll to the top
  const ref = React.useRef(null);
  useScrollToTop(ref);

  let profileId = self.id;
  if (props.id && !id) {
    profileId = props.id;
  } else if (id) {
    profileId = id;
  }
  let isSelf = profileId == self.id;

  isSelf &&
    props.id &&
    props.fromMyProfile &&
    !id &&
    React.useLayoutEffect(() => {
      //Display settings and favorites button if it is own profile and from profile navigation
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              navigation.navigate("Settings");
            }}
          >
            <Ionicons name="ios-settings" size={25} color={Colors.FG} />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => {
              navigation.navigate("Favorites");
            }}
          >
            <Fontisto name="favorite" size={24} color={Colors.FG} />
          </TouchableOpacity>
        ),
      });
    }, [navigation]);

  async function getUserStates() {
    //Update user data from API
    const userState = await getAccountByIdAPI(profileId, userToken);
    setUser(userState.data);
    const userInfo = await getUserInfoAPI(userToken, profileId);
    try {
      const postsState = await getPostsAPI(userToken, profileId);
      setPosts(postsState.data);
    } catch (err) {
      setError(err.response.status);
    }
    //Update follow status
    checkFollow();

    //Set target user followers, following and posts values
    setFollowers(userInfo.data.followers);
    setFollowing(userInfo.data.following);
    setPostsLength(userInfo.data.posts);
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getUserStates();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, [profileId]);

  React.useEffect(() => {
    //When navigation is changed update the user data
    const unsubscribe = navigation.addListener("focus", async () => {
      if (firstRun.current) {
        firstRun.current = false;
      } else {
        await getUserStates();
      }
    });
    return unsubscribe;
  }, [navigation]);

  navigation.setOptions({
    title: user ? user.username : "",
  });

  const renderSection = (post) => {
    let curPost = post.item;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.push("Post", {
            screen: "Post",
            params: {
              postId: curPost.id,
              authorId: curPost.author,
            },
          });
        }}
      >
        <View
          style={{
            flex: 1,
            width: width / 3,
            height: width / 3,
            paddingRight: 2,
            paddingLeft: 2,
            paddingBottom: 4,
          }}
        >
          <Image
            style={{ flex: 1, width: undefined, height: undefined }}
            source={{ uri: curPost.album_cover }}
          ></Image>
        </View>
      </TouchableOpacity>
    );
  };

  async function checkFollow() {
    //Get everyone that user is following
    const res = await getFollowingAPI(userToken, self.id);
    const arrayIds = res.data.map((item) => item.following);

    //Get everyone user has requested
    const requestedRes = await getRequestedAPI(userToken);
    const idsRequested = requestedRes.data.map((item) => item.to_request);
    //Check if target user is in users's following or requested
    if (idsRequested.includes(profileId)) {
      setIsFollowing("requested");
    } else if (arrayIds.includes(profileId)) {
      setIsFollowing("true");
    } else {
      setIsFollowing("false");
    }
  }
  const onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > offset ? "down" : "up";
    setOffset(currentOffset);
  };
  const OpenURLButton = ({ url, children }) => {
    const handlePress = React.useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>
    );
  };

  async function changeFollow() {
    const res = await changeFollowAPI(userToken, profileId);
    checkFollow();
    getUserStates();
    if (res.status == 201) {
      await pushNotificationAPI(
        user.notification_token,
        self.username,
        "follow"
      );
    } else if (res.status == 202) {
      await pushNotificationAPI(
        user.notification_token,
        self.username,
        "request"
      );
    } else if (res.status == 205) {
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  const getNameSize = (name) => {
    if (name.length <= 10) return 25;
    if (name.length <= 20) return 18;
    if (name.length <= 50) return 6;
  };

  const getHeader = () => {
    const renderFollowingType = () => {
      if (isFollowing == "true") {
        return "Following";
      } else if (isFollowing == "false") {
        return "Follow";
      } else if (isFollowing == "requested") {
        return "Requested";
      }
    };
    return (
      <>
        {isSelf && (
          <Text
            style={{
              marginLeft: leftSpacing,
              fontSize: 30,
              marginTop: 20,
              color: Colors.text,
            }}
          >
            My Profile
          </Text>
        )}
        <View style={styles.ProfileHeaderView}>
          <View style={styles.profilePicture}>
            <Image
              source={{
                uri: user
                  ? user.profile_picture
                  : API_URL + "/media/default.jpg",
              }}
              style={{ height: 150, width: 150, borderRadius: 40 }}
            />
          </View>
          <View
            style={{
              justifyContent: "space-between",
              height: 120,
              flex: 1,
              alignItems: "center",
            }}
          >
            {user && (
              <>
                <Text
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 20,
                    fontSize: getNameSize(user.name),
                    fontWeight: "bold",
                    color: Colors.text,
                  }}
                >
                  {user.name}
                </Text>
                {!isSelf ? (
                  <TouchableOpacity
                    style={{
                      ...styles.actionButton,
                      backgroundColor:
                        isFollowing == "true" ? "#065581" : "#DCDCDC",
                    }}
                    onPress={() => changeFollow()}
                  >
                    <Text
                      style={{
                        ...styles.actionButtonText,
                        color: isFollowing == "true" ? "white" : "black",
                        fontWeight: "bold",
                      }}
                    >
                      {isFollowing != "" && renderFollowingType()}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      ...styles.actionButton,
                      backgroundColor: "#DCDCDC",
                    }}
                    onPress={() => {
                      navigation.push("Edit Profile", {
                        self: user
                      });
                    }}
                  >
                    <Text
                      style={{
                        ...styles.actionButtonText,
                        fontWeight: "bold",
                      }}
                    >
                      Edit Profile
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            disabled={error == 403}
            onPress={() => {
              navigation.push("Following", {
                id: profileId,
                type: "following",
              });
            }}
          >
            <Text style={styles.userStatsNumber}>{following}</Text>
            <Text style={styles.userStatsText}>Following</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 25 }}>
            <Text style={styles.userStatsNumber}>{postsLength}</Text>
            <Text
              style={{
                ...styles.userStatsText,
                backgroundColor: "#D3D3D3",
                borderColor: "#D3D3D3",
              }}
            >
              Songs
            </Text>
          </View>
          <TouchableOpacity
            disabled={error == 403}
            onPress={() => {
              navigation.push("Followers", {
                id: profileId,
                type: "followers",
              });
            }}
          >
            <Text style={styles.userStatsNumber}>{followers}</Text>
            <Text style={styles.userStatsText}>Followers</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderBottom: "solid",
            borderWidth: 2,
            marginTop: 10,
            borderColor: "#EDEDED",
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", color: Colors.text }}>
            Portfolio
          </Text>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              marginLeft: 20,
              justifyContent: "space-evenly",
            }}
          >
            <OpenURLButton url={"https://soundcloud.com/discover"}>
              <SoundcloudIcon width={40} height={40} />
            </OpenURLButton>
            <OpenURLButton url={"https://open.spotify.com/user/kush_p567"}>
              <SpotifyIcon width={40} height={40} />
            </OpenURLButton>
            <OpenURLButton url={"https://www.youtube.com/"}>
              <YoutubeIcon width={40} height={40} />
            </OpenURLButton>
          </View>
        </View>
      </>
    );
  };

  const getFooter = () => {
    return (
      error == 403 && (
        <Text
          style={{
            color: Colors.text,
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: "center",
            marginTop: "20%",
          }}
        >
          Forbidden! Follow to see.
        </Text>
      )
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.BG,
      }}
    >
      <FlatList
        ref={ref}
        style={{ flexDirection: "column" }}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.FG}
          />
        }
        ListHeaderComponent={getHeader}
        ListFooterComponent={getFooter}
        data={posts}
        renderItem={renderSection}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
      />
    </View>
  );
};

export default React.memo(Profile);
