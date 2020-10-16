import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Flatlist,
  SafeAreaView,
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

const Profile = ({ navigation }) => {
  const { userToken, self } = useAuthState();
  const dispatch = useAuthDispatch();
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function getUserStates() {
      const followerState = await getFollowersAPI(userToken, self.id);
      const followingState = await getFollowingAPI(userToken, self.id);
      const postsState = await getPostsAPI(userToken, self.id);
      setFollowers(followerState.data.length);
      setFollowing(followingState.data.length);
      setPosts(postsState.data);
    }
    getUserStates();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ height: "35%" }}>
        <View
          style={{
            flexDirection: "row",
            height: "50%",
            width: "100%",
            opacity: 0.6,
          }}
        >
          <View style={{ backgroundColor: "black", height: "100%", width: "33%" }}></View>
          <View style={{ backgroundColor: "green", height: "100%", width: "34%" }}></View>
          <View
            style={{
              backgroundColor: "gray",
              height: "100%",
              width: "33%",
            }}
          >
            <TouchableOpacity
              style={{
                width: 25,
                alignItems: "center",
                alignSelf: "flex-end",
                marginRight: 5,
                marginTop: 5,
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
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            height: "50%",
            width: "100%",
            opacity: 0.6,
          }}
        >
          <View style={{ backgroundColor: "yellow", height: "100%", width: "33%" }}></View>
          <View style={{ backgroundColor: "pink", height: "100%", width: "34%" }}></View>
          <View
            style={{
              backgroundColor: "brown",
              height: "100%",
              width: "33%",
            }}
          ></View>
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
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity>
          <Text style={styles.userStatsNumber}>{following}</Text>
          <Text style={styles.userStatsText}>Following</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 25 }}>
          <Text style={styles.userStatsNumber}>{posts.length}</Text>
          <Text
            style={{ ...styles.userStatsText, backgroundColor: "#D3D3D3", borderColor: "#D3D3D3" }}
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
      <View>
        <Text style={{ fontWeight: "bold", margin: 10 }}>Portfolio</Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
