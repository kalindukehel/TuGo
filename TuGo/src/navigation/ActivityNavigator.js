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
import { Colors } from "../../constants";

const Stack = createStackNavigator();

const ActivityNavigator = () => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Activity" headerMode="screen">
      <Stack.Screen
        name="Activity"
        component={Activity}
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />

      <Stack.Screen
        name="Profile"
        options={{
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
        }}
        component={Profile}
      />

      <Stack.Screen
        name="Post"
        component={PostNavigator}
        options={{
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerShown: false,
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
        }}
      />

      <Stack.Screen
        name="Following"
        options={{
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          gestureResponseDistance: {
            horizontal: 300,
          },
          title: "Following",
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
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
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          gestureResponseDistance: {
            horizontal: 300,
          },
          title: "Followers",
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
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
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          gestureResponseDistance: {
            horizontal: 300,
          },
          title: "Follow Requests",
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
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
