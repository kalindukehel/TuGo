import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signOut as signOutAPI } from "../api";
import { onSignOut } from "../auth";
import { useAuthState, useAuthDispatch } from "../context/authContext";

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
  const { userToken } = useAuthState();
  const dispatch = useAuthDispatch();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.SectionStyle}>
        <TouchableOpacity
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
    </View>
  );
};

export default Profile;
