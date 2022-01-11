import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Text,
  FlatList,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { Colors } from "../../../constants";

var { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.BG,
    },
    button: {
      textAlign: "center",
      width: 120,
      paddingVertical: 5,
      color: Colors.text
    },
    textInputViewStyle: {
      height: 30,
      borderRadius: 7,
      marginHorizontal: 20,
      marginTop: 20,
      width: "50%",
      backgroundColor: Colors.contrastGray,
    },
    buttonView: {
      borderRadius: 7, 
      backgroundColor: Colors.contrastGray
    },
    textInputStyle: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 5,
      color: Colors.text
    },
    maxlimit: 40
  });

  export default styles