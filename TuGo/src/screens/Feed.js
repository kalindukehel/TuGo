import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Button,
} from "react-native";
import { onSignOut } from "../auth";
import { useAuthDispatch } from "../context/authContext";
import { useAuthState } from "../context/authContext";
import {
  useNotificationState,
  useNotificationDispatch,
} from "../context/notificationContext";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { getFeedPosts as getFeedPostsAPI } from "../api";
import PostComponent from "../components/PostComponent";
import { useScrollToTop } from "@react-navigation/native";
import { Avatar, Badge, Icon, withBadge } from "react-native-elements";
import { Colors } from "../../constants";

const Feed = ({ navigation }) => {
  const { userToken, self } = useAuthState();
  const { unread } = useNotificationState();
  const dispatch = useAuthDispatch();
  const notificationDispatch = useNotificationDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [feed, setFeed] = useState(null);
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
    <SafeAreaView style={styles.container}>
      <FlatList
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
});

export default Feed;
