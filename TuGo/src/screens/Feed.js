import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Image,
} from "react-native";
import { onSignOut } from "../auth";
import { useAuthDispatch } from "../context/authContext";
import { useAuthState } from "../context/authContext";
import {
  useNotificationState,
  useNotificationDispatch,
} from "../context/notificationContext";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { getFeedPosts as getFeedPostsAPI,
  trendingPosts as trendingPostsAPI } from "../api";
import PostComponent from "../components/PostComponent";
import { useScrollToTop } from "@react-navigation/native";
import { Avatar, Badge, Icon, withBadge } from "react-native-elements";
import { Colors } from "../../constants";
import TrendingItem from "../components/TrendingItem";
import { AntDesign } from '@expo/vector-icons';
import GText from "../components/GText"

let {height, width} = Dimensions.get('window')

const leftSpacing = 20;

const Feed = ({ navigation }) => {
  const { userToken, self } = useAuthState();
  const { unread } = useNotificationState();
  const dispatch = useAuthDispatch();
  const notificationDispatch = useNotificationDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [feed, setFeed] = useState(null);
  const [trending, setTrending] = useState(null);
  const [disableScroll, setDisableScroll] = useState(false);
  //push notifications expo
  const notificationListener = useRef();
  const responseListener = useRef();

  //tap active tab to scroll to the top
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getFeedState() {
      const feedState = await getFeedPostsAPI(userToken);
      const trendingRes = await trendingPostsAPI(userToken)
      setTrending(trendingRes.data);
      setFeed(feedState.data);
    }
    getFeedState();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 30,
          alignSelf: "center",
        }}
      />
    );
  };

  return (
    trending && 
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={{paddingVertical: 10}}
        scrollEnabled={!disableScroll}
        ref={ref}
        data={feed}
        renderItem={({ item }) => (
          <PostComponent
            postId={item.post}
            navigation={navigation}
            setDisableScroll={setDisableScroll}
            goBackOnDelete={false}
          />
        )}
        keyExtractor={(item, index) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.FG}
          />
        }
        ListEmptyComponent={() => {
          return (
            trending.length > 0 ? <View>
              <GText style={styles.header}>Trending</GText>
              <FlatList
                horizontal
                data={trending}
                renderItem={({ item }) => {
                  return (
                  <TrendingItem
                    postId={item.id}
                    navigation={navigation}
                  />
                )}}
                keyExtractor={(item, index) => item.id.toString()}
                onRefresh={refreshing}
                ItemSeparatorComponent={ItemSeparatorView}
                contentContainerStyle={{marginBottom: 20, marginHorizontal: leftSpacing}}
              />
          </View> : 
          <View style={styles.emptyTrending}>
            <GText style={{color: Colors.text, marginBottom: 20}}>Follow users to add to feed</GText>
            <AntDesign name="adduser" size={24} color={Colors.FG} />
          </View>
          )
        }}
        onRefresh={refreshing}
        ItemSeparatorComponent={ItemSeparatorView}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  header: {
    fontSize: 25, 
    fontWeight: 'bold', 
    color: Colors.text, 
    marginLeft: leftSpacing, 
    marginVertical: 10
  },
  footer: {
    fontSize: 20, 
    color: Colors.text, 
  },
  emptyTrending: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: Colors.contrastGray, 
    flexDirection: 'column',
    margin: 50,
    padding: 50,
    borderRadius: 20
  }
});

export default Feed;
