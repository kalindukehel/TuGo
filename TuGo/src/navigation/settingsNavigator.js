import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "../screens/Settings";
import { useAuthState } from "../context/authContext";

const Stack = createStackNavigator();

const settingsNavigator = () => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Settings" headerMode="none">
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default settingsNavigator;
