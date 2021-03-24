import React from "react";
import { createStackNavigator, TransitionSpecs } from "@react-navigation/stack";
import Explore from "../screens/Explore/Explore";
import CreatePostNavigator from "../navigation/CreatePostNavigator";
import { useAuthState } from "../context/authContext";
import ProfileNavigator from "../navigation/ProfileNavigator";
import PostNavigator from "../navigation/PostNavigator";
import Chart from "../screens/Explore/Chart.js";
import Artist from "../screens/Explore/Artist.js";
import RelatedArtists from "../screens/Explore/RelatedArtists.js";
import ExplorePostsAll from "../screens/Explore/ExplorePostsAll.js";
import ArtistInfo from "../screens/Explore/ArtistInfo.js";
import VideoSelection from "../screens/CreatePost/VideoSelection";
import CaptionSelection from "../screens/CreatePost/CaptionSelection";
import { Colors } from "../../constants";
const Stack = createStackNavigator();

const explorerNavigator = () => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Explore">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Explore"
        component={Explore}
        mode={"modal"}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerStyle: {
            height: Expo.Constants.statusBarHeight,
          },
          gestureEnabled: false,
        }}
        name="New Post"
        component={CreatePostNavigator}
      />
      <Stack.Screen
        name="Profile"
        options={{
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
        name="Post"
        component={PostNavigator}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
        }}
      />
      <Stack.Screen
        name="Chart"
        component={Chart}
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
        name="Explore Posts"
        component={ExplorePostsAll}
      />
    </Stack.Navigator>
  );
};

export default explorerNavigator;
