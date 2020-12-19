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
  getUserInfo as getUserInfoAPI,
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


const Profile = (props) => {
  const { navigation } = props;
  let id = null;
  if(props.route.params) id = props.route.params.id
  const { userToken, self } = useAuthState();
  const dispatch = useAuthDispatch();
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [posts, setPosts] = useState([]);
  const [postsLength, setPostsLength] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(200);
  const [onBack, setOnBack] = useState(false);
  let profileId = self.id;
  if(id) {
    profileId = id;
  }
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    async function getUserStates() {
      const userState = await by_idsAPI([profileId], userToken)
      setUser(userState.data[0]);
      const userInfo = await getUserInfoAPI(userToken, profileId);
      try {
        const postsState = await getPostsAPI(userToken, profileId);
        setPosts(postsState.data);
      }
      catch(err) {
        setError(err.response.status);
      }
      setFollowers(userInfo.data.followers);
      setFollowing(userInfo.data.following);
      setPostsLength(userInfo.data.posts);
    }
    await getUserStates();
    setRefreshing(false);
  }, []);
  useEffect(() => {
    onRefresh();
  }, [profileId]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const userState = await by_idsAPI([profileId], userToken)
      setUser(userState.data[0]);
      const userInfo = await getUserInfoAPI(userToken, profileId);
      try {
        const postsState = await getPostsAPI(userToken, profileId);
        setPosts(postsState.data);
      }
      catch(err) {
        setError(err.response.status);
      }
      setFollowers(userInfo.data.followers);
      setFollowing(userInfo.data.following);
      setPostsLength(userInfo.data.posts);
    });
    return unsubscribe;
  }, [navigation]);

  navigation.setOptions({
    title: user ? user.username : ""
  })

  const renderSection = (post) => {
    let curPost = post.item;
    return (
      <TouchableOpacity
        onPress={()=>{
          navigation.push('Post', {
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
                  source={{ uri: topPosts[index] && error != 403 ? topPosts[index].soundcloud_art : blank}}
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
          <TouchableOpacity 
            disabled={error == 403}
            onPress={() => {
              navigation.push("Following", {
                id: profileId,
                type: "following"
              });
            }}>
            <Text style={styles.userStatsNumber}>{following}</Text>
            <Text style={styles.userStatsText}>Following</Text>
          </TouchableOpacity >
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
                type: "followers"
              });
            }}>
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
      </>
    );
  };

  const getFooter = () => {
    return(
      error == 403 &&
      <Text
        style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginTop: '20%'}}>Forbidden! Follow to see.
      </Text>
    )
  }
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
        ListFooterComponent={getFooter}
        data={posts}
        renderItem={renderSection}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
    </View>
  );
};

export default Profile;
