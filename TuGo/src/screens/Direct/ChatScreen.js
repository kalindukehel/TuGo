import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../../constants";
import ChatListItem from "../../components/ChatListItem";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "./queries";
import { useAuthState } from "../../context/authContext";

const ChatScreen = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const { self } = useAuthState();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Entypo name="chevron-left" size={30} color={Colors.FG} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => {
            navigation.push("ContactList");
          }}
        >
          <MaterialIcons name="create" size={25} color={Colors.FG} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const userData = await API.graphql(
          graphqlOperation(getUser, {
            id: self.id,
          })
        );

        setChatRooms(userData.data.getUser.chatRoomUser.items);
      } catch (e) {
        console.log(e);
      }
    };
    fetchChatRooms();
  }, []);
  console.log(chatRooms);
  return (
    <View style={styles.container}>
      <Text>ChatScreen</Text>
      <FlatList
        style={{ width: "100%" }}
        data={chatRooms}
        renderItem={({ item }) => <ChatListItem chatRoom={item.chatRoom} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
});

export default ChatScreen;
