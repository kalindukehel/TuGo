import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
} from "react-native";
import moment from "moment";
import { useAuthState } from "../context/authContext";
import { API, graphqlOperation } from "aws-amplify";
import { deleteChatRoom } from "../graphql/mutations";
import { Colors } from "../../constants";
import { getChatRoom } from "../screens/Direct/queries";
import { Octicons } from '@expo/vector-icons';
import { onUpdateChatRoom } from  "../graphql/subscriptions"

const ChatListItem = (props) => {
  const { chatRoom, navigation } = props;
  const { self } = useAuthState();
  const [seen, setSeen] = useState(null)

  const [otherUser, setOtherUser] = useState(null);

  const deleteConfirmation = () =>
    Alert.alert(
      "Confirmation",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            onDeleteChatRoom();
          },
        },
      ],
      { cancelable: false }
    );

  const onDeleteChatRoom = async () => {
    try {
      await API.graphql(
        graphqlOperation(deleteChatRoom, {
          input: {
            id: chatRoom.id,
          },
        })
      );
    } catch (e) {
      console.log(e);
    }
  };
  const isViewed = async () => {
    const data = await API.graphql(
      graphqlOperation(getChatRoom, {
        id: chatRoom.id,
      })
    );
    let seen = data.data.getChatRoom.seen
    setSeen(seen.includes(self.id))
  }
  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom)
    ).subscribe({
      next: (data) => {
        isViewed();
      },
    });

    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const getOtherUser = async () => {
      if (chatRoom.chatRoomUsers.items[0].user.id == self.id) {
        setOtherUser(chatRoom.chatRoomUsers.items[1].user);
      } else {
        setOtherUser(chatRoom.chatRoomUsers.items[0].user);
      }
    };
    getOtherUser();
    isViewed();
  }, []);

  const onClick = () => {
    navigation.push("ChatRoom", {
      id: chatRoom.id,
      name: otherUser.name,
    });
  };

  if (!otherUser) {
    return null;
  }

  const renderLastMessage = () => {
    if (chatRoom.lastMessage) {
      if (chatRoom.lastMessage.type == "TEXT") {
        return `${chatRoom.lastMessage.content}`;
      } else if (chatRoom.lastMessage.type == "VOICE") {
        return `Sent an Audio Message`;
      } else if (chatRoom.lastMessage.type == "IMAGE") {
        return `Sent an Image`;
      } else if (chatRoom.lastMessage.type == "POST") {
        return `Shared a Post`;
      }
    } else {
      return "";
    }
  };
  return (
    seen != null &&
    <TouchableWithoutFeedback
      onPress={onClick}
      onLongPress={deleteConfirmation}
    >
      <View style={styles.container}>
        <View style={styles.lefContainer}>
          <Image source={{ uri: otherUser.imageUri }} style={styles.avatar} />

          <View style={styles.midContainer}>
            <Text style={styles.name}>{otherUser.name}</Text>
            <Text numberOfLines={2} style={styles.lastMessage}>
              {renderLastMessage()}
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.time}>
            {chatRoom.lastMessage &&
              moment(chatRoom.lastMessage.createdAt).format("DD/MM/YYYY")}
          </Text>
          {!seen &&
          <View style={{alignItems: "center"}}>
            <Octicons name="primitive-dot" size={24} color={Colors.primary} />
          </View> }
        </View>

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
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.text,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.gray,
  },
  time: {
    fontSize: 14,
    color: Colors.gray,
  },
});

export default ChatListItem;
