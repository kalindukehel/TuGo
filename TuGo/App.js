//To Make HTTP API call in React Native using Axios https://aboutreact.com
import React from "react";
//import React in our code.
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
//import all the components we are going to use.
import axios from "axios";
import { API_URL } from "./constants";
import useAccounts from "./app.hooks";
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
  const { accounts } = useAccounts();
  console.log(accounts);
  return (
    <View style={styles.MainContainer}>
      <Text style={{ fontSize: 30, textAlign: "center" }}>
        Example of Axios Networking in React Native
      </Text>
      {/*Running GET Request*/}

      <Text>hello world</Text>

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
