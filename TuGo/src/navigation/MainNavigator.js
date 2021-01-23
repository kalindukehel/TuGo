import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Image } from "react-native";
import HomeScreen from "../screens/Feed";
import Activity from "../screens/Activity";
import ProfileNavigator from "./ProfileNavigator";
import ExploreNavigator from "./ExploreNavigator";
import FeedNavigator from "./FeedNavigator";
import NotificationExample from "../screens/NotificationExample";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuthState, useAuthDispatch } from "../context/authContext";
import {
  useNotificationState,
  useNotificationDispatch,
} from "../context/notificationContext";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { postNotificationToken as postNotificationTokenAPI } from "../api";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

const MainNavigator = () => {
  const navigation = useNavigation();
  const { userToken, self } = useAuthState();
  const notificationDispatch = useNotificationDispatch();
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
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
          alert("Turn on Notifications from settings");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
      } else {
        //alert("Must use physical device for Push Notifications");
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
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        notificationDispatch({ type: "ADD_NOTIFICATION", unread: true });
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const type = response.notification.request.content.data.body.type;
        if (type == "follow") {
          navigation.navigate("Activity");
        } else if (type == "like") {
          navigation.navigate("Activity");
        } else if (type == "request") {
          navigation.navigate("Follow Requests");
        } else if (type == "comment") {
          navigation.navigate("Activity");
        }
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Feed") {
            iconName = focused ? "md-home" : "md-home";
          } else if (route.name === "Profile") {
            return (
              <Image
                source={{ uri: self.profile_picture }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  borderWidth: focused ? 1 : 0.5,
                }}
              ></Image>
            );
          } else if (route.name === "Explore") {
            iconName = focused ? "md-add-circle" : "md-add-circle-outline";
          }

          // You can return any component that you like here!

          if (route.name === "Explore") {
            return (
              <Image
                transition={false}
                style={{ height: 40, width: 40 }}
                resizeMode={"contain"}
                source={
                  focused
                    ? require(`../../assets/ExploreIconActive.png`)
                    : require(`../../assets/ExploreIcon.png`)
                }
              ></Image>
            );
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "black",
        inactiveTintColor: "gray",
      }}
      style={{
        backgroundColor: "black",
      }}
    >
      <Tab.Screen name="Feed" component={FeedNavigator} options={{}} />
      <Tab.Screen name="Explore" component={ExploreNavigator} />
      <Tab.Screen name="Profile">
        {(props) => (
          <ProfileNavigator {...props} id={self.id} fromMyProfile={true} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainNavigator;
