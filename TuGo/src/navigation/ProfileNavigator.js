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
import { Colors } from "../../constants";

const Stack = createStackNavigator();

const ProfileNavigator = ({ id, fromMyProfile }) => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Profile" headerMode="screen">
      <Stack.Screen
        options={{
          title: self.username,
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: Colors.BG,
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
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
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
          headerTintColor: Colors.text,
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
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: Colors.BG,
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
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: Colors.BG,
          },
        }}
        component={Followers}
      />
      <Stack.Screen
        name="Favorites"
        options={{
          title: "Favorites",
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: Colors.BG,
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
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: Colors.BG,
          },
        }}
        component={EditProfile}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
