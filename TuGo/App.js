import React, { useState, useEffect } from "react";
import { StyleSheet, StatusBar } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/authContext";
import { PlayerProvider } from "./src/context/playerContext";
import { ErrorProvider } from "./src/context/errorContext";
import { TilePlayerProvider } from "./src/context/tilePlayerContext";
import { NotificationProvider } from "./src/context/notificationContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import PlayerWidgets from "./src/components/PlayerWidget";
import ShowTile from "./src/components/ShowTile"

import Amplify from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);


export default App = () => {
  return (
    <>
      <SafeAreaProvider>
        <AuthProvider>
          <PlayerProvider>
            <ErrorProvider>
              <TilePlayerProvider>
                <NotificationProvider>
                  <AppNavigator />
                  <PlayerWidgets />
                  <ShowTile/>
                </NotificationProvider>
              </TilePlayerProvider>
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
