import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "../../constants";
import ChatScreen from "../screens/Direct/ChatScreen";
import ContactList from "../screens/Direct/ContactList";
import ChatRoom from "../screens/Direct/ChatRoom";

const Stack = createStackNavigator();

const DirectNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Conversations" headerMode="screen">
      <Stack.Screen
        name="Conversations"
        component={ChatScreen}
        options={{
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen
        name="ContactList"
        component={ContactList}
        options={{
          title: "New Message",
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerStyle: {
            backgroundColor: Colors.BG,
          },
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={({ route }) => ({
          title: route.params.name,
        })}
      />
    </Stack.Navigator>
  );
};

export default DirectNavigator;
