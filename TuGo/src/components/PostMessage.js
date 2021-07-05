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

const PostMessage = ({ message, navigation }) => {
  const { userToken, self } = useAuthState();

  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    setLoadingPost(true);
    async function getPost() {
      const postRes = await getPostByIdAPI(userToken, message.content);
      setPost(postRes.data);
      const authorRes = await getAccountByIdAPI(postRes.data.author, userToken);
      setAuthor(authorRes.data);
    }
    getPost();
    setLoadingPost(false);
  }, []);
  const isMyMessage = () => {
    return message.user.id == self.id;
  };
  return (
    <View
      style={{
        ...styles.container,
        justifyContent: isMyMessage() ? "flex-end" : "flex-start",
      }}
    >
      {!isMyMessage() && (
        <Image
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            marginRight: 10,
          }}
          source={{ uri: message.user.imageUri }}
        />
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
            <TouchableOpacity
              style={{
                ...styles.image,
                alignItems: "center",
                justifyContent: "center",
              }}
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
              <Image style={styles.image} source={{ uri: post.album_cover }} />
            </TouchableOpacity>
            {/* <Text style={styles.time}>{moment(message.createdAt).fromNow()}</Text> */}
          </View>
        ) : (
          <View style={{ height: 190, width: 150 }}>
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
});

export default PostMessage;
