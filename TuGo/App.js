//To Make HTTP API call in React Native using Axios https://aboutreact.com
 import React, { useState, useEffect } from "react";
//import React in our code.
import { StyleSheet, View, TouchableOpacity, Text, Button, TextInput } from "react-native";
//import all the components we are going to use.
import axios from "axios";
import { API_URL } from "./constants";
import useAccounts from "./app.hooks";
import { render } from "react-dom";
import { getAccountById as getAccountByIdAPI, createAccount as createAccountAPI } from "./src/api";

const App = () => {
  // componentDidMount(){
  //   fetch(`${API_URL}/api/accounts/1`)
  //     .then(response=>response.json())
  //     .then(resp=>{
  //       this.setState({
  //         info:resp
  //       })
  //     })

  //     .catch(error=>{
  //       console.log(error)
  //     })

  const [accounts,setAccounts] = useState()
  async function handleChange(text){
    try{
      const res = await getAccountByIdAPI(text);
      setAccounts(res.data)
      console.log(res.data)
    }catch(error){
      console.log("error")
    }
  }

  async function createAccount(){
    try{
      const data = {
        username: "test",
        email: "test@gmail.com",
        name: "tester"
      }
      createAccountAPI(data)
    }catch(error){
      console.log(error)
    }
  }


  return (
    <View style={styles.MainContainer}>
      <Text style={{ fontSize: 30, textAlign: "center" }}>
        Example of Axios Networking in React Native
      </Text>
      <Text>{accounts?accounts.username:null}</Text>
      <Button title="click me" onPress={createAccount} ></Button>
      <TextInput onChangeText={handleChange} style={{"borderColor":"black","borderWidth":"1px"}}>asd</TextInput>
      {/*Running GET Request*/}
      <Text style={{ textAlign: "center", marginTop: 18 }}></Text>
    </View>
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
});

export default App;
