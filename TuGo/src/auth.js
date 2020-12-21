import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-community/async-storage';

export const onSignIn = (USER_KEY) => {
  AsyncStorage.setItem("USER_KEY", JSON.stringify(USER_KEY));
};

export const onSignOut = () => {
  AsyncStorage.removeItem("USER_KEY");
};

export const isSignedIn = async () => {
  try {
    const value = await AsyncStorage.getItem("USER_KEY");
    if (value !== null) {
      return JSON.parse(value);
      // We have data!!
    } else {
      return null;
    }
  } catch (error) {
    // Error retrieving data
    console.log(error);
    return false;
  }
};
