import React, { useState, useEffect } from "react";
import Navigator from "./routes/homeStack";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { isSignedIn, signed } from "./src/auth";
import AppNavigator from "./src/navigation/appNavigator";
import { AuthProvider } from "./src/context/authContext";

const Tab = createBottomTabNavigator();

export default App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
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
