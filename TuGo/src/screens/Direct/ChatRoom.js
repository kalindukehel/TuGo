import React, { useEffect, useState, useRef } from "react";
import { FlatList, Text, View, KeyboardAvoidingView } from "react-native";

import { useRoute } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";

import { messagesByChatRoom } from "../../graphql/queries";
import { onCreateMessage, onUpdateChatRoom } from "../../graphql/subscriptions";
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
  const [readTag, setReadTag] = useState(false)
  const flatListRef = useRef();

  const route = useRoute();
  const fetchMessages = async () => {
    const messagesData = await API.graphql(
      graphqlOperation(messagesByChatRoom, {
        chatRoomID: route.params.id,
        sortDirection: "DESC",
      })
    );
    setMessages(messagesData.data.messagesByChatRoom.items);
    const lastMessage = messagesData.data.messagesByChatRoom.items[0]

    const chatRoomData = await API.graphql(
      graphqlOperation( getChatRoom, {
        id: lastMessage.chatRoom.id
      })
    );
    const seenArray = lastMessage.chatRoom.seen
    let allUsersInChatRoom = chatRoomData.data.getChatRoom.chatRoomUsers.items.map(user => user.user.id)
    allUsersInChatRoom = allUsersInChatRoom.filter(user => user != self.id)
    setReadTag(lastMessage.user.id == self.id && allUsersInChatRoom.every(val => seenArray.includes(parseInt(val, 10))))
  };

  const updateSeen = async () => {
    const data = await API.graphql(
      graphqlOperation(getChatRoom, {
        id: route.params.id,
      })
    );
    let seen = data.data.getChatRoom.seen
    if (!seen.includes(self.id)) {
      seen.push(self.id)
      let unique = [...new Set(seen)];
      const chatRoomData = await API.graphql(
        graphqlOperation(updateChatRoom, {
          input: {
            id: route.params.id,
            seen: unique
          },
        })
      );
    }
  }

  const scrollToTextInput = () => {
    flatListRef.current.scrollToOffset({
      animated: true,
      offset: 0,
    });
  };

  useEffect(() => {
    updateSeen();
    fetchMessages();
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
        updateSeen();
        fetchMessages();
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom)
    ).subscribe({
      next: (data) => {
        const updateChatRooms = data.value.data.onUpdateChatRoom;
        
        if (updateChatRooms.id !== route.params.id) {
          return;
        }
        updateSeen();
        fetchMessages();
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: Colors.BG }}>
      <FlatList
        contentContainerStyle={{marginTop: 5}}
        ref={flatListRef}
        extraData={readTag}
        ListHeaderComponent={() => (
          readTag &&
           <Text style={{color: Colors.gray, alignSelf: 'flex-end', position: 'absolute', bottom: -5, right: 12, fontSize: 10}}>R</Text>
        )}
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

      <ChatInputBox chatRoomID={route.params.id} scrollToTextInput={scrollToTextInput}/>
    </View>
  );
};

export default ChatRoom;
