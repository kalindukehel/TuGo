import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import moment from "moment";
import { useAuthState } from "../context/authContext";
import { Colors } from "../../constants";
import {
  getPostById as getPostByIdAPI,
  getAccountById as getAccountByIdAPI,
} from "../api";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const PostMessage = ({ message, navigation }) => {
  const { userToken, self } = useAuthState();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null)
  const [loadingPost, setLoadingPost] = useState(false);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    setLoadingPost(true);
    async function getPost() {
      try{
      const postRes = await getPostByIdAPI(userToken, message.content);
      setPost(postRes.data);
      const authorRes = await getAccountByIdAPI(postRes.data.author, userToken);
      setAuthor(authorRes.data);
      }
      catch(e){
        setError('Post has been Deleted.')
      }
    }
    getPost();
    setLoadingPost(false);
  }, []);
  const isMyMessage = () => {
    return message.user.id == self.id;
  };
  if (post) console.log(post.album_cover)
  return (
    <View
      style={{
        ...styles.container,
        justifyContent: isMyMessage() ? "flex-end" : "flex-start",
      }}
    >
      {!isMyMessage() && (            
        <TouchableWithoutFeedback
          onPress={()=>{
            navigation.push("Profile", {
              id: author.id,
            });
          }}
        >
          <Image
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              marginRight: 10,
            }}
            source={{ uri: message.user.imageUri }}
          />
        </TouchableWithoutFeedback>
      )}
      <View
        style={[
          styles.messageBox,
          {
            marginLeft: isMyMessage() ? 200 : 0,
            marginRight: isMyMessage() ? 0 : 200,
          },
        ]}
      >
        {post && author ? (
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 5,
                height: 40,
              }}
            >
              <Image
                source={{ uri: author.profile_picture }}
                style={{ borderRadius: 999, height: 25, width: 25 }}
              />
              <Text style={{ color: Colors.text, marginLeft: 10 }}>
                {author.username}
              </Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.push("Post", {
                  screen: "Post",
                  params: {
                    postId: post.id,
                    authorId: post.author,
                  },
                });
              }}
            >
              <View 
                style={{
                  ...styles.image,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image style={styles.image} source={{ uri: post.album_cover }} />
              </View>
            </TouchableWithoutFeedback>
            {/* <Text style={styles.time}>{moment(message.createdAt).fromNow()}</Text> */}
          </View>
        ) : error ? (
          <View 
            style={styles.errorView}>
            <Text style={{color: Colors.text, fontSize: 12}}>{error}</Text>
          </View>
        ) : (
          <View style={{ height: 190, width: 150, justifyContent: 'center' }}>
            <ActivityIndicator
              animating={true}
              size="small"
              color={Colors.FG}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageBox: {
    borderRadius: 20,
  },
  name: {
    color: Colors.text,
    fontWeight: "bold",
    marginBottom: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  time: {
    alignSelf: "flex-end",
    color: "grey",
  },
  errorView: {
    height: 190, 
    width: 150, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, 
    backgroundColor: Colors.contrastGray
  }
});

export default PostMessage;
