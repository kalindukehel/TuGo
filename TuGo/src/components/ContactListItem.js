import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { API_URL, Colors } from "../../constants";
import { API, graphqlOperation } from "aws-amplify";
import {
  createChatRoom,
  createChatRoomUser,
} from "../../src/graphql/mutations";
import { listUsers } from "../../src/graphql/queries";
import { useAuthState } from "../context/authContext";
import { getUser } from "../screens/Direct/queries";

var { width, height } = Dimensions.get("window");
const maxlimit = 20;

const ContactListItem = (props) => {
  const { account, navigation } = props;
  const { self } = useAuthState();

  const ListChatRooms = `
    query {
      listChatRooms {
        items {
          id
        }
      }
    }
  `;

  const onClick = async () => {
    try {
      // check if self already has a chatroom with account
      const userData = await API.graphql(
        graphqlOperation(getUser, {
          id: self.id,
        })
      );
      const allChatRooms = userData.data.getUser.chatRoomUser.items;
      const activeChatRooms = allChatRooms.filter((chatRoom) => {
        if (chatRoom.chatRoom) {
          return true;
        } else {
          return false;
        }
      });
      let existingChatRoomId = null;
      for (var index in activeChatRooms) {
        const currChatRoom = activeChatRooms[index];
        let otherUser;
        if (currChatRoom.chatRoom.chatRoomUsers.items[0].user.id == self.id) {
          otherUser = currChatRoom.chatRoom.chatRoomUsers.items[1].user;
        } else {
          otherUser = currChatRoom.chatRoom.chatRoomUsers.items[0].user;
        }
        if (otherUser.id == account.id) {
          existingChatRoomId = currChatRoom.chatRoomID;
          break;
        }
      }
      if (existingChatRoomId) {
        navigation.goBack();
        navigation.navigate("ChatRoom", {
          id: existingChatRoomId,
          name: account.name,
        });
      } else {
        //1. Create a new Chat Room
        const newChatRoomData = await API.graphql(
          graphqlOperation(createChatRoom, {
            input: {
              lastMessageID: "zz753fca-e8c3-473b-8e85-b14196e84e16",
              seen: []
            },
          })
        );

        if (!newChatRoomData.data) {
          // Failed to create a chat room
          return;
        }

        const newChatRoom = newChatRoomData.data.createChatRoom;

        // 2. Add `user` to the Chat Room
        await API.graphql(
          graphqlOperation(createChatRoomUser, {
            input: {
              userID: account.id,
              chatRoomID: newChatRoom.id,
            },
          })
        );

        //  3. Add authenticated user to the Chat Room
        await API.graphql(
          graphqlOperation(createChatRoomUser, {
            input: {
              userID: self.id,
              chatRoomID: newChatRoom.id,
            },
          })
        );
        navigation.goBack();
        navigation.navigate("ChatRoom", {
          id: newChatRoom.id,
          name: account.name,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TouchableOpacity style={styles.friendElement} onPress={onClick}>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        <Image
          source={{ uri: account.imageUri }}
          style={{
            width: height / 20,
            height: height / 20,
            borderRadius: 999,
            borderWidth: 1,
          }}
        ></Image>
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            marginLeft: 15,
          }}
        >
          <Text style={{ fontWeight: "bold", color: Colors.text }}>
            {account.username.length > maxlimit
              ? account.username.substring(0, maxlimit - 3) + "..."
              : account.username}
          </Text>
          <Text style={{ color: Colors.text }}>
            {account.username.length > maxlimit
              ? account.name.substring(0, maxlimit - 3) + "..."
              : account.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  friendElement: {
    flex: 1,
    padding: 10,
  },
});

export default ContactListItem;
