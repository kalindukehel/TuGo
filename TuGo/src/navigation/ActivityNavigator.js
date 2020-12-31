import React from "react";
import { createStackNavigator, TransitionSpecs } from "@react-navigation/stack";
import Activity from "../screens/Activity";
import { useAuthState } from "../context/authContext";
import ProfileNavigator from "./ProfileNavigator";
import PostNavigator from "./PostNavigator";
import Profile from "../screens/Profile/Profile";

const Stack = createStackNavigator();

const ActivityNavigator = () => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Activity" headerMode="screen">
      <Stack.Screen
        name="Activity"
        component={Activity}
        options={{
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen
        name="Profile"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
        component={Profile}
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
    </Stack.Navigator>
  );
};

export default ActivityNavigator;
