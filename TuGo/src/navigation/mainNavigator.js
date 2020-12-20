import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import { Image } from "react-native";
import HomeScreen from "../screens/Feed";
import Activity from "../screens/Activity";
import profileNavigator from "./profileNavigator";
import exploreNavigator from "./exploreNavigator";
import feedNavigator from "./feedNavigator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuthState, useAuthDispatch } from "../context/authContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainNavigator = () => {
  const { userToken, self } = useAuthState();

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Feed") {
            iconName = focused ? "md-home" : "md-home";
          } else if (route.name === "Profile") {
            return (
              <Image
                source={{ uri: self.profile_picture }}
                style={{ width: 20, height: 20, borderRadius: 5, borderWidth: focused ? 1 : 0.5 }}
              ></Image>
            );
          } else if (route.name === "Explore") {
            iconName = focused ? "md-add-circle" : "md-add-circle-outline";
          }

          // You can return any component that you like here!

          if (route.name === "Explore") {
            return (
              <Image
                transition={false}
                style={{ height: 40, width: 40 }}
                resizeMode={"contain"}
                source={
                  focused
                    ? require(`../../assets/ExploreIconActive.png`)
                    : require(`../../assets/ExploreIcon.png`)
                }
              ></Image>
            );
          }
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
      <Tab.Screen name="Feed" component={feedNavigator} />
      <Tab.Screen name="Explore" component={exploreNavigator} />
      <Tab.Screen name="Profile" component={profileNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
