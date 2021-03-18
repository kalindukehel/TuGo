import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator, TransitionSpecs } from "@react-navigation/stack";
import SongSelection from "../screens/CreatePost/SongSelection";
import VideoSelection from "../screens/CreatePost/VideoSelection";
import CaptionSelection from "../screens/CreatePost/CaptionSelection";
import { Colors } from "../../constants";

const Stack = createStackNavigator();
const CreatePostNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SongSelection" mode="modal">
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
        name="New Post"
        component={SongSelection}
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
    </Stack.Navigator>
  );
};

export default CreatePostNavigator;
