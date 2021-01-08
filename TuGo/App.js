import React, { useState, useEffect } from "react";
import Navigator from "./routes/homeStack";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { isSignedIn, signed } from "./src/auth";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/authContext";
import { PlayerProvider } from "./src/context/playerContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

export default App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PlayerProvider>
          <AppNavigator />
        </PlayerProvider>
      </AuthProvider>
    </SafeAreaProvider>
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
