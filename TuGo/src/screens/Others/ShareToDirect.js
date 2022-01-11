import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Keyboard,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuthState } from "../../context/authContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  searchUsers as searchUsersAPI,
  getAccounts as getAccountsAPI,
  viewableUsers as viewableUsersAPI,
  pushNotification as pushNotificationAPI,
} from "../../api";
import { API, graphqlOperation } from "aws-amplify";
import {
  createChatRoom,
  createChatRoomUser,
  createMessage,
  updateChatRoom,
} from "../../graphql/mutations";
import { getChatRoom, getUser } from "../Direct/queries";
import { listUsers } from "../../graphql/queries";
import GText from "../../components/GText";

//icons
import { Feather } from "@expo/vector-icons";
import { Colors, API_URL } from "../../../constants";
import ImageS3 from "../../components/ImageS3";

var { width, height } = Dimensions.get("window");

const ShareToDirect = ({ shareItem, shareModal }) => {
  const insets = useSafeAreaInsets();

  const { userToken, self } = useAuthState();
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [showFull, setShowFull] = useState(false);
  const [suggestionlist, setSuggestionList] = useState([]);
  const [receiverList, setReceiverList] = useState([]);
  const _bottomSheetOffsetY = React.useMemo(() => new Animated.Value(0), []);
  const _bottomSheetAnim = React.useMemo(() => new Animated.Value(0), []);
  const ref = useRef({
    bottomSheetHeight: 0,
    preOffsetY: 0,
  });
  const STATUS_BAR_HEIGHT = 10 + insets.top;
  //Effect
  useEffect(() => {
    const fetchUsers = async () => {
      //get users from aws database
      try {
        const allUsersData = await viewableUsersAPI(userToken);
        const filteredList = allUsersData.data.filter(
          (item) => item.id !== self.id
        );
        setSuggestionList(filteredList);
        setReceiverList(filteredList);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUsers();
  }, []);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = suggestionlist.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const usernameData = item.username
          ? item.username.toUpperCase()
          : "".toUpperCase();
        const nameData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return (
          usernameData.indexOf(textData) > -1 || nameData.indexOf(textData) > -1
        );
      });
      setReceiverList(newData);
      setQuery(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterData
      setReceiverList(suggestionlist);
      setQuery(text);
    }
  };

  const _onGestureEventHandler = ({ nativeEvent: { translationY } }) => {
    if (translationY < -(0.4 * height - STATUS_BAR_HEIGHT)) return;
    _bottomSheetOffsetY.setValue(ref.current.preOffsetY + translationY);
  };
  const _onStateChangeHandler = ({ nativeEvent: { translationY, state } }) => {
    if (state === State.END) {
      if (ref.current.preOffsetY + translationY > height * 0.3) {
        Animated.timing(_bottomSheetOffsetY, {
          toValue: ref.current.bottomSheetHeight,
          useNativeDriver: true,
          duration: 150,
        }).start(() => {
          shareModal.current.close();
        });
      } else if (ref.current.preOffsetY + translationY < 0) {
        const offsetY = Math.abs(ref.current.preOffsetY + translationY);
        if (offsetY > height * 0.2) {
          Animated.timing(_bottomSheetAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
          Animated.spring(_bottomSheetOffsetY, {
            toValue: -height * 0.4 + STATUS_BAR_HEIGHT,
            useNativeDriver: true,
          }).start();
          setShowFull(true);
          ref.current.preOffsetY = -height * 0.4 + STATUS_BAR_HEIGHT;
        } else {
          Animated.timing(_bottomSheetAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
          Animated.spring(_bottomSheetOffsetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setShowFull(false);
          ref.current.preOffsetY = 0;
          Keyboard.dismiss();
        }
      } else {
        Animated.timing(_bottomSheetAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        ref.current.preOffsetY = 0;
        Animated.spring(_bottomSheetOffsetY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Keyboard.dismiss();
      }
    }
  };
  const _onTxtInputFocus = () => {
    Animated.timing(_bottomSheetAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setShowFull(true);
    Animated.timing(_bottomSheetOffsetY, {
      duration: 200,
      toValue: -height * 0.4 + STATUS_BAR_HEIGHT,
      useNativeDriver: true,
    }).start();
    ref.current.preOffsetY = -height * 0.4 + STATUS_BAR_HEIGHT;
  };
  const _onTxtInputBlur = () => {
    Animated.timing(_bottomSheetAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    ref.current.preOffsetY = 0;
    Animated.spring(_bottomSheetOffsetY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          shareModal.current.close();
        }}
        style={{
          height: "100%",
          width: "100%",
        }}
      ></TouchableOpacity>
      <PanGestureHandler
        onGestureEvent={_onGestureEventHandler}
        onHandlerStateChange={_onStateChangeHandler}
      >
        <Animated.View
          onLayout={({
            nativeEvent: {
              layout: { height },
            },
          }) => {
            ref.current.bottomSheetHeight = height;
          }}
          style={{
            ...styles.bottomSheet,
            borderTopLeftRadius: _bottomSheetAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            }),
            borderTopRightRadius: _bottomSheetAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            }),
            shadowOpacity: _bottomSheetAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.25, 0],
            }),
            shadowRadius: _bottomSheetAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 1],
            }),
            transform: [
              {
                translateY: _bottomSheetOffsetY,
              },
            ],
          }}
        >
          <View style={styles.titleWrapper}>
            <View
              style={{
                marginBottom: 10,
                height: 3,
                width: 40,
                backgroundColor: "#999",
                borderRadius: 2,
              }}
            />
            <View style={styles.messageInputWrapper}>
              <Image
                style={styles.previewImage}
                source={{
                  uri: shareItem.album_cover,
                }}
              />
              <TextInput
                onFocus={_onTxtInputFocus}
                multiline={true}
                value={message}
                onChangeText={setMessage}
                style={styles.messageInput}
                placeholder="Write a message..."
                placeholderTextColor={Colors.text}
              />
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.searchWrapper}>
              <View style={styles.searchBtn}>
                <Icon name="magnify" size={20} color="#666" />
              </View>
              <TextInput
                style={styles.searchInput}
                onFocus={_onTxtInputFocus}
                value={query}
                onChangeText={searchFilterFunction}
                placeholder="Search"
                placeholderTextColor={Colors.text}
              />
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom }}
              style={{
                height: height * (showFull ? 1 : 0.6) - 83.5 - 36 - 50,
                marginTop: 5,
              }}
              data={receiverList}
              renderItem={({ item, index }) => (
                <ReceiverItem
                  shareItem={shareItem}
                  index={index}
                  user={item}
                  message={message}
                />
              )}
              keyExtractor={(item, index) => `${index}`}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>
    </SafeAreaView>
  );
};

