import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../../constants";
import ChatListItem from "../../components/ChatListItem";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "./queries";
import { useAuthState } from "../../context/authContext";
import {
  onCreateMessage,
  onDeleteChatRoom,
  onCreateChatRoom,
  onUpdateChatRoom
} from "../../graphql/subscriptions";

const ChatScreen = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [seenArr, setSeenArr] = useState([])
  const { self } = useAuthState();
  React.useLayoutEffect(() => {
    navigation.setOptions({
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

  const fetchChatRooms = async () => {
    try {
      const userData = await API.graphql(
        graphqlOperation(getUser, {
          id: self.id,
        })
      );
      const filterValidRooms = userData.data.getUser.chatRoomUser.items.filter(
        (item) => item.chatRoom != null && item.chatRoom.lastMessage != null
      );
      const sortedRooms = filterValidRooms.sort(
        (a, b) => a.chatRoom.lastMessage.updatedAt < b.chatRoom.lastMessage.updatedAt)
      ;
      let seenList = sortedRooms.map(room => room.seen)
      setSeenArr(seenList)
      setChatRooms(sortedRooms);
    } catch (e) {
      console.log(e);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchChatRooms();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    setRefreshing(true);
    onRefresh();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: (data) => {
        fetchChatRooms();
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onDeleteChatRoom)
    ).subscribe({
      next: (data) => {
        fetchChatRooms();
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateChatRoom)
    ).subscribe({
      next: (data) => {
        fetchChatRooms();
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom)
    ).subscribe({
      next: (data) => {
        console.log("updated")
        fetchChatRooms();
      },
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        extraData={seenArr}
        style={{ width: "100%" }}
        data={chatRooms}
        renderItem={({ item }) => {
          if (item.chatRoom) {
            return (
              <ChatListItem chatRoom={item.chatRoom} navigation={navigation} />
            );
          } else {
            return <></>;
          }
        }}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.FG}
          />
        }
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
