import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "../screens/Settings";

const Stack = createStackNavigator();

const settingsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Settings" headerMode="float">
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default settingsNavigator;