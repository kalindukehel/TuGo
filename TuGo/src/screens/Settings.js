import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import {
  getSelf as getSelfAPI,
  signOut as signOutAPI,
  toggleAccountVisilibity as toggleAccountVisilibityAPI,
} from "../api";
import { onSignOut } from "../auth";
import { useAuthState, useAuthDispatch } from "../context/authContext";

const Settings = ({ navigation }) => {
  const { userToken } = useAuthState();
  const [isPrivate, setIsPrivate] = useState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    getSelf();
  }, []);

  const getSelf = async () => {
    const res = await getSelfAPI(userToken);
    setIsPrivate(res.data.is_private);
  };

  const toggleAccountVisilibity = async () => {
    await toggleAccountVisilibityAPI(!isPrivate, userToken);
    getSelf();
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <TouchableOpacity
        style={{ backgroundColor: "gray", marginTop: 20, marginBottom: 20 }}
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
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          maxHeight: 40,
          alignItems: "center",
        }}
      >
        <Text style={{ marginRight: 5 }}>Private Account</Text>
        <Switch
          value={isPrivate}
          onValueChange={() => {
            toggleAccountVisilibity();
          }}
        />
      </View>
    </View>
  );
};

export default Settings;
