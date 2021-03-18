import React, { useState, useEffect } from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthState, useAuthDispatch } from "../context/authContext";
import { isSignedIn } from "../auth";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import ActivityNavigator from "./ActivityNavigator";
import { getSelf as getSelfAPI } from "../api";

const Stack = createStackNavigator();

export default AppNavigator = () => {
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
  return (
    !loading && (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator headerMode="none">
            {userToken == null ? (
              <Stack.Screen
                isSignout={isSignout}
                name="Auth"
                component={AuthNavigator}
              />
            ) : (
              <Stack.Screen
                isSignout={isSignout}
                name="Main"
                component={MainNavigator}
              />
            )}
            <Stack.Screen
              name="Activity"
              options={{
                gestureResponseDistance: {
                  horizontal: 300,
                },
              }}
              component={ActivityNavigator}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    )
  );
};
