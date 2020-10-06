import React, { useState, useEffect } from "react";
import Navigator from "./routes/homeStack";
import { StyleSheet } from "react-native";
import Feed from "./src/screens/Feed";
import Profile from "./src/screens/Profile";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { isSignedIn, signed } from "./src/auth";
import AppNavigator from "./src/navigation/appNavigator";
import { AuthProvider } from "./src/context/authContext";

const Tab = createBottomTabNavigator();

export default App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};
// constructor() {
//   super();

//   this.state = {
//     signedIn: false,
//     checkedSignIn: false,
//   };
// }

// componentDidMount() {
//   console.log("hi");
//   isSignedIn()
//     .then((res) => this.setState({ signedIn: res, checkedSignIn: true }))
//     .catch((err) => alert(err));
// }

// render() {
//   const { checkedSignIn, signedIn } = this.state;

//   // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
//   if (!checkedSignIn) {
//     return null;
//   }

//   if (signedIn) {
//     return (
//       <NavigationContainer>
//         <Tab.Navigator>
//           <Tab.Screen name="Feed" component={Feed} />
//           <Tab.Screen name="Profile" component={Profile} />
//         </Tab.Navigator>
//       </NavigationContainer>
//     );
//   } else {
//     return <Navigator />;
//   }
// }

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
