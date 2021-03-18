import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Post from "../screens/Post";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";
import { useAuthState } from "../context/authContext";
import Profile from "../screens/Profile/Profile";
import Tile from "../screens/Tile";
import Artist from "../screens/Explore/Artist.js";
import { Colors } from "../../constants";

const Stack = createStackNavigator();

const PostNavigator = ({ id }) => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Post" headerMode="screen">
      <Stack.Screen
        name="Post"
        options={{
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
      >
        {(props) => <Post {...props} id={id} />}
      </Stack.Screen>
      <Stack.Screen
        name="Likes"
        component={Likes}
        options={{
          headerStyle: {
            backgroundColor: Colors.BG,
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
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
        }}
        component={Comments}
      />
      <Stack.Screen
        name="Profile"
        options={{
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
        }}
        component={Profile}
      />
      <Stack.Screen
        name="Tile"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
        }}
        component={Tile}
      />
      <Stack.Screen
        name="Artist"
        component={Artist}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: Colors.primary,
            shadowRadius: 0,
            shadowOffset: {
              height: 0,
            },
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default PostNavigator;
