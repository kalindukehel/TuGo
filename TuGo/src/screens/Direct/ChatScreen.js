import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../../constants";
import ChatListItem from "../../components/ChatListItem";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "./queries";
import { useAuthState } from "../../context/authContext";
import { onCreateMessage } from "../../graphql/subscriptions";

const ChatScreen = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
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

      setChatRooms(userData.data.getUser.chatRoomUser.items);
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

  return (
    <View style={styles.container}>
      <FlatList
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
