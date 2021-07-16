import React, { useEffect, useState } from "react";
import { FlatList, Text, View, KeyboardAvoidingView } from "react-native";

import { useRoute } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";

import { messagesByChatRoom } from "../../graphql/queries";
import { onCreateMessage } from "../../graphql/subscriptions";
import { updateChatRoom } from "../../graphql/mutations"
import { getChatRoom } from "../Direct/queries"

import TextMessage from "../../components/TextMessage";
import VoiceMessage from "../../components/VoiceMessage";
import ImageMessage from "../../components/ImageMessage";
import PostMessage from "../../components/PostMessage";
import ChatInputBox from "../../components/ChatInputBox";

import { Colors } from "../../../constants";
import { useAuthState } from "../../context/authContext";

const ChatRoom = ({ navigation }) => {
  const { self } = useAuthState()
  const [messages, setMessages] = useState([]);

  const route = useRoute();
  const fetchMessages = async () => {
    const messagesData = await API.graphql(
      graphqlOperation(messagesByChatRoom, {
        chatRoomID: route.params.id,
        sortDirection: "DESC",
      })
    );
    setMessages(messagesData.data.messagesByChatRoom.items);
  };

  // const updateSeen = async () => {
  //   const data = await API.graphql(
  //     graphqlOperation(getChatRoom, {
  //       id: route.params.id,
  //     })
  //   );
  //   let seen = data.data.getChatRoom.seen
  //   seen.push(self.id)
  //   const chatRoomData = await API.graphql(
  //     graphqlOperation(updateChatRoom, {
  //       input: {
  //         id: route.params.id,
  //         seen: seen
  //       },
  //     })
  //   );
  // }

  useEffect(() => {
    fetchMessages();
    // updateSeen();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: (data) => {
        const newMessage = data.value.data.onCreateMessage;

        if (newMessage.chatRoomID !== route.params.id) {
          return;
        }

        fetchMessages();
      },
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: Colors.BG }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => {
          if (item.type == "TEXT")
            return <TextMessage message={item} navigation={navigation} />;
          if (item.type == "VOICE")
            return <VoiceMessage message={item} navigation={navigation} />;
          if (item.type == "IMAGE")
            return <ImageMessage message={item} navigation={navigation} />;
          if (item.type == "POST")
            return <PostMessage message={item} navigation={navigation} />;
        }}
        inverted
        keyboardDismissMode="interactive"
      />

      <ChatInputBox chatRoomID={route.params.id} />
    </View>
  );
};

export default ChatRoom;
