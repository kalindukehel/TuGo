import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, RefreshControl, FlatList } from "react-native";
import { useAuthDispatch } from "../context/authContext";
import { useAuthState } from "../context/authContext";
import { useNotificationDispatch } from "../context/notificationContext";

import LikeActivity from "../components/Activity/LikeActivity";
import CommentActivity from "../components/Activity/CommentActivity";
import FollowActivity from "../components/Activity/FollowActivity";
import TagActivity from "../components/Activity/TagActivity";

import { Entypo } from "@expo/vector-icons";

import { getActivity as getActivityAPI } from "../api";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "../../constants";
import { useScrollToTop } from "@react-navigation/native";
import GText from "../components/GText"

const Activity = ({ navigation }) => {
  const { userToken } = useAuthState();
  const dispatch = useAuthDispatch();
  const notificationDispatch = useNotificationDispatch();
  const [activities, setActivities] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const firstRun = useRef(true);

  //tap active tab to scroll to the top
  const ref = React.useRef(null);
  useScrollToTop(ref);

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
    notificationDispatch({ type: "ADD_NOTIFICATION", unread: false });
    onRefresh();
  }, []);

  React.useEffect(() => {
    //When navigation is changed update the activity item states
    const unsubscribe = navigation.addListener("focus", async () => {
      if (firstRun.current) {
        firstRun.current = false;
      } else {
        onRefresh();
      }
    });

    return unsubscribe;
  }, [navigation]);

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

  const getHeader = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.push("Follow Requests");
        }}
        style={{
          paddingVertical: 20,
          paddingLeft: 15,
          borderBottomWidth: 0.3,
        }}
      >
        <GText style={{ fontWeight: "bold", color: Colors.FG }}>
          Follow Requests +
        </GText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={activities}
        renderItem={renderActivity}
        ListHeaderComponent={getHeader}
        keyExtractor={(activity) => activity.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.FG}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
});

export default Activity;
