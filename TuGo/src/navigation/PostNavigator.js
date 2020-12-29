import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Post from "../screens/Post";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";
import { useAuthState } from "../context/authContext";
import Profile from "../screens/Profile/Profile";
import Tile from "../screens/Tile";

const Stack = createStackNavigator();

const PostNavigator = ({ id }) => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Post" headerMode="screen">
      <Stack.Screen
        name="Post"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: "black",
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
        }}
        component={Profile}
      />
      <Stack.Screen
        name="Tile"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
        component={Tile}
      />
    </Stack.Navigator>
  );
};

export default PostNavigator;