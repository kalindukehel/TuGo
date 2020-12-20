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
      <Stack.Screen name="Post"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: 'black'
        }}
        component={Post}/>
      <Stack.Screen name="Likes" component={Likes}/>
      <Stack.Screen 
        name="Comments"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: 'black'
        }} 
        component={Comments}
      />
      <Stack.Screen
        name="Profile"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: 'black'
        }}
        component={Profile}
      />
    </Stack.Navigator>
  );
};

export default postNavigator;
