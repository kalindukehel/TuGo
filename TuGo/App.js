//To Make HTTP API call in React Native using Axios https://aboutreact.com
import React from "react";
//import React in our code.
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
//import all the components we are going to use.
import axios from "axios";
import {API_URL} from "./constants"
class App extends React.Component {
  constructor(){
    super()
    this.state = {
      info:null
    }
  }

  componentDidMount(){
    fetch(`${API_URL}/api/accounts/1`)
      .then(response=>response.json())
      .then(resp=>{
        console.log(resp)
      })


  }

  render(){
    return (
    <View style={styles.MainContainer}>
      <Text style={{ fontSize: 30, textAlign: "center" }}>
        Example of Axios Networking in React Native
      </Text>
      {/*Running GET Request*/}

      <Text>{this.state.info}</Text>

      <Text style={{ textAlign: "center", marginTop: 18 }}>
        www.aboutreact.com
      </Text>
    </View>
  );
};}

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
