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
  ActivityIndicator,
  Alert
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
  deleteComment as deleteCommentAPI
} from "../api";
import { useAuthState } from "../context/authContext";
import { API_URL, Length } from "../../constants";
import {
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Send from "../../assets/sendButton.svg";
import { Colors, appTheme } from "../../constants";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
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
import * as Haptics from "expo-haptics";
import GText from "../components/GText"
import { useKeyboard } from "../components/UseKeyboard";
import ImageS3 from "../components/ImageS3";

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
  const [keyboardHeight] = useKeyboard();

  const insets = useSafeAreaInsets();

  //pagination
  const [isLoading, setIsLoading] = useState(false)
  const [next, setNext] = useState(API_URL + "/api/accounts/?page=" + 1)

  useEffect(()=> {
    if(next) {
      setIsLoading(true)
      getData()
    }
  },[])

  async function getData() {
    const response = await getAccountsAPI(userToken, next);
    setAccounts(accounts.concat(response.data.results))
    setNext(response.data.next)
    setIsLoading(false)
  }

  const handleLoadMore = () => {
    setIsLoading(true)
    getData()
  }

  const getFooter = () => {
    return (
      isLoading &&
      <View style={styles.loader}>
        <ActivityIndicator size='small'/>
      </View>
    )
  }

  useEffect(() => {
    const getAccounts = async () => {
      //check if searched text is not empty
      const url = API_URL + "/api/accounts/?page=" + 1
      const searchRes = await getAccountsAPI(userToken, next);
      setNext(searchRes.data.next)
      setAccounts(
        searchRes.data.results.map((account) => ({
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
      return <GText key={index}>{part.text}</GText>;
    }

    // Mention type part
    if (isMentionPartType(part.partType)) {
      return (
        <GText
          key={`${index}-${part.data?.trigger}`}
          style={{ color: Colors.primary }}
          onPress={() => {
            navigation.push("Profile", {
              id: parseInt(part.data.id, 10),
            });
          }}
        >
          {part.text}
        </GText>
      );
    }

    // Other styled part types
    return (
      <GText key={`${index}-pattern`} style={part.partType.textStyle}>
        {part.text}
      </GText>
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
          <FlatList
            style={{
              backgroundColor: Colors.contrastGray,
              position: "absolute",
              bottom: 40,
              left: 0,
              right: 0,
              maxHeight: (height - keyboardHeight) * 0.7,
              borderRadius: 10,
            }}
            keyboardShouldPersistTaps={'always'}
            data={suggestions
              .filter((one) =>
                one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
              )}
            renderItem={({item})=>{
              return (
                <TouchableWithoutFeedback
                  key={item.id}
                  onPress={() => {
                    onSuggestionPress(item)}
                  }
                >
                  <View 
                    style={{
                      padding: 12,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <ImageS3
                      url={item.profile_picture}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        marginRight: 10,
                      }}
                    />
                    <GText style={{ color: Colors.FG }}>{item.name}</GText>
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
            onEndReachedThreshold={0}
            ListFooterComponent={getFooter}
            onEndReached={() => {
              if(next && !isLoading) handleLoadMore();
            }}
          />
      );
    };

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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setCanSendComment(false);
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

  async function onDeleteComment(commentId) {
    const res = await deleteCommentAPI(postId, commentId, userToken);
    await getPostStates()
  }

  async function sendComment() {
    if (message != "") {
      const res = await addCommentAPI(userToken, post.id, { value: message });
      if (author.notification_token != self.notification_token) {
        const notifRes = await pushNotificationAPI(
          author.notification_token,
          {creator: self.username},
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
              {creator: self.username},
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

  const deleteConfirmation = (commentId) =>
    Alert.alert(
      "Delete Comment\n",
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
            onDeleteComment(commentId);
          },
        },
      ],
      { cancelable: false }
    );

  const renderItem = ({ item }) => {
    const curAccount = commentAccounts.find(
      (accounts) => accounts.id == item.author
    );
    const isSelf = self.id === item.author;
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
        <View style={{flexDirection: 'row', alignItems: 'center', width: isSelf ? 0.8*width : 0.9*width}}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              navigation.push("Profile", {
                id: curAccount.id,
              });
            }}
          >
            <ImageS3
              url={curAccount.profile_picture}
              style={{ width: 30, height: 30, borderRadius: 20, marginRight: 5 }}
            ></ImageS3>
          </TouchableOpacity>
          <GText
            style={{
              flexWrap: "wrap",
              marginRight: 20,
              marginLeft: 10,
              color: Colors.text,
            }}
          >
            <GText style={styles.authorName}>{curAccount.username + `: `}</GText>
            <GText style={{ color: Colors.text }}>{parts.map(renderPart)}</GText>
          </GText>
        </View>
        {isSelf &&
        <TouchableWithoutFeedback style={{}} onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          deleteConfirmation(item.id)
        }}>
          <View
            style={{paddingHorizontal: 5}}>
            <AntDesign name="close" size={16} color={Colors.FG} />
          </View>
        </TouchableWithoutFeedback>
        
        }
      </View>
    );
  };

  const header = () => {
    return (
      post.caption !== '' &&
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
            url={author.profile_picture}
            style={{ width: 30, height: 30, borderRadius: 20, marginRight: 5 }}
          ></Image>
        </TouchableOpacity>
        <GText style={{ flexWrap: "wrap", marginRight: 20, marginLeft: 10 }}>
          <GText style={styles.authorName}>{author.username + `: `}</GText>
          <GText style={{ color: Colors.text }}>{post.caption}</GText>
        </GText>
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
              maxLength={Length.comment}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    justifyContent: 'space-between'
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
  loader: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Comments;
