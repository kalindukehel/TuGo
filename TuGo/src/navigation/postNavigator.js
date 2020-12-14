import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Post from "../screens/Post";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";
import { useAuthState } from "../context/authContext";
import Profile from "../screens/Profile/Profile";

const Stack = createStackNavigator();

const postNavigator = (props) => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Post" headerMode="screen">
      <Stack.Screen name="Post" component={Post} headerMode="screen"/>
      <Stack.Screen name="Likes" component={Likes} headerMode="screen"/>
      <Stack.Screen 
        name="Comments" 
        component={Comments} 
        headerMode="screen"
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        headerMode="screen"
      />
    </Stack.Navigator>
  );
};

export default postNavigator;