export default ShareToDirect;

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: Colors.contrastGray,
    opacity: 1,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    paddingBottom: 40,
    position: "absolute",
    zIndex: 1,
    top: height * 0.4,
    left: 0,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },

    elevation: 5,
    height: height,
  },
  titleWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  optionItem: {
    flexDirection: "row",
    height: 44,
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
  },
  messageInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    minHeight: 50,
    width: "100%",
  },
  messageInput: {
    minHeight: 30,
    width: width - 30 - 50,
    paddingHorizontal: 15,
    color: Colors.text,
  },
  previewImage: {
    borderColor: "#ddd",
    borderWidth: 1,
    height: 50,
    width: 50,
    borderRadius: 5,
  },
  body: {
    padding: 15,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchBtn: {
    width: 36,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    height: "100%",
    width: width - 30 - 36 * 2,
    color: Colors.text,
  },
  receiverItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-between",
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 44,
    borderWidth: 0.3,
    borderColor: "#333",
  },
  btnSend: {
    width: 64,
    height: 24,
    borderRadius: 3,

    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ddd",
  },
});
const ReceiverItem = ({ user, index, shareItem, message }) => {
  const [sent, setSent] = useState(false);
  const { self } = useAuthState();
  const [loadingShare, setLoadingShare] = useState(false);

  const _onToggleSend = async () => {
    if (!sent) {
      try {
        // check if self already has a chatroom with account
        setLoadingShare(true);
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
          let otherUser = null;
          if (currChatRoom.chatRoom.chatRoomUsers.items[0].user != null) {
            if (
              currChatRoom.chatRoom.chatRoomUsers.items[0].user.id == self.id
            ) {
              otherUser = currChatRoom.chatRoom.chatRoomUsers.items[1].user;
            } else {
              otherUser = currChatRoom.chatRoom.chatRoomUsers.items[0].user;
            }
          }
          if (otherUser)
            if (otherUser.id == user.id) {
              existingChatRoomId = currChatRoom.chatRoomID;
              break;
            }
        }
        if (existingChatRoomId) {
          const msg = {
            content: shareItem.id,
            userID: self.id,
            chatRoomID: existingChatRoomId,
            type: "POST",
            seen: 0,
          };

          // get receiver's push token
          const chatRoomData = await API.graphql(
            graphqlOperation(getChatRoom, {
              id: existingChatRoomId,
            })
          );

          let allUsersInChatRoom =
            chatRoomData.data.getChatRoom.chatRoomUsers.items.filter(
              (user) => user.user.id != self.id
            );
          const pushTokenReceiver =
            allUsersInChatRoom.length > 0
              ? allUsersInChatRoom[0].user.expoPushToken
              : null;

          let newMessageData = await API.graphql(
            graphqlOperation(createMessage, {
              input: msg,
            })
          );

          //send push notification for post
          if (pushTokenReceiver !== null) {
            const notifRes = await pushNotificationAPI(
              pushTokenReceiver,
              { creator: self.username },
              "post"
            );
          }

          if (message != "") {
            newMessageData = await API.graphql(
              graphqlOperation(createMessage, {
                input: {
                  content: message,
                  userID: self.id,
                  chatRoomID: existingChatRoomId,
                  type: "TEXT",
                  seen: 0,
                },
              })
            );

            //send push notification for message
            if (pushTokenReceiver !== null) {
              const notifRes = await pushNotificationAPI(
                pushTokenReceiver,
                { creator: self.username, content: message },
                "message"
              );
            }
          }
          //update lastMessage and seen list
          let seen = [];
          seen.push(self.id);
          await API.graphql(
            graphqlOperation(updateChatRoom, {
              input: {
                id: existingChatRoomId,
                lastMessageID: newMessageData.data.createMessage.id,
                seen: seen,
              },
            })
          );
        } else {
          //1. Create a new Chat Room
          const newChatRoomData = await API.graphql(
            graphqlOperation(createChatRoom, {
              input: {
                lastMessageID: "zz753fca-e8c3-473b-8e85-b14196e84e16",
                seen: [self.id],
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
                userID: user.id,
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
          // get receiver's push token
          const chatRoomData = await API.graphql(
            graphqlOperation(getChatRoom, {
              id: newChatRoom.id,
            })
          );

          let allUsersInChatRoom =
            chatRoomData.data.getChatRoom.chatRoomUsers.items.filter(
              (user) => user.user.id != self.id
            );
          const pushTokenReceiver =
            allUsersInChatRoom.length > 0
              ? allUsersInChatRoom[0].user.expoPushToken
              : null;

          const msg = {
            content: shareItem.id,
            userID: self.id,
            chatRoomID: newChatRoom.id,
            type: "POST",
            seen: 0,
          };
          let newMessageData = await API.graphql(
            graphqlOperation(createMessage, {
              input: msg,
            })
          );

          //send push notification for post
          if (pushTokenReceiver !== null) {
            const notifRes = await pushNotificationAPI(
              pushTokenReceiver,
              { creator: self.username },
              "post"
            );
          }

          if (message != "") {
            newMessageData = await API.graphql(
              graphqlOperation(createMessage, {
                input: {
                  content: message,
                  userID: self.id,
                  chatRoomID: newChatRoom.id,
                  type: "TEXT",
                  seen: 0,
                },
              })
            );

            //send push notification for message
            if (pushTokenReceiver !== null) {
              const notifRes = await pushNotificationAPI(
                pushTokenReceiver,
                { creator: self.username, content: message },
                "message"
              );
            }
          }
          await API.graphql(
            graphqlOperation(updateChatRoom, {
              input: {
                id: newChatRoom.id,
                lastMessageID: newMessageData.data.createMessage.id,
              },
            })
          );
        }
        setLoadingShare(false);
      } catch (e) {
        console.log(e);
      }
    } else {
    }
    setSent(true);
  };
  return (
    <View style={styles.receiverItem}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ImageS3 style={styles.avatar} accountId={user.id} />
        <View
          style={{
            marginLeft: 10,
          }}
        >
          <GText style={{ color: Colors.text }}>{user.name}</GText>
          <GText
            style={{
              fontWeight: "500",
              color: Colors.text,
            }}
          >
            {user.username}
          </GText>
        </View>
      </View>
      <TouchableOpacity
        onPress={_onToggleSend}
        style={{
          borderRadius: 10,
          padding: 6,
          backgroundColor: sent ? "transparent" : Colors.primary,
          width: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loadingShare ? (
          <ActivityIndicator animating={true} size="small" color={Colors.FG} />
        ) : (
          <GText
            style={{
              color: "black",
              fontSize: 12,
              padding: 3,
            }}
          >
            {sent ? "Sent" : "Send"}
          </GText>
        )}
      </TouchableOpacity>
    </View>
  );
};
