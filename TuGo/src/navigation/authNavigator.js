import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../screens/SignIn";
import SignUpScreen from "../screens/SignUp";
import HomeScreen from "../screens/Home";

const Stack = createStackNavigator();

const AuthNavigator = ({ isSignout }) => {
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="none">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: "Sign in",
          animationTypeForReplace: isSignout ? "pop" : "push",
        }}
      />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
