import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator, TransitionSpecs } from "@react-navigation/stack";
import CreatePost from "../screens/CreatePost";

const Stack = createStackNavigator();
const CreatePostNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CreatePost" mode="modal">
      <Stack.Screen
        options={{
          headerStyle: {
            height: Expo.Constants.statusBarHeight,
          },
          headerShown: false,
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          gestureEnabled: false,
        }}
        name="New Post"
        component={CreatePost}
      />
    </Stack.Navigator>
  );
};

export default CreatePostNavigator;
