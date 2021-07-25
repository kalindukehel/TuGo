import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile/Profile";
import Followers from "../screens/Profile/Follow";
import Following from "../screens/Profile/Follow";
import Favorites from "../screens/Favorites";
import EditProfile from "../screens/EditProfile";
import Artist from "../screens/Explore/Artist.js";
import ArtistInfo from "../screens/Explore/ArtistInfo.js";
import RelatedArtists from "../screens/Explore/RelatedArtists.js";
import SettingsNavigator from "./SettingsNavigator";
import PostNavigator from "./PostNavigator";
import { useAuthState } from "../context/authContext";
import { Colors } from "../../constants";

const Stack = createStackNavigator();

const ProfileNavigator = ({ id, fromMyProfile }) => {
  const { self } = useAuthState();
  console.log(self.username)
  console.log(self.name)
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
            backgroundColor: Colors.Header,
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
            backgroundColor: Colors.Header,
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
            backgroundColor: Colors.Header,
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
            backgroundColor: Colors.Header,
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
            backgroundColor: Colors.Header,
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
            backgroundColor: Colors.Header,
          },
        }}
        component={EditProfile}
      />
      <Stack.Screen
        name="Artist"
        component={Artist}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: Colors.primary,
            shadowRadius: 0,
            shadowOffset: {
              height: 0,
            },
          },
        }}
      />
      <Stack.Screen
        name="ArtistInfo"
        component={ArtistInfo}
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerShown: true,
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: Colors.primary,
            shadowRadius: 0,
            shadowOffset: {
              height: 0,
            },
          },
        }}
      />
      <Stack.Screen
        name="Related Artists"
        component={RelatedArtists}
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerShown: true,
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: Colors.primary,
            shadowRadius: 0,
            shadowOffset: {
              height: 0,
            },
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
