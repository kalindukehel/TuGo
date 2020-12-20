import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile/Profile";
import Followers from "../screens/Profile/Follow";
import Following from "../screens/Profile/Follow";
import settingsNavigator from "./settingsNavigator";
import postNavigator from "./postNavigator";
import { useAuthState } from "../context/authContext";

const Stack = createStackNavigator();

const profileNavigator = ({username}) => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Profile" headerMode="screen">
      <Stack.Screen
        options={{
          title: self.username,
          headerBackTitleVisible: false,
          headerTintColor: 'black',
        }}
        name="Profile"
        component={Profile}
      />
      <Stack.Screen name="Settings" 
        component={settingsNavigator} 
        options={{
          headerBackTitleVisible: false,
          headerTintColor: 'black'
        }}
      />
      <Stack.Screen name="Post" 
        component={postNavigator} 
        options={{
          headerShown:false,
          headerBackTitleVisible: false,
          headerTintColor: 'black'
        }}
      />
      <Stack.Screen 
        name="Following" 
        options={{
          title: "Following",
          headerBackTitleVisible: false,
          headerTintColor: 'black'
        }}
        component={Following} 
      />
      <Stack.Screen 
        name="Followers" 
        options={{
          title: "Followers",
          headerBackTitleVisible: false,
          headerTintColor: 'black'
        }}
        component={Followers} 
      />
    </Stack.Navigator>
  );
};

export default profileNavigator;
