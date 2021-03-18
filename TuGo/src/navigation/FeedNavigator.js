import React from "react";
import { View, Text, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "../screens/Feed";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";
import ProfileNavigator from "./ProfileNavigator";
import FollowRequests from "../screens/FollowRequests";
import { useAuthState } from "../context/authContext";

const Stack = createStackNavigator();

const FeedNavigator = () => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator headerMode="screen" initialRouteName="Tugo">
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerStyle: {
            backgroundColor: "rgba(232, 232, 232, 0.8)",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
        name="Tugo"
        component={Feed}
      />
      <Stack.Screen
        name="Likes"
        component={Likes}
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="Comments"
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
        component={Comments}
      />
      <Stack.Screen
        name="Profile"
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerShown: false,
        }}
      >
        {(props) => {
          return <ProfileNavigator {...props} id={props.route.params.id} />;
        }}
      </Stack.Screen>
      <Stack.Screen
        name="Follow Requests"
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
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

export default FeedNavigator;
