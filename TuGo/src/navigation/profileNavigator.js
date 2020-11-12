import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile/Profile";
import Followers from "../screens/Profile/Followers";
import Following from "../screens/Profile/Following";
import settingsNavigator from "./settingsNavigator";
import { useAuthState } from "../context/authContext";

const Stack = createStackNavigator();

const profileNavigator = () => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        options={{
          title: self.username,
        }}
        name="Profile"
        component={Profile}
        headerMode="screen"
      />
      <Stack.Screen name="Settings" component={settingsNavigator} headerMode="screen" />
      <Stack.Screen name="Following" component={Following} headerMode="screen" />
      <Stack.Screen name="Followers" component={Followers} headerMode="screen" />
    </Stack.Navigator>
  );
};

export default profileNavigator;
