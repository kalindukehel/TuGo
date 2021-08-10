import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Navigator from "./routes/homeStack";
import { StyleSheet, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { isSignedIn, signed } from "./src/auth";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/authContext";
import { PlayerProvider } from "./src/context/playerContext";
import { ErrorProvider } from "./src/context/errorContext";
import { NotificationProvider } from "./src/context/notificationContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { changeColors, Colors } from "./constants";
import PlayerWidgets from "./src/components/PlayerWidget";

import Amplify from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);

const Tab = createBottomTabNavigator();

export default App = () => {
  changeColors("dark");
  return (
    <>
      <SafeAreaProvider>
        <AuthProvider>
          <PlayerProvider>
            <ErrorProvider>
              <NotificationProvider>
                <AppNavigator />
                <PlayerWidgets />
              </NotificationProvider>
            </ErrorProvider>
          </PlayerProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    padding: 16,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "100%",
    marginTop: 16,
  },
});
