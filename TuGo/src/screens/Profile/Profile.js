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
  getAccountDetails as getAccountDetailsAPI,
  mutualUsers as mutualUsersAPI,
  by_ids as by_idsAPI
} from "../../api";
import { onSignOut } from "../../auth";
import { useAuthState, useAuthDispatch } from "../../context/authContext";
import { useErrorState, useErrorDispatch } from "../../context/errorContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { API_URL } from "../../../constants";
import { Fontisto } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useScrollToTop } from "@react-navigation/native";
import { Colors } from "../../../constants";
import GText from '../../components/GText'
import ImageS3 from "../../components/ImageS3";

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
    fontSize: 25,
    alignSelf: "center",
    color: Colors.text,
  },
  userStatsText: {
    paddingHorizontal: 5,
    overflow: "hidden",
    borderRadius: 7,
    fontSize: 11,
    color: Colors.text,
    fontWeight: 'bold'
    // color: Colors.text
  },
  settingsIcon: {
    flexDirection: "row-reverse",
    width: "100%",
    height: "100%",
    zIndex: 2,
    position: "absolute",
  },
  actionButton: {
    borderRadius: 7,
    width: "50%",
    paddingVertical: 7,
    alignSelf: "center",
    marginRight: 10
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
  const [isViewable, setIsViewable] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false);
  const firstRun = useRef(true);
  const [offset, setOffset] = useState(0);
  const [topArtists, setTopArtists] = useState([])
  const [mutuals, setMutuals] = useState([])
  const errorDispatch = useErrorDispatch();
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
    setIsViewable(userState.data.isViewable)
    const userInfo = await getUserInfoAPI(userToken, profileId);
    //Update follow status
    const res = await getAccountDetailsAPI(profileId, userToken);
    setIsFollowing(res.data.requested ? 'requested' : res.data.you_follow ? 'true' : 'false')
    if (!isSelf){
      const idRes = await mutualUsersAPI(userToken, profileId)
      const mutualsRes = await by_idsAPI(idRes.data.map(item => item.follower), userToken)
      setMutuals(mutualsRes.data)
    }
    try {
      const postsState = await getPostsAPI(userToken, profileId);
      setPosts(postsState.data);
      const allArtistArr = postsState.data.map(post=>post.artist_id)
      const uniqueArtistArr = [...new Set(allArtistArr)]
      const artistobj = uniqueArtistArr.map(id => {
        return (
        {id: id, count: allArtistArr.filter(x => x === id).length}
        )
      })
      const sortedArtists = artistobj.sort((a,b) => a.count < b.count)
      setTopArtists(sortedArtists.length <= 3 ? sortedArtists : sortedArtists.slice(0,3))


    } catch (e) {
      console.log('cannot view posts, must follow')
    }
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
    // errorDispatch({type: 'REPORT_ERROR', message: "I am testing this"})
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

  const getArtistImage = (artistId) => {
    return `https://api.napster.com/imageserver/v2/artists/${artistId}/images/500x500.jpg`;
  };

  const renderTopArtist = ({item}) => {
    return (
      <Image style={{height: 50, width: 50, borderRadius: 999}} source={{uri: getArtistImage(item.id)}} />
    )
  }

  async function checkFollow() {
    //Get everyone that user is following
    const res = await getAccountDetailsAPI(profileId, userToken);
    setIsFollowing(res.data.requested ? 'requested' : res.data.you_follow ? 'true' : 'false')
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
        {creator: self.username},
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
      user && 
      <>
        {isSelf && (
          <GText
            style={{
              marginLeft: leftSpacing,
              fontSize: 30,
              marginTop: 20,
              color: Colors.text,
            }}
          >
            My Profile
          </GText>
        )}
        <View style={styles.ProfileHeaderView}>
          <View style={styles.profilePicture}>
            <ImageS3
              url={user.profile_picture}
              style={{ height: 100, width: 100, borderRadius: 999 }}
            />
          </View>
          <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
            marginHorizontal: 20
          }}
        >
          <TouchableWithoutFeedback
            disabled={!isViewable}
            onPress={() => {
              navigation.push("Following", {
                id: profileId,
                type: "following",
              });
            }}
          >
            <View>
              <GText style={styles.userStatsNumber}>{following}</GText>
              <GText style={styles.userStatsText}>Following</GText>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ }}>
            <GText style={styles.userStatsNumber}>{postsLength}</GText>
            <GText
              style={styles.userStatsText}
            >
              Songs
            </GText>
          </View>
          <TouchableWithoutFeedback
            disabled={!isViewable}
            onPress={() => {
              navigation.push("Followers", {
                id: profileId,
                type: "followers",
              });
            }}
          >
            <View>
              <GText style={styles.userStatsNumber}>{followers}</GText>
              <GText style={styles.userStatsText}>Followers</GText>
            </View>
          </TouchableWithoutFeedback>
        </View>
        </View>
        <View
            style={{
              justifyContent: "space-between",
              flex: 1,
              alignItems: "center",
              flexDirection: 'row',
              marginVertical: 20
            }}
        >
            {user && (
              <>
                <GText
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 20,
                    fontSize: getNameSize(user.name),
                    fontWeight: "bold",
                    color: Colors.text,
                  }}
                >
                  {user.name}
                </GText>
                {!isSelf ? (
                  <TouchableWithoutFeedback
                    onPress={() => changeFollow()}
                  >
                    <View style={{
                      ...styles.actionButton,
                      backgroundColor:
                        isFollowing == "true" ? "#065581" : "#DCDCDC",
                    }}>
                      <GText
                        style={{
                          ...styles.actionButtonText,
                          color: isFollowing == "true" ? "white" : "black",
                          fontWeight: "bold",
                        }}
                      >
                        {isFollowing != "" && renderFollowingType()}
                      </GText>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.push("Edit Profile", {
                        self: user
                      });
                    }}
                  >
                    <View style={{
                      ...styles.actionButton,
                      backgroundColor: "#DCDCDC",
                    }}>
                      <GText
                        style={{
                          ...styles.actionButtonText,
                          fontWeight: "bold",
                        }}
                      >
                        Edit Profile
                      </GText>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </>
            )}
          </View>
        {!isSelf && mutuals.length > 0 &&
        <View style={{flexDirection: 'row', marginVertical: 10}}>
          <GText style={{color: Colors.text, marginLeft: leftSpacing}}>
            <GText>Followed by </GText>
            <GText 
              style={{fontWeight: 'bold'}}
              onPress={()=>{
                navigation.push("Profile", {
                  id: mutuals[0].id,
                })
              }}>{mutuals[0].username}</GText>
            {mutuals.length > 1 &&
              <GText style={{color: Colors.text}}>
                {mutuals.length > 2 ? <GText>,</GText> : <GText> and </GText>}
                <GText 
                  style={{fontWeight: 'bold'}}
                  onPress={()=>{
                    navigation.push("Profile", {
                      id: mutuals[1].id,
                    })
                  }}>{mutuals[1].username}</GText>
                {mutuals.length > 2 && <GText> and {mutuals.length - 2} more</GText>}
              </GText>
            }
          </GText>
        </View>}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderColor: Colors.gray,
            borderWidth: 1,
            borderRadius: 30,
            marginVertical: 20,
            height: 70,
            paddingLeft: leftSpacing
          }}
        >
         <GText style={{ fontWeight: "bold", color: Colors.text }}>
            Portfolio
          </GText>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              marginLeft: 20,
              justifyContent: "space-evenly",
            }}
          >
            {topArtists.length === 0 ? <GText style={{color: Colors.primary}}>Post to create portfolio.</GText>:
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{
                flexDirection: "row",
                flex: 1,
                marginLeft: 20,
                justifyContent: "space-evenly",
              }}
              horizontal
              data={topArtists}
              renderItem={renderTopArtist}
              keyExtractor={item => item.id}
            />}
          </View>
        </View>
      </>
    );
  };

  const getFooter = () => {
    return (
      !isViewable && (
        <GText
          style={{
            color: Colors.text,
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: "center",
            marginTop: "20%",
          }}
        >
          Private Account! Follow to see.
        </GText>
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
        style={{ flexDirection: "column"}}
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
        ListHeaderComponentStyle={{backgroundColor: Colors.BG}}
      />
    </View>
  );
};

export default React.memo(Profile);
