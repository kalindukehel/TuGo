import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/Feed";
import Profile from "../screens/Profile";
import Explore from "../screens/Explore";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      headerMode="none"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "md-home" : "md-home";
          } else if (route.name === "Profile") {
            iconName = focused ? "md-square" : "md-square-outline";
          } else if (route.name === "Explore") {
            iconName = focused ? "md-add-circle" : "md-add-circle-outline";
          }

          // You can return any component that you like here!
          console.log(size);
          console.log(color);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "black",
        inactiveTintColor: "gray",
      }}
      style={{
        backgroundColor: "black",
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
