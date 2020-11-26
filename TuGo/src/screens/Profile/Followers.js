import React, {useState, useEffect} from "react";
import { View, Button, Text, TextInput, RefreshControl, Keyboard, StyleSheet, KeyboardAvoidingView, Image, TouchableOpacity } from "react-native";
import { useAuthState } from "../../context/authContext";
import {
    getFollowers as getFollowersAPI,
    getAccountById as getAccountByIdAPI,
    by_ids as by_idsAPI
  } from "../../api";
import { FlatList } from "react-native-gesture-handler";
import { API_URL } from "../../../constants";

// console.disableYellowBox = true;  

  const maxlimit = 20;

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const styles = StyleSheet.create({
    textInputStyle: {
      height: 40,
      borderWidth: 1,
      paddingLeft: 20,
      margin: 5,
      borderColor: '#009688',
      backgroundColor: '#FFFFFF',
    },
    input: {
      height: 40,
      borderColor: "gray",
      color: "black",
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 15,
      paddingHorizontal: 20,
      marginHorizontal: 10,
      backgroundColor: "#FFFFFF",
    },
    button: {
      backgroundColor: "black",
      borderWidth: 1,
      alignSelf: "flex-end",
      borderRadius: 5,
      paddingHorizontal: 5
    }
  });

const Followers = (props) => {
  const { navigation } = props;
  const { id, followerList } = props.route.params;
  const list = followerList.map((item) => item.follower);
  const { userToken, self } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState('');
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getUserStates() {
      const res = await by_idsAPI(list, userToken);
      setFilteredData(res.data);
      setMasterData(res.data);
    }
    getUserStates();
    wait(1000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    onRefresh();
  }, []);

  // const [scrollYValue, setScrollYValue] = useState(new Animated.Value(0));
  // const clampedScroll = Animated.diffClamp(
  //   Animated.add(
  //     scrollYValue.interpolate({
  //       inputRange: [0, 1],
  //       outputRange: [0, 1],
  //       extrapolateLeft: 'clamp',
  //       useNativeDriver: true,
  //     }),
  //     new Animated.Value(0),
  //   ),
  //   0,
  //   50,
  // )

const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource and update FilteredDataSource
        const newData = masterData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const usernameData = item.username
            ? item.username.toUpperCase()
            : ''.toUpperCase();
        const nameData = item.name
        ? item.name.toUpperCase()
        : ''.toUpperCase();
        const textData = text.toUpperCase();
        return usernameData.indexOf(textData) > -1 || nameData.indexOf(textData) > -1 ;
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
    let follower = item.item;
    console.log(follower);
    console.log(self.profile_picture);
    return(
      <View
        style={{borderColor: "#C8C8C8", borderWidth: 1, padding: 20, borderRadius: 20, flexDirection: "row", justifyContent: "space-between"}}>
        <Image
          source={{ uri: API_URL + follower.profile_picture }}
          style={{ width: 20, height: 20, borderRadius: 5, borderWidth: 1 }}
        ></Image>
        <Text
          style={{}}>{ ((follower.username).length > maxlimit) ? 
            (((follower.username).substring(0,maxlimit-3)) + '...') : 
            follower.username }
        </Text>
        <Text
          style={{paddingHorizontal: 20}}>{ ((follower.username).length > maxlimit) ? 
            (((follower.name).substring(0,maxlimit-3)) + '...') : 
            follower.name }
        </Text>
        <TouchableOpacity
          style={styles.button}>
          <Text
            style={{alignSelf: "flex-end", color: "white"}}>
            Following
          </Text>
        </TouchableOpacity>

      </View>
    )
  }

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 5,
          width: '90%',
          backgroundColor: '#C8C8C8',
          alignSelf: "center"
        }}
      />
    );
  };

  const getHeader = () => {
    return (
      // Flat List Item Separator
      <TextInput
      style={styles.textInputStyle}
      onChangeText={(text) => searchFilterFunction(text)}
      value={search}
      underlineColorAndroid="transparent"
      placeholder="Search Here"
    />
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
        contentContainerStyle={{ flexGrow: 1 }}
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={getHeader}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Followers;
