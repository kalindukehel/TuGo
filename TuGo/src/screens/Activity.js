import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, RefreshControl, FlatList } from "react-native";
import { useAuthDispatch } from "../context/authContext";
import { useAuthState } from "../context/authContext";

import LikeActivity from "../components/Activity/LikeActivity";
import CommentActivity from "../components/Activity/CommentActivity";
import FollowActivity from "../components/Activity/FollowActivity";
import TagActivity from "../components/Activity/TagActivity";

import { getActivity as getActivityAPI } from "../api";
import { TouchableOpacity } from "react-native-gesture-handler";

const Activity = ({ navigation }) => {
  const { userToken } = useAuthState();
  const dispatch = useAuthDispatch();
  const [activities, setActivities] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getActivityStates() {
      const activityRes = await getActivityAPI(userToken);
      setActivities(activityRes.data);
    }
    getActivityStates();
    setRefreshing(false);
  }, []);
  useEffect(() => {
    onRefresh();
  }, []);

  const renderActivity = (activity) => {
    const curActivity = activity.item;
    return (
      <View>
        {curActivity.activity_type == "LIKE" && (
          <LikeActivity activity={curActivity} navigation={navigation} />
        )}
        {curActivity.activity_type == "COMMENT" && (
          <CommentActivity activity={curActivity} navigation={navigation} />
        )}
        {curActivity.activity_type == "TAG" && (
          <TagActivity activity={curActivity} navigation={navigation} />
        )}
        {curActivity.activity_type == "FOLLOW" && (
          <FollowActivity activity={curActivity} navigation={navigation} />
        )}
      </View>
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
      <TouchableOpacity
        onPress={() => {
          navigation.push("Follow Requests");
        }}
      >
        <Text>Follow Requests</Text>
      </TouchableOpacity>
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={(activity) => activity.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={ItemSeparatorView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Activity;
