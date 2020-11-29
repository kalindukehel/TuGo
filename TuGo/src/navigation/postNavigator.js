import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Post from "../screens/Post";
import { useAuthState } from "../context/authContext";

const Stack = createStackNavigator();

const postNavigator = (props) => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Post" headerMode="float">
      <Stack.Screen name="Post" component={Post} />
    </Stack.Navigator>
  );
};

export default postNavigator;
