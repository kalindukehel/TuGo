import React, {useState, useEffect} from "react";
import { View, Text, TextInput, RefreshControl, TouchableWithoutFeedback, Keyboard, StyleSheet, KeyboardAvoidingView,Animated, SafeAreaView, StatusBar } from "react-native";
import { useAuthState } from "../../context/authContext";
import Tiles from '../../components/Tiles';
import SearchBar from '../../components/SearchBar';
import {
    getFollowers as getFollowersAPI,
  } from "../../api";
import { FlatList } from "react-native-gesture-handler";

// console.disableYellowBox = true;  

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const styles = StyleSheet.create({
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
  });

const Followers = (props) => {
  const { navigation } = props;
  const { id } = props.route.params;
  const { userToken } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [search, setSearch] = useState('');
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getUserStates() {
      const followersState = await getFollowersAPI(userToken, id);
      setFollowers(followersState.data);
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
  const searchBar = () => {
    return(
      <TextInput
        onChangeText={(username) => setSearch(username)}
        placeholder="Search Followers..."
        autoCapitalize="none"
        keyboardType="default"
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
        blurOnSubmit={false}
        style={styles.input}
      />
    )
  }
  const renderItem = (item) => {
    const follower = item.item.follower;
    return(
      <Text>
        {follower.username}
      </Text>
    )
  }
  return (
    <FlatList
      ListHeaderComponent={searchBar}
      data={followers}
      renderItem={renderItem}
    />
  //   <Animated.View>
  //     <SearchBar clampedScroll={clampedScroll} />
  //     <Animated.ScrollView
  //       showsVerticalScrollIndicator={false}
  //       contentContainerStyle={{
  //         display: 'flex',
  //         flexDirection: 'row',
  //         flexWrap: 'wrap',
  //         justifyContent: 'space-around'
  //       }}
  //       onScroll={Animated.event(
  //         [{ nativeEvent: { contentOffset: { y: scrollYValue } }, useNativeDriver: true, }],
  //         // { useNativeDriver: true },
  //         () => { },          // Optional async listener
  //       )}
  //       contentInsetAdjustmentBehavior="automatic">
  //       {followers.map(item => <Tiles tile={item}/>)}
  //     </Animated.ScrollView>
  // </Animated.View>
  );
};

export default Followers;
