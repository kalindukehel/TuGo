import React from "react";
import { Text, View, StyleSheet } from "react-native";
import moment from "moment";
import { useAuthState } from "../context/authContext";
import { Colors } from "../../constants";

const ChatMessage = (props) => {
  const { message } = props;
  const { self } = useAuthState();

  const isMyMessage = () => {
    return message.user.id == self.id;
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.messageBox,
          {
            backgroundColor: isMyMessage()
              ? Colors.primary
              : Colors.otherMessageBubble,
            marginLeft: isMyMessage() ? 50 : 0,
            marginRight: isMyMessage() ? 0 : 50,
          },
        ]}
      >
        {!isMyMessage() && <Text style={styles.name}>{message.user.name}</Text>}
        <Text style={styles.message}>{message.content}</Text>
        <Text style={styles.time}>{moment(message.createdAt).fromNow()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  messageBox: {
    borderRadius: 20,
    padding: 10,
  },
  name: {
    color: Colors.text,
    fontWeight: "bold",
    marginBottom: 5,
  },
  message: {},
  time: {
    alignSelf: "flex-end",
    color: "grey",
  },
});

export default ChatMessage;
