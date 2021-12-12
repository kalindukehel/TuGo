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
} from "react-native";
import { signUp as signUpAPI, signIn as SignInApi } from "../api";
import { onSignIn } from "../auth";
import { useAuthDispatch } from "../context/authContext";
import { Colors } from "../../constants";
import GText from "../components/GText"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#7DE24E",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: Colors.text,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.text,
    backgroundColor: "#D3D3D3",
  },
  registerTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 30,
    backgroundColor: Colors.FG,
    marginHorizontal: 60,
    padding: 10,
    borderRadius: 30,
  },
});
const SignUp = ({ navigation }) => {
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
      const signInRes = await SignInApi({
        username: data.username,
        password: data.password,
      });
      onSignIn(signInRes.data.token);
      console.log(signInRes.data.token);
      dispatch({ type: "SIGN_IN", token: signInRes.data.token });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <KeyboardAvoidingView enabled>
        <GText style={{ marginBottom: 40, fontSize: 50, textAlign: "center" }}>
          SignUp
        </GText>
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(name) => setName(name)}
            underlineColorAndroid="#FFFFFF"
            placeholder="Enter Name"
            placeholderTextColor="black"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(username) => setUsername(username)}
            underlineColorAndroid="#FFFFFF"
            placeholder="Enter Username"
            placeholderTextColor="black"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(email) => setEmail(email)}
            underlineColorAndroid="#FFFFFF"
            placeholder="Enter Email"
            placeholderTextColor="black"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(password) => setPassword(password)}
            underlineColorAndroid="#FFFFFF"
            placeholder="Enter Password"
            placeholderTextColor="black"
            keyboardType="default"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={false}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (username && password && email && name) {
              signup();
            }
          }}
        >
          <GText style={{ color: Colors.complimentText }}>Sign Up</GText>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;
