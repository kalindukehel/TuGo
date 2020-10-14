import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {Image} from "react-native";
import HomeScreen from "../screens/Feed";
import profileNavigator from "./profileNavigator";
import Explore from "../screens/Explore";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuthState, useAuthDispatch } from "../context/authContext";

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const { userToken, self } = useAuthState();

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
            console.log(self)
            return <Image source={{uri:self.profile_picture}} style={{width:20,height:20,borderRadius:5,borderWidth:focused?1:0.5}}></Image>
          } else if (route.name === "Explore") {
            iconName = focused ? "md-add-circle" : "md-add-circle-outline";
          }

          // You can return any component that you like here!

          if (route.name === "Explore") {
            return (
              <Image
                style={{ height: 40, width: 40 }}
                resizeMode={"contain"}
                source={require(`../../assets/ExploreIcon.png`)}
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Profile" component={profileNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
