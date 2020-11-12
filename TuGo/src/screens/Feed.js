import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { onSignOut } from "../auth";
import { useAuthDispatch } from "../context/authContext";
import { signOut as signOutAPI } from "../api";
import { useAuthState } from "../context/authContext";
import Ionicons from "react-native-vector-icons/Ionicons";

const Feed = ({ navigation }) => {
  const { userToken } = useAuthState();
  const dispatch = useAuthDispatch();
  return (
    <>
      <View
        style={{
          borderColor: "gray",
          borderBottomWidth: 0.5,
          borderLeftWidth: 0.5,
          borderRightWidth: 0.5,
          paddingBottom: 10,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          backgroundColor: "rgba(232, 232, 232, 0.8)",
          alignContent: "row",
        }}
      >
        <Text style={{ marginTop: 30, fontSize: 25, textAlign: "center" }}>TuGo</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}></View>
    </>
  );
};

export default Feed;
