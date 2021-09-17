import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import moment from "moment";
import { useAuthState } from "../context/authContext";
import { Colors, API_URL } from "../../constants";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window')
const TextMessage = (props) => {
  const { message } = props;
  const { self } = useAuthState();

  const isMyMessage = () => {
    return message.user.id == self.id;
  };
  return (
    <View
      style={{
        ...styles.container,
        justifyContent: isMyMessage() ? "flex-end" : "flex-start",
      }}
    >
      {!isMyMessage() && (
        <Image
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            marginRight: 10,
          }}
          source={{ uri: message.user.imageUri }}
        />
      )}
      <View
        style={[
          styles.messageBox,
          {
            backgroundColor: isMyMessage()
              ? Colors.primary
              : Colors.otherMessageBubble,
          },
        ]}
      >
          <Text
            style={{
              flexWrap: "wrap",
              marginRight: 5,
              marginLeft: 5,
              color: Colors.text,
            }}
          >
            <Text style={styles.message}>{message.content}</Text>
          </Text>
        {/* <Text style={styles.message}>{message.content}</Text> */}
        {/* <Text style={styles.time}>{moment(message.createdAt).fromNow()}</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageBox: {
    borderRadius: 20,
    padding: 10,
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

export default TextMessage;
