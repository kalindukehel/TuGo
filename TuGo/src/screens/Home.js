//To Make HTTP API call in React Native using Axios https://aboutreact.com
import React, { useState, useEffect } from "react";
//import React in our code.
import { StyleSheet, View, TouchableOpacity, Text, Button, TextInput } from "react-native";
//import all the components we are going to use.
import { getAccountById as getAccountByIdAPI, createAccount as createAccountAPI } from "../api";
import { NavigationContainer } from "@react-navigation/native";
// import "react-native-gesture-handler";

const Home = ({ navigation }) => {
  const [accounts, setAccounts] = useState();
  async function handleChange(text) {
    try {
      //console.log("handlechange before");
      const res = await getAccountByIdAPI(text);
      //console.log("handlechange after");
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
        <Text style={{ fontSize: 50, textAlign: "center", marginBottom: 40 }}>TuGo</Text>

        {/* <Text>{accounts ? accounts.username : null}</Text>
        <Button title="click me" onPress={createAccount}></Button>
        <TextInput
          onChangeText={handleChange}
          style={{ borderColor: "black", borderWidth: 5 }}
        ></TextInput> */}
        <TouchableOpacity
          style={styles.sectionStyle}
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderBottomColor: "#D3D3D3",
          borderBottomWidth: 1,
          marginBottom: 40,
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 40 }}>
        <Text>Already have an account?</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignIn");
          }}
        >
          <Text style={{ color: "blue", marginLeft: 3 }}>Sign In.</Text>
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
    borderColor: "black",
    flexDirection: "row",
    marginTop: 40,
    marginHorizontal: 80,
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#D3D3D3",
  },
  line: {
    height: 1,
    borderTopColor: "black",
    margin: 1,
    padding: 0,
  },
});

export default Home;
