import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { signOut as signOutAPI } from "../api";
import { onSignOut } from "../auth";

const Explore = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings</Text>
      <TouchableOpacity
        style={{ backgroundColor: "gray" }}
        onPress={async () => {
          onSignOut();
          try {
            await signOutAPI(userToken);
            console.log("logout pressed");
            dispatch({ type: "SIGN_OUT" });
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Explore;
