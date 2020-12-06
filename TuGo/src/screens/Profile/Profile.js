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
  by_ids as by_idsAPI
} from "../../api";
import { onSignOut } from "../../auth";
import { useAuthState, useAuthDispatch } from "../../context/authContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { API_URL } from "../../../constants";


var { width, height } = Dimensions.get("window");
const blank = "https://www.publicdomainpictures.net/pictures/30000/velka/plain-white-background.jpg"

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
  const { navigation } = props;
  let id = null;
  if(props.route.params) id = props.route.params.id
  const { userToken, self } = useAuthState();
  const dispatch = useAuthDispatch();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  let profileId = self.id;
  if(id) {
    profileId = id;
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getUserStates() {
      const userState = await by_idsAPI([profileId], userToken)
      setUser(userState.data[0])
      const followerState = await getFollowersAPI(userToken, profileId);
      const followingState = await getFollowingAPI(userToken, profileId);
      const postsState = await getPostsAPI(userToken, profileId);
      setFollowers(followerState.data);
      setFollowing(followingState.data);
      setPosts(postsState.data);
    }
    getUserStates();
    wait(1000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    onRefresh();
  }, [profileId]);

  navigation.setOptions({
    title: user ? user.username : ""
  })

  const renderSection = (post) => {
    let curPost = post.item;
    return (
      <TouchableOpacity
        onPress={()=>{
          navigation.push('PostNavigator', {
            screen: 'Post',
            params: { 
              postId: curPost.id,
              authorId: curPost.author,
            },
          });
        }}>
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
            source={{ uri: curPost.soundcloud_art }}
          ></Image>
        </View>
      </TouchableOpacity>

    );
  };

  renderBackground = () => {
    const topPosts = posts.filter((post, index) => index <= 5);
    const six = [0,1,2,3,4,5];
    return (
      <View style={{ width: width, height: height/3.4 }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            height: "100%",
            width: "100%",
            opacity: 0.6,
          }}
        >
          {six.map((index) => {
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
                <Image
                  style={{ flex: 1, width: undefined, height: undefined }}
                  source={{ uri: topPosts[index] ? topPosts[index].soundcloud_art : blank}}
                ></Image>
              </View>
            );
          })}
        </View>
        {profileId == self.id && 
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
        </TouchableOpacity>}
        <Image
          source={{ uri: user ? API_URL + user.profile_picture : API_URL + "/media/default.jpg" }}
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
                          navigation.push("Following", {
                            id: profileId,
                            type: "following"
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
                          navigation.push("Followers", {
                            id: profileId,
                            type: "followers"
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
