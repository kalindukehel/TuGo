import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "../../constants";
import ChatScreen from "../screens/Direct/ChatScreen";
import ContactList from "../screens/Direct/ContactList";
import ChatRoom from "../screens/Direct/ChatRoom";
import PostNavigator from "./PostNavigator";
import ProfileNavigator from "./ProfileNavigator"

const Stack = createStackNavigator();

const DirectNavigator = () => {
  const config = {
    animation: "spring",
    config: {
      stiffness: 2000,
      damping: 500,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <Stack.Navigator initialRouteName="Conversations" headerMode="screen">
      <Stack.Screen
        name="Conversations"
        component={ChatScreen}
        options={{
          title: "Chat",
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerStyle: {
            backgroundColor: Colors.Header,
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
          transitionSpec: {
            open: config,
            close: config,
          },
          title: "New Message",
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerStyle: {
            backgroundColor: Colors.Header,
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
          transitionSpec: {
            open: config,
            close: config,
          },
          title: route.params.name,
          gestureResponseDistance: {
            horizontal: 300,
          },
          headerStyle: {
            backgroundColor: Colors.Header,
          },
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        })}
      />
      <Stack.Screen
        name="Post"
        component={PostNavigator}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
        }}
      />
      <Stack.Screen
        name="Profile"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: Colors.text,
          headerShown: false,
        }}
      >
          {(props) => {
            return <ProfileNavigator {...props} id={props.route.params.id} />;
          }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default DirectNavigator;
