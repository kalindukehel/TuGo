import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { signOut as signOutAPI } from "../api";
import { onSignOut } from "../auth";
import { useAuthState, useAuthDispatch } from "../context/authContext";
import Ionicons from "react-native-vector-icons/Ionicons";

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
});

const Profile = ({ navigation }) => {
  const { userToken, self } = useAuthState();
  const dispatch = useAuthDispatch();

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          marginTop: "10%",
          width: 25,
          alignItems: "center",
          alignSelf: "flex-end",
          marginRight: 20,
        }}
      >
        <Ionicons
          name="ios-settings"
          backgroundColor="red"
          size={25}
          color={"black"}
          onPress={async () => {
            navigation.navigate("Settings");
          }}
        />
      </TouchableOpacity>
      <View style={styles.SectionStyle}>
        <Image
          source={{ uri: self.profile_picture }}
          style={{ width: "10%", height: "50%" }}
        ></Image>
      </View>
    </View>
  );
};

export default Profile;
