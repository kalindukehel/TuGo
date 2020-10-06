import React, { useState, useEffect } from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthState, useAuthDispatch } from "../context/authContext";
import { isSignedIn } from "../auth";
import AuthNavigator from "./authNavigator";
import MainNavigator from "./mainNavigator";

const Stack = createStackNavigator();

export default AppNavigator = () => {
  const { isSignout, userToken } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await isSignedIn();
        dispatch({ type: "RESTORE_TOKEN", token });
      } catch (e) {
        console.log(e);
      }
    };
    getToken();
  }, [dispatch]);
  console.log(userToken);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          {userToken == null ? (
            <Stack.Screen isSignout={isSignout} name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen isSignout={isSignout} name="Main" component={MainNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
