import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { getPostLikes as getPostLikesAPI, by_ids as by_idsAPI } from "../api";
import { useAuthState } from "../context/authContext";
import { API_URL } from "../../constants";
import { FlatList } from "react-native-gesture-handler";
import AccountTile from "../components/AccountTile";
import { Colors, appTheme } from "../../constants";

var { width, height } = Dimensions.get("window");

const maxlimit = 20;

const Likes = (props) => {
  const { navigation } = props;
  const { postId } = props.route.params;
  const { userToken, self } = useAuthState();
  const [filteredData, setFilteredData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  let list = [];

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    async function getPostStates() {
      const likesRes = await getPostLikesAPI(userToken, postId);
      list = likesRes.data.map((item) => item.author);
      const res = await by_idsAPI(list, userToken);
      setFilteredData(res.data);
      setMasterData(res.data);
    }
    await getPostStates();
    setRefreshing(false);
  }, []);
  useEffect(() => {
    onRefresh();
  }, []);

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

  const renderItem = (item) => {
    let follow = item.item;
    return <AccountTile account={follow} navigation={navigation} />;
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.8,
          width: "90%",
          backgroundColor: "#C8C8C8",
          alignSelf: "center",
        }}
      />
    );
  };

  // const header = () => (
  //   <TextInput
  //     keyboardAppearance={appTheme}
  //     style={styles.textInputStyle}
  //     onChangeText={(text) => {
  //       setSearch(text);
  //       searchFilterFunction(text);
  //     }}
  //     value={search}
  //     placeholder="Search"
  //     placeholderTextColor={Colors.text}
  //     clearButtonMode="always"
  //   />
  // );

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
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.FG}
          />
        }
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={renderItem}
        keyboardDismissMode={"on-drag"}
        ListHeaderComponentStyle={{ margin: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  textInputStyle: {
    marginTop: 10,
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    borderRadius: 20,
    color: Colors.text,
    borderColor: Colors.FG,
  },
  followButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.complimentText,
    padding: 3,
  },
  followButtonText: {
    alignSelf: "flex-end",
  },
  followElement: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 20,
  },
});

export default Likes;
