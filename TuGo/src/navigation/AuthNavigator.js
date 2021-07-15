import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../screens/SignIn";
import SignUpScreen from "../screens/SignUp";
import HomeScreen from "../screens/Home";
import {Colors} from "../../constants"

const Stack = createStackNavigator();

const AuthNavigator = ({ isSignout }) => {
  return (
    <Stack.Navigator initialRouteName="Home" >
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          headerStyle: {
            backgroundColor: Colors.Header,
          },
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
      />
      <Stack.Screen name="SignUp" component={SignUpScreen}         
      options={{
          headerStyle: {
            backgroundColor: Colors.Header,
          },
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}/>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
