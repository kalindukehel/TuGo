import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Vibration,
  Text,
  TextInput,
  RefreshControl,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuthState } from "../../context/authContext";
import {
  getFollowers as getFollowersAPI,
  getAccountById as getAccountByIdAPI,
  getFollowing as getFollowingAPI,
  getRequested as getRequestedAPI,
  changeFollow as changeFollowAPI,
  by_ids as by_idsAPI,
} from "../../api";
import { FlatList } from "react-native-gesture-handler";
import { API_URL } from "../../../constants";
import * as Haptics from "expo-haptics";

var { width, height } = Dimensions.get("window");

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const maxlimit = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "gray",
    backgroundColor: "#065581",
    borderRadius: 10,
    color: "white",
  },
  followButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "white",
    width: 90,
    paddingVertical: 3,
    alignSelf: "center",
  },
  followButtonText: {
    alignSelf: "center",
  },
  followElement: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});

const Followers = (props) => {
  const { navigation } = props;
  const { userToken, self } = useAuthState();
  const [followingStatus, setFollowingStatus] = useState({});
  const { type, id } = props.route.params;
  let list = [];
  const [refreshing, setRefreshing] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const firstRun = useRef(true);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    async function getUserStates() {
      const followStat =
        type == "followers"
          ? await getFollowersAPI(userToken, id)
          : await getFollowingAPI(userToken, id);
      list = followStat.data.map((item) =>
        type == "followers" ? item.follower : item.following
      );
      const res = await by_idsAPI(list, userToken);
      setFilteredData(res.data);
      setMasterData(res.data);
      getIsFollowing();
    }
    async function getIsFollowing() {
      const res = await getFollowingAPI(userToken, self.id);
      const requestedRes = await getRequestedAPI(userToken);
      const ids = res.data.map((item) => item.following);
      const idsRequested = requestedRes.data.map((item) => item.to_request);
      let tempFollowingStatus = {};
      for (let i = 0; i < list.length; i++) {
        let followStatus;
        if (idsRequested.includes(list[i])) {
          followStatus = "requested";
        } else if (ids.includes(list[i])) {
          followStatus = "true";
        } else {
          followStatus = "false";
        }
        tempFollowingStatus[list[i]] = followStatus;
      }
      setFollowingStatus(tempFollowingStatus);
    }
    setLoading(true);
    await getUserStates();
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  React.useEffect(() => {
    //When navigation is changed update the follow data
    const unsubscribe = navigation.addListener("focus", async () => {
      if (firstRun.current) {
        firstRun.current = false;
      } else {
        onRefresh();
      }
    });
    return unsubscribe;
  }, [navigation]);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const usernameData = item.username
          ? item.username.toUpperCase()
          : "".toUpperCase();
        const nameData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return (
          usernameData.indexOf(textData) > -1 || nameData.indexOf(textData) > -1
        );
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterData
      setFilteredData(masterData);
      setSearch(text);
    }
  };

  async function changeFollow(id) {
    const res = await changeFollowAPI(userToken, id);
    let newFollowingStatus;
    if (res.status == 201) {
      newFollowingStatus = "true";
    } else if (res.status == 202) {
      newFollowingStatus = "requested";
    } else if (res.status == 204) {
      newFollowingStatus = "false";
    }
    let tempFollowingStatus = Object.assign({}, followingStatus);
    tempFollowingStatus[id] = newFollowingStatus;
    setFollowingStatus(tempFollowingStatus);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  const renderItem = (item) => {
    let follow = item.item;
    const isSelf = follow.id == self.id;
    const renderFollowingType = () => {
      if (followingStatus[follow.id] == "true") {
        return "Following";
      } else if (followingStatus[follow.id] == "false") {
        return "Follow";
      } else if (followingStatus[follow.id] == "requested") {
        return "Requested";
      }
    };
    return (
      <TouchableOpacity
        style={styles.followElement}
        onPress={() => {
          navigation.push("Profile", {
            id: follow.id,
          });
        }}
      >
        <View style={{ flexDirection: "row", alignContent: "center" }}>
          <Image
            source={{ uri: API_URL + follow.profile_picture }}
            style={{
              width: height / 20,
              height: height / 20,
              borderRadius: 5,
              borderWidth: 1,
            }}
          ></Image>
          <View style={{ flexDirection: "column", flex: 1, marginLeft: 10 }}>
            <Text style={{ fontWeight: "bold" }}>
              {follow.username.length > maxlimit
                ? follow.username.substring(0, maxlimit - 3) + "..."
                : follow.username}
            </Text>
            <Text style={{}}>
              {follow.username.length > maxlimit
                ? follow.name.substring(0, maxlimit - 3) + "..."
                : follow.name}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              ...styles.followButton,
              backgroundColor: isSelf
                ? "black"
                : followingStatus[follow.id] == "true"
                ? "#065581"
                : "#DCDCDC",
            }}
            onPress={() =>
              !isSelf
                ? changeFollow(follow.id)
                : navigation.push("Profile", {
                    id: follow.id,
                  })
            }
          >
            <Text
              style={{
                ...styles.followButtonText,
                color: isSelf
                  ? "white"
                  : followingStatus[follow.id] == "true"
                  ? "white"
                  : "black",
                fontWeight: "bold",
              }}
            >
              {isSelf ? `View` : renderFollowingType()}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 2,
          width: "90%",
          backgroundColor: "#C8C8C8",
          alignSelf: "center",
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        placeholder="Search"
        placeholderTextColor="white"
        clearButtonMode="always"
      />
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={filteredData}
        extraData={followingStatus}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={renderItem}
        keyboardDismissMode={"on-drag"}
      />
    </View>
  );
};

export default Followers;
