import React from "react";
import { View, Text, Button } from "react-native"
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "../screens/Feed"
import { useAuthState } from "../context/authContext";

const Stack = createStackNavigator();

const feedNavigator = () => {
  const { self } = useAuthState();
  return (
    <Stack.Navigator initialRouteName="Tugo">
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerStyle: {
            borderColor: "gray",
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            backgroundColor: "rgba(232, 232, 232, 0.8)",
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20
          },
          // header: () => (
          // <View
          //     style={{
          //       borderColor: "gray",
          //       borderBottomWidth: 0.5,
          //       borderLeftWidth: 0.5,
          //       borderRightWidth: 0.5,
          //       paddingBottom: 10,
          //       borderBottomLeftRadius: 40,
          //       borderBottomRightRadius: 40,
          //       backgroundColor: "rgba(232, 232, 232, 0.8)",
          //       alignContent: "row",
          //     }}
          // >
          //     <Button
          //       onPress={() => alert('This is a button!')}
          //       title="Info"
          //       color="#fff"
          //     />
          //     <Text style={{ marginTop: 30, fontSize: 25, textAlign: "center", color: "#065581" }}>TuGo</Text>
          // </View>
          // ),
        }}
        name="Tugo"
        component={Feed}
      />
    </Stack.Navigator>
  );
};

export default feedNavigator;
