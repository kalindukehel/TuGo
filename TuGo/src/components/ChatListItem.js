import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import moment from "moment";
import { useAuthState } from "../context/authContext";

const ChatListItem = (props) => {
  const { chatRoom, navigation } = props;
  const [otherUser, setOtherUser] = useState(null);
  const { self } = useAuthState();

  useEffect(() => {
    const getOtherUser = async () => {
      if (chatRoom.chatRoomUsers.items[0].user.id == self.id) {
        console.log("second is kush_p7");
        setOtherUser(chatRoom.chatRoomUsers.items[1].user);
      } else {
        console.log("first is kush_p7");
        setOtherUser(chatRoom.chatRoomUsers.items[0].user);
      }
    };
    getOtherUser();
  }, []);

  const onClick = () => {
    // navigation.navigate('ChatRoom', {
    //   id: chatRoom.id,
    //   name: otherUser.name,
    // })
  };

  if (!otherUser) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.lefContainer}>
          <Image source={{ uri: otherUser.imageUri }} style={styles.avatar} />

          <View style={styles.midContainer}>
            <Text style={styles.username}>{otherUser.name}</Text>
            <Text numberOfLines={2} style={styles.lastMessage}>
              {chatRoom.lastMessage
                ? `${chatRoom.lastMessage.user.name}: ${chatRoom.lastMessage.content}`
                : ""}
            </Text>
          </View>
        </View>

        <Text style={styles.time}>
          {chatRoom.lastMessage &&
            moment(chatRoom.lastMessage.createdAt).format("DD/MM/YYYY")}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  lefContainer: {
    flexDirection: "row",
  },
  midContainer: {
    justifyContent: "space-around",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 15,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  lastMessage: {
    fontSize: 16,
    color: "grey",
  },
  time: {
    fontSize: 14,
    color: "grey",
  },
});

export default ChatListItem;
