import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import moment from "moment";
import { useAuthState } from "../context/authContext";
import { Colors, API_URL, Length } from "../../constants";
import { Dimensions } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import RenderProfileIcon from './RenderProfileIcon'
import GText from "./GText"

const { width, height } = Dimensions.get('window')
const TextMessage = (props) => {
  const { message, navigation} = props;
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
        <RenderProfileIcon navigation={navigation} message={message}/>
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
          <GText
            style={{
              flexWrap: "wrap",
              marginRight: 5,
              marginLeft: 5,
              color: Colors.text,
            }}
          >
            <GText style={styles.message}>{message.content}</GText>
          </GText>
        {/* <GText style={styles.message}>{message.content}</GText> */}
        {/* <GText style={styles.time}>{moment(message.createdAt).fromNow()}</GText> */}
      </View>
    </View>
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

export default TextMessage;
