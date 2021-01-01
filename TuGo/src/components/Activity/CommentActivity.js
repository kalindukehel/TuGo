import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { useAuthState } from "../../context/authContext";
import {
  getPostById as getPostByIdAPI,
  getAccountById as getAccountByIdAPI,
  getPostComments as getPostCommentsAPI,
} from "../../api";

import moment from "moment";

var { width, height } = Dimensions.get("window");

const CommentActivity = (props) => {
  const { activity, navigation } = props;
  const { userToken } = useAuthState();
  const [post, setPost] = useState(null);
  const [commenter, setCommenter] = useState(null);
  const [comment, setComment] = useState(null);

  useEffect(() => {
    async function getCommentStates() {
      const postRes = await getPostByIdAPI(userToken, activity.post);
      setPost(postRes.data);
      const commentRes = await getPostCommentsAPI(userToken, activity.post);
      const commentFound = commentRes.data.find((comment) => comment.id == activity.comment);
      setComment(commentFound.value);
      const commenterRes = await getAccountByIdAPI(activity.action_user, userToken);
      setCommenter(commenterRes.data);
    }
    getCommentStates();
  }, []);

  return (
    commenter &&
    post && (
      <View style={styles.commentElement}>
        <View style={{ flexDirection: "row", alignContent: "center" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.push("Profile", {
                id: commenter.id,
              });
            }}
          >
            <Image
              source={{ uri: commenter.profile_picture }}
              style={{ width: 45, height: 45, borderRadius: 45 / 2, borderWidth: 1 }}
            ></Image>
          </TouchableOpacity>
          <Text style={{ flexWrap: "wrap", flex: 1, marginHorizontal: 10, alignSelf: "center" }}>
            <Text style={{ fontWeight: "bold" }}>{commenter.username}</Text>
            <Text style={{}}>{` commented on your post: `}</Text>
            <Text style={{}}>{comment + " "}</Text>
            <Text style={{ fontSize: 12, color: "#7D7D7D" }}>
              {moment(activity.created_at).fromNow(true)}
            </Text>
          </Text>

          <TouchableOpacity
            style={{}}
            onPress={() => {
              navigation.push("Post", {
                screen: "Post",
                params: {
                  postId: post.id,
                },
              });
            }}
          >
            <Image
              source={{ uri: post.soundcloud_art }}
              style={{ width: 45, height: 45, borderRadius: 5, borderWidth: 1 }}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  commentElement: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
export default CommentActivity;
