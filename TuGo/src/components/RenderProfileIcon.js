import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import moment from "moment";
import { useAuthState } from "../context/authContext";
import { Colors, API_URL, Length } from "../../constants";
import { Dimensions } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

const { width, height } = Dimensions.get('window')
const RenderProfileIcon = ({navigation, message}) => {
  return (
        <TouchableWithoutFeedback
            onPress={() => {
                navigation.push("Profile", {
                id: message.user.id,
                });
            }}
        >
          <Image
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              marginRight: 10,
            }}
            source={{ uri: API_URL + message.user.imageUri }}
          />
        </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageBox: {
    borderRadius: 20,
    padding: 10,
    marginRight: Length.msgIndent / 2,
    flexDirection: 'row', alignItems: 'center', maxWidth: 0.8 * width
  },
  message: {
    fontSize: 14,
    flexShrink: 1,
    color: 'black'
  },
  time: {
    alignSelf: "flex-end",
    color: "grey",
  },
});

export default RenderProfileIcon;
