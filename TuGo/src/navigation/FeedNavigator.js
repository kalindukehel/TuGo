import React from "react";
import { View, Text, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "../screens/Feed";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";
import ProfileNavigator from "./ProfileNavigator";
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
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.36,
            shadowRadius: 6.68,

            elevation: 11,
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
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="Comments"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
        component={Comments}
      />
      <Stack.Screen
        name="Profile"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerShown: false,
        }}
      >
        {(props) => {
          return <ProfileNavigator {...props} id={props.route.params.id} />;
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default FeedNavigator;
