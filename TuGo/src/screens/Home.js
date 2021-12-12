//To Make HTTP API call in React Native using Axios https://aboutreact.com
import React, { useState, useEffect } from "react";
//import React in our code.
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Button,
  TextInput,
} from "react-native";
//import all the components we are going to use.
import {
  getAccountById as getAccountByIdAPI,
  createAccount as createAccountAPI,
} from "../api";
import { NavigationContainer } from "@react-navigation/native";
// import "react-native-gesture-handler";
import { Colors } from "../../constants";
import GText from "../components/GText"

const Home = ({ navigation }) => {
  const [accounts, setAccounts] = useState();
  async function handleChange(text) {
    try {
      console.log("handlechange before");
      const res = await getAccountByIdAPI(text);
      console.log("handlechange after");
      setAccounts(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function createAccount() {
    try {
      const data = {
        username: "test",
        email: "test@gmail.com",
        name: "tester",
      };
      createAccountAPI(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <View style={styles.MainContainer}>
        <GText style={{ fontSize: 50, textAlign: "center", marginBottom: 40 }}>
          TuGo
        </GText>

        {/* <GText>{accounts ? accounts.username : null}</GText>
        <Button title="click me" onPress={createAccount}></Button>
        <TextInput
          onChangeText={handleChange}
          style={{ borderColor: Colors.text, borderWidth: 5 }}
        ></TextInput> */}
        <TouchableOpacity
          style={styles.sectionStyle}
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <GText>Sign Up</GText>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderBottomColor: "#D3D3D3",
          borderBottomWidth: 1,
          marginBottom: 40,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        <GText>Already have an account?</GText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignIn");
          }}
        >
          <GText style={{ color: "blue", marginLeft: 3 }}>Sign In.</GText>
        </TouchableOpacity>
      </View>
    </>
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
  sectionStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.text,
    flexDirection: "row",
    marginTop: 40,
    marginHorizontal: 80,
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#D3D3D3",
  },
  line: {
    height: 1,
    borderTopColor: Colors.text,
    margin: 1,
    padding: 0,
  },
});

export default Home;
