import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from "react-native";
import { onSignOut } from "../auth";
import { useAuthDispatch } from "../context/authContext";
import { signOut as signOutAPI } from "../api";
import { useAuthState } from "../context/authContext";
import { Entypo } from "@expo/vector-icons";
import { getFeedPosts as getFeedPostsAPI } from "../api";
import PostComponent from "../components/PostComponent";
import { useScrollToTop } from "@react-navigation/native";

const Feed = ({ navigation }) => {
  const { userToken } = useAuthState();
  const dispatch = useAuthDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [feed, setFeed] = useState(null);

  //tap active tab to scroll to the top
  const ref = React.useRef(null);
  useScrollToTop(ref);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.navigate("Activity");
          }}
        >
          <Entypo name="notification" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
        keyExtractor={(item, index) => index.toString()}
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
  },
});

export default Feed;
