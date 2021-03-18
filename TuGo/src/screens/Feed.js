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
import { Entypo } from "@expo/vector-icons";
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
  //push notifications expo
  const notificationListener = useRef();
  const responseListener = useRef();

  //tap active tab to scroll to the top
  const ref = React.useRef(null);
  useScrollToTop(ref);

  React.useLayoutEffect(() => {
    const BadgedIcon = withBadge()(Icon);
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.navigate("Activity");
          }}
        >
          {/* <BadgedIcon type="entypo" name="notification" size={30} style={{}} /> */}
          {unread ? (
            <Entypo name="notification" size={24} color="red" />
          ) : (
            <Entypo name="notification" size={24} color={Colors.FG} />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, unread]);

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

  const renderItem = (component) => {
    const postId = component.item.post;
    return <PostComponent postId={postId} navigation={navigation} />;
  };

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
        ref={ref}
        data={feed}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
