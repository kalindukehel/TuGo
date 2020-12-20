import React from "react";
import { createStackNavigator, TransitionSpecs  } from "@react-navigation/stack";
import Activity from "../screens/Activity"
import { useAuthState } from "../context/authContext";

const Stack = createStackNavigator();

const activityNavigator = () => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Activity">
      <Stack.Screen
        name="Activity"
        component={Activity}
        headerMode="screen"
      />
    </Stack.Navigator>
  );
};

export default activityNavigator;
