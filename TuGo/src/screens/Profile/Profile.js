import React, { useState, useEffect } from "react";
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
  Animated, 
  StatusBar,
} from "react-native";
import {
  getFollowers as getFollowersAPI,
  getFollowing as getFollowingAPI,
  getPosts as getPostsAPI,
} from "../../api";
import { onSignOut } from "../../auth";
import { useAuthState, useAuthDispatch } from "../../context/authContext";
import Ionicons from "react-native-vector-icons/Ionicons";

console.disableYellowBox = true;

var { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  profilePicture: {
    width: "50%",
    height: "100%",
    alignSelf: "center",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 90,
    zIndex: 1,
    position: "absolute",
  },
  list: {
    paddingBottom: height / 2.65,
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
  }
});

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const Profile = (props) => {
  const { navigation, id } = props;
  const { userToken, self } = useAuthState();
  const dispatch = useAuthDispatch();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const profileId = self.id;
  if(id) profileId = id;
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getUserStates() {
      const followerState = await getFollowersAPI(userToken, profileId);
      const followingState = await getFollowingAPI(userToken, profileId);
      const postsState = await getPostsAPI(userToken, profileId);
      console.log(followerState.data);
      setFollowers(followerState.data);
      setFollowing(followingState.data);
      setPosts(postsState.data);
    }
    getUserStates();
    wait(1000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    onRefresh();
  }, []);

  const renderSection = (post) => {
    return (
      <TouchableOpacity>
        <View
          style={{
            flex: 1,
            width: width / 2,
            height: width / 2,
            paddingRight: 2,
            paddingLeft: 2,
            paddingBottom: 4,
          }}
        >
          <Image
            style={{ flex: 1, width: undefined, height: undefined }}
            source={{ uri: post.item.soundcloud_art }}
          ></Image>
        </View>
      </TouchableOpacity>

    );
  };

  renderBackground = () => {
    const topPosts = posts.filter((post, index) => index <= 5);
    console.log(topPosts);
    return (
      <View style={{ width: width, height: "50%" }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            height: "100%",
            width: "100%",
            opacity: 0.6,
          }}
        >
          {topPosts.map((post, index) => {
            console.log(posts.length);
            return (
              <View
                key={index}
                style={{
                  borderColor: "gray",
                  borderWidth: 1,
                  backgroundColor: "white",
                  height: "50%",
                  width: width / 3,
                }}
              >
                {index === 0 && (
                  <Image
                    style={{ flex: 1, width: undefined, height: undefined }}
                    source={{ uri: post.soundcloud_art }}
                  ></Image>
                )}
                {index === 1 && (
                  <Image
                    style={{ flex: 1, width: undefined, height: undefined }}
                    source={{ uri: post.soundcloud_art }}
                  ></Image>
                )}
                {index === 2 && (
                  <>
                    <Image
                      style={{ flex: 1, width: undefined, height: undefined }}
                      source={{ uri: post.soundcloud_art }}
                    ></Image>
                  </>
                )}
                {index === 3 && (
                  <Image
                    style={{ flex: 1, width: undefined, height: undefined }}
                    source={{ uri: post.soundcloud_art }}
                  ></Image>
                )}
                {index === 4 && (
                  <Image
                    style={{ flex: 1, width: undefined, height: undefined }}
                    source={{ uri: post.soundcloud_art }}
                  ></Image>
                )}
                {index === 5 && (
                  <Image
                    style={{ flex: 1, width: undefined, height: undefined }}
                    source={{ uri: post.soundcloud_art }}
                  ></Image>
                )}
                {/* {topPosts.length == index + 1 && renderBoxes(6 - topPosts.length)} */}
              </View>
            );
          })}
        </View>
        <TouchableOpacity
          style={styles.settingsIcon}
        >
          <Ionicons
            name="ios-settings"
            backgroundColor="red"
            size={25}
            color={"black"}
            onPress={async () => {
              navigation.navigate("Settings");
            }}
          />
        </TouchableOpacity>

        <Image
          source={{ uri: self.profile_picture }}
          style={styles.profilePicture}
        ></Image>
      </View>
    );
  };
  getHeader = () => {
    return (
      <>
        {renderBackground()}
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity onPress={() => {
                          navigation.navigate("Following", {
                            id: profileId
                          });
                        }}>
            <Text style={styles.userStatsNumber}>{following.length}</Text>
            <Text style={styles.userStatsText}>Following</Text>
          </TouchableOpacity >
          <View style={{ marginTop: 25 }}>
            <Text style={styles.userStatsNumber}>{posts.length}</Text>
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
          <TouchableOpacity onPress={() => {
                          navigation.navigate("Followers", {
                            id: profileId
                          });
                        }}>
            <Text style={styles.userStatsNumber}>{followers.length}</Text>
            <Text style={styles.userStatsText}>Followers</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ borderBottom: "solid", borderWidth: 2, marginTop: 10, borderColor: "#EDEDED" }}
        />
        <View style={{}}>
          <Text style={{ fontWeight: "bold", margin: 10 }}>Portfolio</Text>
        </View>
      </>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <FlatList
        style={{flexDirection: 'column'}}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={getHeader}
        data={posts}
        renderItem={renderSection}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
    </View>
  );
};

export default Profile;
