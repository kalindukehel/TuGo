import React, { useState, useEffect, FC, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  GestureResponderHandlers,
} from "react-native";
import {
  getPostComments as getPostCommentsAPI,
  getPostById as getPostByIdAPI,
  getAccountById as getAccountByIdAPI,
  by_ids as by_idsAPI,
  addComment as addCommentAPI,
  pushNotification as pushNotificationAPI,
  getAccounts as getAccountsAPI,
  addTag as addTagAPI,
} from "../api";
import { useAuthState } from "../context/authContext";
import { API_URL } from "../../constants";
import {
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Send from "../../assets/sendButton.svg";
import { Colors, appTheme } from "../../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  MentionInput,
  Suggestion,
  MentionSuggestionsProps,
  replaceMentionValues,
  Part,
  PartType,
  parseValue,
  isMentionPartType,
} from "react-native-controlled-mentions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

var { width, height } = Dimensions.get("window");

const maxlimit = 20;

const Comments = (props) => {
  const { navigation } = props;
  const { postId, authorId } = props.route.params;
  const { userToken, self } = useAuthState();
  const [masterData, setMasterData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [commentAccounts, setCommentAccounts] = useState(null);
  const [canSendComment, setCanSendComment] = useState(false);
  const [message, setMessage] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [sizeValue, setSizeValue] = useState(200);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const getAccounts = async () => {
      //check if searched text is not empty
      const searchRes = await getAccountsAPI(userToken);
      setAccounts(
        searchRes.data.map((account) => ({
          id: account.id,
          name: account.username,
          profile_picture: account.profile_picture,
          notification_token: account.notification_token,
        }))
      );
    };
    getAccounts();
  }, []);

  let list = [];

  const renderPart = (part: Part, index: number) => {
    // Just plain text
    if (!part.partType) {
      return <Text key={index}>{part.text}</Text>;
    }

    // Mention type part
    if (isMentionPartType(part.partType)) {
      return (
        <Text
          key={`${index}-${part.data?.trigger}`}
          style={{ color: "aqua" }}
          onPress={() => {
            navigation.push("Profile", {
              id: parseInt(part.data.id, 10),
            });
          }}
        >
          {part.text}
        </Text>
      );
    }

    // Other styled part types
    return (
      <Text key={`${index}-pattern`} style={part.partType.textStyle}>
        {part.text}
      </Text>
    );
  };

  const renderAllSuggestions: (
    suggestions: Suggestion[]
  ) => FC<MentionSuggestionsProps> =
    (suggestions) =>
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return <></>;
      }

      return (
        <ScrollView
          style={{
            backgroundColor: Colors.contrastGray,
            position: "absolute",
            bottom: 40,
            left: 0,
            right: 0,
            maxHeight: 300,
            borderRadius: 10,
          }}
        >
          {suggestions
            .filter((one) =>
              one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
            )
            .map((one) => {
              console.log(one);
              return (
                <TouchableWithoutFeedback
                  key={one.id}
                  onPress={() => onSuggestionPress(one)}
                  style={{
                    padding: 12,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: one.profile_picture }}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 999,
                      marginRight: 10,
                    }}
                  />
                  <Text style={{ color: Colors.FG }}>{one.name}</Text>
                </TouchableWithoutFeedback>
              );
            })}
        </ScrollView>
      );
    };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setCanSendComment(false);
    async function getPostStates() {
      const postRes = await getPostByIdAPI(userToken, postId);
      setPost(postRes.data);
      const commentsRes = await getPostCommentsAPI(userToken, postId);
      list = commentsRes.data.map((item) => item.author);
      setMasterData(commentsRes.data);
      const commentAuthorsRes = await by_idsAPI(list, userToken);
      setCommentAccounts(commentAuthorsRes.data);
      const authorRes = await getAccountByIdAPI(postRes.data.author, userToken);
      setAuthor(authorRes.data);
    }
    await getPostStates();
    setRefreshing(false);
    setCanSendComment(true);
  }, []);
  useEffect(() => {
    onRefresh();
  }, []);

  const findAccountfromId = (id) => {
    return accounts.find((account) => account.id == id);
  };

  async function sendComment() {
    if (message != "") {
      const res = await addCommentAPI(userToken, post.id, { value: message });
      if (author.notification_token != self.notification_token) {
        const notifRes = await pushNotificationAPI(
          author.notification_token,
          self.username,
          "comment"
        );
      }
      const { parts } = parseValue(message, [
        {
          trigger: "@",
          renderSuggestions: renderMentionSuggestions,
        },
      ]);
      parts.forEach(async (part) => {
        if (isMentionPartType(part.partType)) {
          const account = findAccountfromId(part.data.id);
          const res = await addTagAPI(userToken, post.id, {
            value: message,
            tagged_id: account.id,
          });
          if (
            account.notification_token != self.notification_token &&
            part.data.id != author.id
          ) {
            const notifRes = await pushNotificationAPI(
              account.notification_token,
              self.username,
              "tag"
            );
          }
        }
      });
      const commentsRes = await getPostCommentsAPI(userToken, postId);
      list = commentsRes.data.map((item) => item.author);
      const commentAuthorsRes = await by_idsAPI(list, userToken);
      setCommentAccounts(commentAuthorsRes.data);
      setMasterData(commentsRes.data);
      setMessage("");
      Keyboard.dismiss();
    }
  }

  const renderItem = ({ item }) => {
    const curAccount = commentAccounts.find(
      (accounts) => accounts.id == item.author
    );
    const { parts } = parseValue(item.value, [
      {
        trigger: "@",
        renderSuggestions: renderMentionSuggestions,
      },
      // {
      //   pattern:
      //     /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
      //   textStyle: { color: "blue" },
      // },
    ]);
    return (
      <View style={styles.comment}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            navigation.push("Profile", {
              id: curAccount.id,
            });
          }}
        >
          <Image
            source={{ uri: API_URL + curAccount.profile_picture }}
            style={{ width: 30, height: 30, borderRadius: 20, marginRight: 5 }}
          ></Image>
        </TouchableOpacity>
        <Text
          style={{
            flexWrap: "wrap",
            marginRight: 20,
            marginLeft: 10,
            color: Colors.text,
          }}
        >
          <Text style={styles.authorName}>{curAccount.username + `: `}</Text>
          <Text style={{ color: Colors.text }}>{parts.map(renderPart)}</Text>
        </Text>
      </View>
    );
  };

  const header = () => {
    return (
      <View style={styles.caption}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            navigation.push("Profile", {
              id: author.id,
            });
          }}
        >
          <Image
            source={{
              uri: author
                ? author.profile_picture
                : API_URL + "/media/default.jpg",
            }}
            style={{ width: 30, height: 30, borderRadius: 20, marginRight: 5 }}
          ></Image>
        </TouchableOpacity>
        <Text style={{ flexWrap: "wrap", marginRight: 20, marginLeft: 10 }}>
          <Text style={styles.authorName}>{author.username + `: `}</Text>
          <Text style={{ color: Colors.text }}>{post.caption}</Text>
        </Text>
      </View>
    );
  };

  const renderMentionSuggestions = renderAllSuggestions(accounts);

  return (
    author &&
    post && (
      <View style={styles.container}>
        <FlatList
          keyboardDismissMode="interactive"
          contentContainerStyle={{ flexGrow: 1}}
          data={masterData}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.FG}
            />
          }
          renderItem={renderItem}
          ListHeaderComponent={header}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={65 + insets.bottom}
        >
          <View style={styles.commentBarBackground}>
            <MentionInput
              maxHeight={400}
              maxLength={200}
              keyboardAppearance={appTheme}
              containerStyle={{ borderRadius: 15, flex: 1, color: Colors.FG }}
              autoFocus
              value={message}
              onChange={setMessage}
              partTypes={[
                {
                  trigger: "@",
                  renderSuggestions: renderMentionSuggestions,
                  textStyle: { fontWeight: "bold", color: Colors.text },
                },
                // {
                //   pattern:
                //     /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
                //   textStyle: { fontWeight: "bold", color: Colors.text },
                // },
              ]}
              style={styles.commentBar}
              placeholder="Type here..."
              placeholderTextColor={Colors.text}
            />
            <TouchableOpacity
              disabled={!canSendComment}
              style={{
                opacity: canSendComment ? 1 : 0.5,
                marginBottom: 3
              }}
              onPress={sendComment}
            >
              <View style={{ marginRight: 5 }}>
                <MaterialCommunityIcons
                  name="send-circle"
                  size={30}
                  color={Colors.FG}
                />
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  caption: {
    borderColor: "#C8C8C8",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 0,
  },
  authorName: {
    fontWeight: "bold",
    color: Colors.text,
  },
  comment: {
    borderColor: "#C8C8C8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
  },
  commentBar: {
    color: Colors.text,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  commentBarBackground: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.contrastGray,
    borderRadius: 20,
    margin: 5,
    maxHeight: 100
  },
});

export default Comments;
