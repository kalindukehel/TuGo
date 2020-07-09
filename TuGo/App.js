//To Make HTTP API call in React Native using Axios https://aboutreact.com
import React from "react";
//import React in our code.
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
//import all the components we are going to use.
import axios from "axios";

const App = () => {
  const getDataUsingAsyncAwaitGetCall = async () => {
    try {
      const response = axios.get(`http://127.0.0.1:8000/api/accounts/`);
      alert(JSON.stringify(response.data));
    } catch (error) {
      // handle error
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <View style={styles.MainContainer}>
      <Text style={{ fontSize: 30, textAlign: "center" }}>
        Example of Axios Networking in React Native
      </Text>
      {/*Running GET Request*/}

      <TouchableOpacity
        style={styles.button}
        onPress={getDataUsingAsyncAwaitGetCall}
      >
        <Text>Get Data Using Async Await GET</Text>
      </TouchableOpacity>

      <Text style={{ textAlign: "center", marginTop: 18 }}>
        www.aboutreact.com
      </Text>
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
