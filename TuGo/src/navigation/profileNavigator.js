import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile";
import settingsNavigator from "./settingsNavigator";

const Stack = createStackNavigator();

const profileNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Profile" headerMode="none">
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={settingsNavigator} headerMode="screen" />
    </Stack.Navigator>
  );
};

export default profileNavigator;
