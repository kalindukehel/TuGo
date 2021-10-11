import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "../screens/Settings";
import Liked from "../screens/Liked";
import Policies from "../screens/Policies";
import { useAuthState } from "../context/authContext";

const Stack = createStackNavigator();

const SettingsNavigator = () => {
  const { self } = useAuthState();
  const config = {
    animation: "spring",
    config: {
      stiffness: 2000,
      damping: 500,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };
  return (
    <Stack.Navigator initialRouteName="Settings" headerMode="none">
      <Stack.Screen 
        name="Settings" 
        component={Settings} 
      />
      <Stack.Screen 
        name="Liked" 
        component={Liked} 
        options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
      <Stack.Screen 
        name="Policies" 
        component={Policies} 
        options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
