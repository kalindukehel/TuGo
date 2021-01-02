import React from "react";
import { createStackNavigator, TransitionSpecs } from "@react-navigation/stack";
import Activity from "../screens/Activity";
import { useAuthState } from "../context/authContext";
import ProfileNavigator from "./ProfileNavigator";
import PostNavigator from "./PostNavigator";
import Followers from "../screens/Profile/Follow";
import Following from "../screens/Profile/Follow";
import Profile from "../screens/Profile/Profile";
import FollowRequests from "../screens/FollowRequests";

const Stack = createStackNavigator();

const ActivityNavigator = () => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Activity" headerMode="screen">
      <Stack.Screen
        name="Activity"
        component={Activity}
        options={{
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />

      <Stack.Screen
        name="Profile"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
        component={Profile}
      />

      <Stack.Screen
        name="Post"
        component={PostNavigator}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
      />

      <Stack.Screen
        name="Following"
        options={{
          title: "Following",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
        component={Following}
      />

      <Stack.Screen
        name="Followers"
        options={{
          title: "Followers",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
        component={Followers}
      />
      <Stack.Screen
        name="Follow Requests"
        options={{
          title: "Follow Requests",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
        component={FollowRequests}
      />
    </Stack.Navigator>
  );
};

export default ActivityNavigator;
