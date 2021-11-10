import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Image } from "react-native";
import HomeScreen from "../screens/Feed";
import Activity from "../screens/Activity";
import ProfileNavigator from "./ProfileNavigator";
import ExploreNavigator from "./ExploreNavigator";
import FeedNavigator from "./FeedNavigator";
import ActivityNavigator from "./ActivityNavigator";
import DirectNavigator from "./DirectNavigator";
import NotificationExample from "../screens/NotificationExample";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useAuthState, useAuthDispatch } from "../context/authContext";
import {
  useNotificationState,
  useNotificationDispatch,
} from "../context/notificationContext";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { postNotificationToken as postNotificationTokenAPI } from "../api";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants";
import { SimpleLineIcons } from "@expo/vector-icons";

import { Auth, API, graphqlOperation } from "aws-amplify";
import { getUser } from "../graphql/queries";
import { createUser, updateUser } from "../graphql/mutations";
import { OpaqueColorValue } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//notification setup
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

  //aws create user if not in database
  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = self;
      if (userInfo) {
        const userData = await API.graphql(
          graphqlOperation(getUser, { id: self.id })
        );

        if (userData.data.getUser) {
          // User is already registered in database
          return;
        }
        // User not in database
        const newUser = {
          id: self.id,
          name: userInfo.name,
          username: userInfo.username,
          imageUri: userInfo.profile_picture,
          status: "Hey, I am using Tugo",
        };
        await API.graphql(graphqlOperation(createUser, { input: newUser }));
      }
    };

    fetchUser();
  }, []);

  //notification listener
  useEffect(() => {
    let token;
    async function registerForPushNotificationsAsync() {
      if (Constants.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
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
      console.log(token);
      try {
        const res = await postNotificationTokenAPI(token, userToken, self.id);
      } catch (e) {
        alert(e);
      }
    }
    registerForPushNotificationsAsync();
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        notificationDispatch({ type: "ADD_NOTIFICATION", unread: true });
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const type = response.notification.request.content.data.type;
        if (type == "follow") {
          navigation.navigate("Activity");
        } else if (type == "like") {
          navigation.navigate("Activity");
        } else if (type == "request") {
          navigation.navigate("Follow Requests");
        } else if (type == "comment") {
          navigation.navigate("Activity");
        } else if (type == "tag") {
          navigation.navigate("Activity");
        } else if (type == "message") {
          navigation.navigate("Chat");
        }
      });

    //aws create user if not in database
    const fetchUser = async () => {
      const userInfo = self;
      console.log(self.notification_token);
      if (userInfo) {
        const userData = await API.graphql(
          graphqlOperation(getUser, { id: self.id })
        );

        if (userData.data.getUser) {
          // User is already registered in database
          const update = {
            id: userData.data.getUser.id,
            expoPushToken: token,
          };
          const chatRoomData = await API.graphql(
            graphqlOperation(updateUser, { input: update })
          );

          return;
        }
        // User not in database
        const newUser = {
          id: self.id,
          name: userInfo.name,
          username: userInfo.username,
          imageUri: userInfo.profile_picture,
          status: "Hey, I am using Tugo",
          expoPushToken: self.notification_token,
        };
        await API.graphql(graphqlOperation(createUser, { input: newUser }));
      }
    };

    fetchUser();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <Tab.Navigator
      lazy={true}
      initialRouteName="Feed"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Feed") {
            iconName = focused ? "md-home" : "md-home";
          } else if (route.name === "Profile") {
            return (
              self && <Image
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
              <SimpleLineIcons name="magnifier-add" size={24} color={color} />
            );
          } else if (route.name === "Chat") {
            return <FontAwesome name="send" size={20} color={color} />;
          } else if (route.name === "Activity") {
            return <Entypo name="notification" size={24} color={color} />;
          } else {
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.FG,
        inactiveTintColor: "gray",
        style: {
          backgroundColor: Colors.Footer,
        },
      }}
    >
      <Tab.Screen name="Feed" component={FeedNavigator} />
      <Tab.Screen name="Chat" component={DirectNavigator} />
      <Tab.Screen name="Explore" component={ExploreNavigator} />
      <Tab.Screen name="Activity" component={ActivityNavigator} />
      <Tab.Screen name="Profile">
        {(props) => (
          <ProfileNavigator {...props} id={self.id} fromMyProfile={true} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainNavigator;
