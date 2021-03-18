import React from "react";
import { View, Text, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "../screens/Feed";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";
import ProfileNavigator from "./ProfileNavigator";
import FollowRequests from "../screens/FollowRequests";
import { useAuthState } from "../context/authContext";
import { Colors } from "../../constants";

const Stack = createStackNavigator();

const FeedNavigator = () => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator headerMode="screen" initialRouteName="Tugo">
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
            color: Colors.text,
          },
        }}
        name="Tugo"
        component={Feed}
      />
      <Stack.Screen
        name="Likes"
        component={Likes}
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
      />
      <Stack.Screen
        name="Comments"
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
        component={Comments}
      />
      <Stack.Screen
        name="Profile"
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
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
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          title: "Follow Requests",
          headerBackTitleVisible: false,
          headerTintColor: Colors.FG,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
            color: Colors.text,
          },
        }}
        component={FollowRequests}
      />
    </Stack.Navigator>
  );
};

export default FeedNavigator;
