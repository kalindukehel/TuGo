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
} from "react-native";
import { signUp as signUpAPI, signIn as SignInApi } from "../api";
import { onSignIn } from "../auth";
import { useAuthDispatch } from "../context/authContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end",
    marginTop: "25%",
  },
  header: {
    fontSize: 50,
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    color: "black",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  button: {
    alignItems: "center",
    marginTop: 30,
    marginHorizontal: 60,
    padding: 10,
    borderRadius: 30,
    //backgroundColor: "black",
  },
});

const SignIn = ({ navigation }) => {
  const dispatch = useAuthDispatch();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  async function signup() {
    try {
      const data = {
        username: username,
        password: password,
        email: email,
        name: name,
      };
      const signUpRes = await signUpAPI(data);
      const signInRes = await SignInApi({ username: data.username, password: data.password });
      onSignIn(signInRes.data.token);
      console.log(signInRes.data.token);
      dispatch({ type: "SIGN_IN", token: signInRes.data.token });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-15}
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.header}>SignUp</Text>
            <TextInput
              onChangeText={(name) => setName(name)}
              placeholder="Enter Name"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              style={styles.input}
            />
            <TextInput
              onChangeText={(username) => setUsername(username)}
              placeholder="Enter Username"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              style={styles.input}
            />
            <TextInput
              onChangeText={(email) => setEmail(email)}
              placeholder="Enter Email"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              style={styles.input}
            />
            <TextInput
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
              disabled={!password || !username || !name || !email}
              style={
                password && username && name && email
                  ? { ...styles.button, backgroundColor: "gray" }
                  : { ...styles.button, backgroundColor: "#d3d3d3" }
              }
              onPress={() => {
                if (username && password && email && name) {
                  console.log("new sign up");
                  signup();
                }
              }}
            >
              <Text style={{ color: "white" }}>SignUp</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
