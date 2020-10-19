import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Flatlist,
  SafeAreaView,
  TouchableHighlight,
  RefreshControl,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  getFollowers as getFollowersAPI,
  getFollowing as getFollowingAPI,
  getPosts as getPostsAPI,
} from "../api";
import { onSignOut } from "../auth";
import { useAuthState, useAuthDispatch } from "../context/authContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FlatList } from "react-native-gesture-handler";

const styles = StyleSheet.create({
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
});

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

var { width, height } = Dimensions.get("window");

const Profile = ({ navigation }) => {
  const { userToken, self } = useAuthState();
  const dispatch = useAuthDispatch();
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getUserStates() {
      const followerState = await getFollowersAPI(userToken, self.id);
      const followingState = await getFollowingAPI(userToken, self.id);
      const postsState = await getPostsAPI(userToken, self.id);
      setFollowers(followerState.data.length);
      setFollowing(followingState.data.length);
      setPosts(postsState.data);
    }
    getUserStates();
    wait(1000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    onRefresh();
  }, []);

  renderSection = () => {
    return posts.map((post, index) => {
      return (
        <View
          key={index}
          style={[
            { width: width / 2 },
            { height: width / 2 },
            { paddingRight: 2 },
            { paddingLeft: 2 },
            { paddingBottom: 4 },
          ]}
        >
          <Image
            style={{ flex: 1, width: undefined, height: undefined }}
            source={{ uri: post.soundcloud_art }}
          ></Image>
        </View>
      );
    });
  };

  renderBackground = () => {
    const topPosts = posts.filter((post, index) => index <= 5);
    console.log(topPosts);
    return (
      <View style={{ height: "35%" }}>
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
                  width: "33%",
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

                    <TouchableOpacity
                      style={{
                        width: 25,
                        alignItems: "center",
                        alignSelf: "flex-end",
                        marginRight: 5,
                        marginTop: 5,
                        zIndex: 5,
                        position: "absolute",
                      }}
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

        <Image
          source={{ uri: self.profile_picture }}
          style={{
            width: "50%",
            height: "100%",
            alignSelf: "center",
            borderColor: "black",
            borderWidth: 2,
            borderRadius: 90,
            zIndex: 1,
            position: "absolute",
          }}
        ></Image>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {renderBackground()}
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity>
            <Text style={styles.userStatsNumber}>{following}</Text>
            <Text style={styles.userStatsText}>Following</Text>
          </TouchableOpacity>
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
          <TouchableOpacity>
            <Text style={styles.userStatsNumber}>{followers}</Text>
            <Text style={styles.userStatsText}>Followers</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ borderBottom: "solid", borderWidth: 2, marginTop: 10, borderColor: "#EDEDED" }}
        />
        <View style={{}}>
          <Text style={{ fontWeight: "bold", margin: 10 }}>Portfolio</Text>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{renderSection()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
