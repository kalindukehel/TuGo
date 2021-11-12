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
  pushNotification as pushNotificationAPI,
} from "../../api";
import { FlatList } from "react-native-gesture-handler";
import { API_URL } from "../../../constants";
import * as Haptics from "expo-haptics";
import { Colors, appTheme } from "../../../constants";
import FollowTile from "../../components/FollowTile"

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  textInputStyle: {
    marginTop: 10,
    height: 40,
    paddingLeft: 20,
    borderRadius: 20,
    color: Colors.text,
    borderColor: Colors.FG,
    borderWidth: 1,
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

  const renderItem = ({item}) => {
    return (
    <FollowTile user={item} navigation={navigation}/>
    )
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        keyboardAppearance={appTheme}
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        placeholder="Search"
        placeholderTextColor={Colors.text}
        clearButtonMode="always"
      />
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={filteredData}
        extraData={followingStatus}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.FG}
          />
        }
        renderItem={renderItem}
        keyboardDismissMode={"on-drag"}
        // ListHeaderComponent={header}
        ListHeaderComponentStyle={{ margin: 10 }}
      />
    </View>
  );
};

export default Followers;
