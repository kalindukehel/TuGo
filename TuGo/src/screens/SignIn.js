import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Button,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { signIn as signInAPI, getSelf as getSelfAPI } from "../api";

import { onSignIn } from "../auth";
import { useAuthDispatch } from "../context/authContext";
import { Colors, appTheme } from "../../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end",
    marginTop: "30%",
  },
  header: {
    fontSize: 50,
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  button: {
    height: 40,
    marginHorizontal: 60,
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

const SignIn = ({ navigation }) => {
  const dispatch = useAuthDispatch();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  async function login() {
    try {
      const data = {
        username: username,
        password: password,
      };
      setLoading(true);
      const res = await signInAPI(data);
      onSignIn(res.data.token);
      const response = await getSelfAPI(res.data.token);
      dispatch({ type: "GET_SELF", self: response.data });
      dispatch({ type: "SIGN_IN", token: res.data.token });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false); 
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.header}>Login</Text>
            <TextInput
              keyboardAppearance={appTheme}
              onChangeText={(username) => setUsername(username)}
              placeholder="Enter Username"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              style={styles.input}
            />
            <TextInput
              keyboardAppearance={appTheme}
              onChangeText={(password) => setPassword(password)}
              placeholder="Enter Password"
              keyboardType="default"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              secureTextEntry={true}
              style={styles.input}
            />
            <TouchableOpacity
              disabled={!password || !username}
              style={{
                ...styles.button,
                backgroundColor:
                  password && username ? Colors.primary : "#d3d3d3",
              }}
              onPress={() => {
                if (username && password) {
                  login();
                }
              }}
            >
              {loading ? (
                <ActivityIndicator
                  animating={true}
                  size="small"
                  color={Colors.complimentText}
                />
              ) : (
                <Text style={{ color: Colors.complimentText }}>Login</Text>
              )}
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
