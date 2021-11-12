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
      if (feedState.data.length === 0) {
        const trendingRes = await trendingPostsAPI(userToken)
        setTrending(trendingRes.data);
      }else{
        setFeed(feedState.data);
      }
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
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={() => trending && <Text style={styles.header}>Trending</Text>}
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
        onRefresh={refreshing}
        ItemSeparatorComponent={ItemSeparatorView}
        ListFooterComponent={
          () => trending && 
          <View style={{
            backgroundColor: Colors.contrastGray, 
            paddingLeft: leftSpacing, 
            paddingVertical: 10, 
            marginVertical: 20, 
            borderRadius: 20,
          }}>
            <Text style={styles.footer}>
              Follow to personalize feed
            </Text>
            <View style={{marginTop: 20, flexDirection: 'row', borderRadius: 999, backgroundColor: Colors.gray, width: 0.5 * width }}>
              <Image style={{height: 70, width: 70, borderRadius: 999}} source={{uri: self.profile_picture}} />
              <View style={{flexDirection: 'column', marginTop: 10, marginLeft: 15,}}>
                <Text style={{color: Colors.complimentText, fontWeight: 'bold'}}>{self.name}</Text>
                <Text style={{color: Colors.complimentText, fontWeight: '400'}}>{self.username}</Text>
              </View>
            </View>
          </View>
        }
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
    marginVertical: 20
  },
  footer: {
    fontSize: 20, 
    color: Colors.text, 
  }
});

export default Feed;
