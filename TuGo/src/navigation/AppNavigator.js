import React, { useState, useEffect } from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthState, useAuthDispatch } from "../context/authContext";
import { usePlayerState, usePlayerDispatch } from "../context/playerContext";
import { isSignedIn } from "../auth";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import ActivityNavigator from "./ActivityNavigator";
import { getSelf as getSelfAPI } from "../api";
import DirectNavigator from "./DirectNavigator";

const Stack = createStackNavigator();

const RootTab = createMaterialTopTabNavigator();

export default AppNavigator = () => {
  const { isSeeking } = usePlayerState();
  const { isSignout, userToken } = useAuthState();
  const dispatch = useAuthDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      try {
        setLoading(true);
        const token = await isSignedIn();
        if (token) {
          const response = await getSelfAPI(token);
          dispatch({ type: "GET_SELF", self: response.data });
        }
        dispatch({ type: "RESTORE_TOKEN", token });
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    getToken();
  }, [dispatch]);

  const tabBarOptions = {
    indicatorContainerStyle: {
      display: "none",
    },
    tabStyle: {
      display: "none",
    },
  };

  const logined = !(userToken == null);
  return (
    !loading && (
      <SafeAreaProvider>
        <NavigationContainer>
          <RootTab.Navigator
            swipeEnabled={!isSeeking}
            headerMode="none"
            tabBarOptions={tabBarOptions}
            initialRouteName={logined ? "Main" : "Auth"}
          >
            {!logined && (
              <RootTab.Screen
                isSignout={isSignout}
                name="Auth"
                component={AuthNavigator}
              />
            )}
            {logined && (
              <>
                <RootTab.Screen name="Activity" component={ActivityNavigator} />
                <RootTab.Screen
                  isSignout={isSignout}
                  name="Main"
                  component={MainNavigator}
                />
                <RootTab.Screen name="Direct" component={DirectNavigator} />
              </>
            )}
          </RootTab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    )
  );
};
