import React from "react";
import { createStackNavigator, TransitionSpecs } from "@react-navigation/stack";
import Explore from "../screens/Explore";
import CreatePostNavigator from "../navigation/CreatePostNavigator";
import { useAuthState } from "../context/authContext";

const Stack = createStackNavigator();

const explorerNavigator = () => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Explore" mode="modal">
      <Stack.Screen
        options={{ headerStyle: { height: Expo.Constants.statusBarHeight } }}
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
    </Stack.Navigator>
  );
};

export default explorerNavigator;
