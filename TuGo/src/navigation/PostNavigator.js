import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Post from "../screens/Post";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";
import { useAuthState } from "../context/authContext";
import Profile from "../screens/Profile/Profile";
import Tile from "../screens/Tile";
import Artist from "../screens/Explore/Artist.js";
import ArtistInfo from "../screens/Explore/ArtistInfo.js";
import RelatedArtists from "../screens/Explore/RelatedArtists.js";
import VideoSelection from "../screens/CreatePost/VideoSelection";
import CaptionSelection from "../screens/CreatePost/CaptionSelection";
import ShareToDirect from "../screens/Others/ShareToDirect";
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
            backgroundColor: Colors.Header,
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
            backgroundColor: Colors.Header,
          },
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
        }}
      />
      <Stack.Screen
        name="Comments"
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerStyle: {
            backgroundColor: Colors.Header,
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
            backgroundColor: Colors.Header,
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
      <Stack.Screen
        name="ArtistInfo"
        component={ArtistInfo}
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
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
      <Stack.Screen
        name="Related Artists"
        component={RelatedArtists}
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
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
      <Stack.Screen
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          gestureEnabled: false,
        }}
        name="Video Selection"
        component={VideoSelection}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          gestureEnabled: false,
        }}
        name="Caption Selection"
        component={CaptionSelection}
      />
      <Stack.Screen
        options={{
          ...TransitionPresets.ModalTransition,
          cardStyle: { backgroundColor: "transparent" },
          headerShown: false,
        }}
        name="ShareToDirect"
        component={ShareToDirect}
      />
    </Stack.Navigator>
  );
};

export default PostNavigator;
