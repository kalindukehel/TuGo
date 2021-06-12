import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { useAuthState } from "../context/authContext";
import { Colors } from "../../constants";
import { getPostById as getPostByIdAPI } from "../api";

const PostMessage = ({ message, navigation }) => {
  const { userToken, self } = useAuthState();

  const [post, setPost] = useState(null);

  useEffect(() => {
    async function getPost() {
      const postRes = await getPostByIdAPI(userToken, message.content);
      setPost(postRes.data);
    }
    getPost();
  }, []);
  const isMyMessage = () => {
    return message.user.id == self.id;
  };
  return (
    post && (
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
          <TouchableOpacity
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
      </View>
    )
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
