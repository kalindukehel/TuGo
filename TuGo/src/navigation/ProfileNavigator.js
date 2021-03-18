import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile/Profile";
import Followers from "../screens/Profile/Follow";
import Following from "../screens/Profile/Follow";
import Favorites from "../screens/Favorites";
import EditProfile from "../screens/EditProfile";
import SettingsNavigator from "./SettingsNavigator";
import PostNavigator from "./PostNavigator";
import { useAuthState } from "../context/authContext";

const Stack = createStackNavigator();

const ProfileNavigator = ({ id, fromMyProfile }) => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Profile" headerMode="screen">
      <Stack.Screen
        options={{
          title: self.username,
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
        name="Profile"
      >
        {(props) => (
          <Profile {...props} id={id} fromMyProfile={fromMyProfile} />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />

      <Stack.Screen
        name="Post"
        component={PostNavigator}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
      />

      <Stack.Screen
        name="Following"
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          title: "Following",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
        component={Following}
      />

      <Stack.Screen
        name="Followers"
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          title: "Followers",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
        component={Followers}
      />
      <Stack.Screen
        name="Favorites"
        options={{
          title: "Favorites",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
        component={Favorites}
      />
      <Stack.Screen
        name="Edit Profile"
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          title: "Edit Profile",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
        component={EditProfile}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
