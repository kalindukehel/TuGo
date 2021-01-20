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
import { sendPushNotification as sendPushNotificationAPI } from "../api";
import { useAuthState } from "../context/authContext";
import { Entypo } from "@expo/vector-icons";
import {
  getFeedPosts as getFeedPostsAPI,
  postNotificationToken as postNotificationTokenAPI,
} from "../api";
import PostComponent from "../components/PostComponent";
import { useScrollToTop } from "@react-navigation/native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Feed = ({ navigation }) => {
  const { userToken, self } = useAuthState();
  const dispatch = useAuthDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [feed, setFeed] = useState(null);

  const responseListener = useRef();

  //tap active tab to scroll to the top
  const ref = React.useRef(null);
  useScrollToTop(ref);

  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      let token;
      if (Constants.isDevice) {
        const {
          status: existingStatus,
        } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      const res = await postNotificationTokenAPI(token, userToken, self.id);
    }
    registerForPushNotificationsAsync();
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {}
    );
    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { data: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

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
      <Button
        title="Send Push Notification"
        onPress={() =>
          sendPushNotification("ExponentPushToken[qKlMx_IBs_gEiC_R3mnuWk]")
        }
      />
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
