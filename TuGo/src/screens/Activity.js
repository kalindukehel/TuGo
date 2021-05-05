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

const Activity = ({ navigation }) => {
  const { userToken } = useAuthState();
  const dispatch = useAuthDispatch();
  const notificationDispatch = useNotificationDispatch();
  const [activities, setActivities] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const firstRun = useRef(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Entypo name="chevron-right" size={30} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
        <Text style={{ fontWeight: "bold", color: Colors.FG }}>
          Follow Requests +
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
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
        ItemSeparatorComponent={ItemSeparatorView}
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
