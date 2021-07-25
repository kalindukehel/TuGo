import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Feed from "../screens/Feed";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";
import Artist from "../screens/Explore/Artist.js";
import ArtistInfo from "../screens/Explore/ArtistInfo.js";
import RelatedArtists from "../screens/Explore/RelatedArtists.js";
import ShareToDirect from "../screens/Others/ShareToDirect";
import ProfileNavigator from "./ProfileNavigator";
import FollowRequests from "../screens/FollowRequests";
import VideoSelection from "../screens/CreatePost/VideoSelection";
import CaptionSelection from "../screens/CreatePost/CaptionSelection";
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
            backgroundColor: Colors.Header,
            opacity: 1
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
            color: Colors.text,
          },
        }}
        name="TuGo"
        component={Feed}
      />
      <Stack.Screen
        name="Likes"
        component={Likes}
        options={{
          headerStyle: {
            backgroundColor: Colors.Header,
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
            backgroundColor: Colors.Header,
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
            backgroundColor: Colors.Header,
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

export default FeedNavigator;
