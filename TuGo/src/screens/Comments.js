import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import MentionsTextInput from "react-native-mentions";
import {
  searchUsers as searchUsersAPI,
  getAccounts as getAccountsAPI,
  getPostComments as getPostCommentsAPI,
  getPostById as getPostByIdAPI,
  getAccountById as getAccountByIdAPI,
  by_ids as by_idsAPI,
  addComment as addCommentAPI,
} from "../api";
import { useAuthState } from "../context/authContext";
import { API_URL } from "../../constants";
import { FlatList } from "react-native-gesture-handler";
import Send from "../../assets/sendButton.svg";

var { width, height } = Dimensions.get("window");

const maxlimit = 20;

const Comments = (props) => {
  const { navigation } = props;
  const { postId, authorId } = props.route.params;
  const [value, setValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState([]);
  const { userToken, self } = useAuthState();

  let reqTimer = 0;
  const [masterData, setMasterData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [commentAccounts, setCommentAccounts] = useState(null);
  const [canSendComment, setCanSendComment] = useState(false);
  const [message, setMessage] = useState("");

  let list = [];

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

  async function sendComment() {
    const res = await addCommentAPI(userToken, post.id, { value: value });
    const commentsRes = await getPostCommentsAPI(userToken, postId);
    list = commentsRes.data.map((item) => item.author);
    const commentAuthorsRes = await by_idsAPI(list, userToken);
    setCommentAccounts(commentAuthorsRes.data);
    setMasterData(commentsRes.data);
    setValue("");
    Keyboard.dismiss();
  }

  const renderItem = (item) => {
    const getComment = item.item;
    const curAccount = commentAccounts.find(
      (item) => item.id == getComment.author
    );
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
        <Text style={{ flexWrap: "wrap", marginRight: 20, marginLeft: 10 }}>
          <Text style={styles.authorName}>{curAccount.username + `: `}</Text>
          <Text>{getComment.value}</Text>
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
          <Text>{post.caption}</Text>
        </Text>
      </View>
    );
  };

  function renderSuggestionsRow({ item }, hidePanel) {
    return (
      <TouchableOpacity
        onPress={() => onSuggestionTap(item.username, hidePanel)}
      >
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <Image
              source={{
                uri:
                  item.profile_picture[0] == "/"
                    ? API_URL + item.profile_picture
                    : item.profile_picture,
              }}
              style={{
                width: 45,
                height: 45,
                borderRadius: 45 / 2,
                borderWidth: 1,
              }}
            ></Image>
          </View>
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.name}</Text>
            <Text style={styles.usernameText}>@{item.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function onSuggestionTap(username, hidePanel) {
    hidePanel();
    setData([]);
    console.log(keyword);

    const comment =
      keyword.length > 0 ? value.slice(0, -keyword.length) : value;
    setValue(comment + username);
  }

  const getResults = React.useCallback((key) => {
    const searchQuery = key.substring(1);
    if (reqTimer) {
      clearTimeout(reqTimer);
    }

    reqTimer = setTimeout(async () => {
      if (searchQuery.length > 0) {
        const searchRes = await searchUsersAPI(searchQuery, userToken);
        setKeyword(searchQuery);
        setData([...searchRes.data]);
      } else {
        const searchRes = await getAccountsAPI(userToken);
        setData([...searchRes.data]);
        setKeyword(searchQuery);
      }
    }, 200);
  }, []);

  return (
    author &&
    post && (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={masterData}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderItem}
          ListHeaderComponent={header}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={height / 9}
          style={{}}
        >
          <View style={{}}>
            <MentionsTextInput
              textInputStyle={{
                borderColor: "#ebebeb",
                borderWidth: 1,
                paddingLeft: 5,
                fontSize: 15,
                borderRadius: 10,
                backgroundColor: "#DCDCDC",
                marginHorizontal: 5,
                paddingRight: 40,
                paddingVertical: 20,
              }}
              suggestionsPanelStyle={{
                backgroundColor: "rgba(100,100,100,0.1)",
              }}
              loadingComponent={() => (
                <View
                  style={{
                    flex: 1,
                    width,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator />
                </View>
              )}
              textInputMinHeight={40}
              textInputMaxHeight={80}
              trigger={"@"}
              triggerLocation={"new-word-only"} // 'new-word-only', 'anywhere'
              value={value}
              onChangeText={(val) => {
                setValue(val);
              }}
              triggerCallback={(keyword) => getResults(keyword)}
              renderSuggestionsRow={renderSuggestionsRow}
              suggestionsData={data} // array of objects
              keyExtractor={(item, index) => item.username}
              suggestionRowHeight={45}
              horizontal={false} // defaut is true, change the orientation of the list
              MaxVisibleRowCount={5} // this is required if horizontal={false}
            />
          </View>
          <TouchableOpacity
            disabled={!canSendComment}
            style={{
              opacity: canSendComment ? 1 : 0.5,
              position: "absolute",
              left: width * 0.9,
            }}
            onPress={sendComment}
          >
            <View style={{ marginRight: 10 }}>
              <Send width={20} height={35} />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  suggestionsRowContainer: {
    flexDirection: "row",
  },
  caption: {
    borderColor: "#C8C8C8",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 0,
  },
  authorName: {
    fontWeight: "bold",
  },
  comment: {
    borderColor: "#C8C8C8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 20,
  },
  commentBar: {
    flex: 1,
    borderRadius: 10,
    color: "black",
    height: 40,
    paddingLeft: 20,
    margin: 5,
    marginRight: 10,
    borderColor: "gray",
    backgroundColor: "#DCDCDC",
  },
  commentBarBackground: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatarBox: {
    width: 35,
    paddingTop: 2,
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  usernameInitials: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 15,
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: "500",
  },
  usernameText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
  },
});

export default Comments;
