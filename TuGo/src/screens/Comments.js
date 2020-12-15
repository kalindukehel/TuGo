import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
  } from "react-native";
  import {
    getPostComments as getPostCommentsAPI,
    getPostById as getPostByIdAPI,
    getAccountById as getAccountByIdAPI,
    by_ids as by_idsAPI,
    addComment as addCommentAPI
  } from "../api";
  import { useAuthState } from "../context/authContext";
  import { API_URL } from "../../constants";
  import { FlatList } from "react-native-gesture-handler";
  import Send from "../../assets/sendButton.svg"

  var { width, height } = Dimensions.get("window");  

  const maxlimit = 20;

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

const Likes = (props) => {
    const { navigation } = props;
    const { postId, authorId } = props.route.params
    console.log(postId);
    const { userToken, self } = useAuthState();
    const [masterData, setMasterData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [commentAccounts, setCommentAccounts] = useState(null);
    const [canSendComment, setCanSendComment] = useState(false);
    const [message, setMessage] = useState('');

    let list = [];

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setCanSendComment(false);
        async function getPostStates() {
          const postRes = await getPostByIdAPI(userToken, postId);
          setPost(postRes.data);
          const commentsRes = await getPostCommentsAPI(userToken, postId);
          list = commentsRes.data.map(item => item.author);
          setMasterData(commentsRes.data);
          const commentAuthorsRes = await by_idsAPI(list, userToken);
          setCommentAccounts(commentAuthorsRes.data);
          const authorRes = await getAccountByIdAPI(authorId, userToken);
          setAuthor(authorRes.data);
        }
        getPostStates();
        wait(500).then(() => setRefreshing(false));
        setCanSendComment(true);
      }, []);
      useEffect(() => {
        onRefresh();
      }, []);

      async function sendComment() {
          const res = await addCommentAPI(userToken, post.id, {value: message});
          const commentsRes = await getPostCommentsAPI(userToken, postId);
          list = commentsRes.data.map(item => item.author);
          const commentAuthorsRes = await by_idsAPI(list, userToken);
          setCommentAccounts(commentAuthorsRes.data);
          setMasterData(commentsRes.data);
          setMessage('');
          Keyboard.dismiss();
      }

    const renderItem = (item) => {
      const getComment = item.item;
      console.log(getComment + " getComment");
      console.log(commentAccounts + " commentAccounts");
      const curAccount = commentAccounts.find(item => item.id == getComment.author);
      console.log(curAccount);
      return(
        <View
            style={styles.comment}>
            <TouchableOpacity
                style={{flexDirection: "row", alignItems: "center"}}
                onPress={()=>{
                    navigation.push("Profile", {
                      id: curAccount.id,
                    });
                }}>
                <Image
                    source={{ uri: API_URL + curAccount.profile_picture }}
                    style={{width:30, height: 30, borderRadius: 20, marginRight: 5}}
                ></Image>
            </TouchableOpacity>
            <Text
                style={{flexWrap: "wrap", marginRight: 20, marginLeft: 10}}>
               <Text
                    style={styles.authorName}>
                    {curAccount.username + `: `}
                </Text>
                <Text>{getComment.value}</Text>
            </Text>
        </View>
      )
    }
    
    const header = () => {
        return (
        <View
            style={styles.caption}>
            <TouchableOpacity
                style={{flexDirection: "row", alignItems: "center"}}
                onPress={()=>{
                    navigation.push("Profile", {
                      id: author.id,
                    });
                  }}>
                <Image
                    source={{ uri: author ? author.profile_picture : API_URL + "/media/default.jpg" }}
                    style={{width:30, height: 30, borderRadius: 20, marginRight: 5}}
                ></Image>
            </TouchableOpacity>
            <Text
                style={{flexWrap: "wrap", marginRight: 20, marginLeft: 10}}>
                <Text
                    style={styles.authorName}>
                    {author.username + `: `}
                </Text>
                <Text>{post.caption}</Text>
            </Text>
        </View>
        )
    }

    return(
    author && post &&
      <View
      style={styles.container}
      >
        <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={masterData}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={renderItem} 
            ListHeaderComponent={header}
        />
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={70}
            style={{
                
            }}
        >
            <View
                style={styles.commentBarBackground}>
                <TextInput
                    clearButtonMode="always"
                    editable={canSendComment}
                    style={{ ...styles.commentBar }}
                    placeholder={"Add comment"}
                    onChangeText={value => {
                    setMessage(value);
                    }}
                    onSubmitEditing={() => {
                    sendComment();
                    }}
                    value={message}
                />
                <TouchableOpacity
                    disabled={!canSendComment}
                    style={{ opacity: canSendComment ? 1 : 0.5 }}
                    onPress={sendComment}
                    >
                    <View
                        style={{marginRight: 10}}>
                        <Send width={20} height={35}/>
                    </View>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  caption: {
    borderColor: "#C8C8C8",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 15, 
    borderRadius: 0
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
    borderRadius: 10,
    height: 40,
    paddingLeft: 20,
    margin: 5,
    marginRight: 10,
    borderColor: 'gray',
    backgroundColor: "#DCDCDC",
  },
  commentBarBackground: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
  

export default Likes;

