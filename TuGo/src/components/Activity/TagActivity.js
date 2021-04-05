import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useAuthState } from "../../context/authContext";
import {
  getPostById as getPostByIdAPI,
  getAccountById as getAccountByIdAPI,
  getPostTags as getPostTagsAPI,
} from "../../api";

import moment from "moment";
import { Colors } from "../../../constants";

var { width, height } = Dimensions.get("window");

const TagActivity = (props) => {
  const { activity, navigation } = props;
  const { userToken } = useAuthState();
  const [post, setPost] = useState(null);
  const [tagger, setTagger] = useState(null);
  const [tag, setTag] = useState(null);
  const [postAuthor, setPostAuthor] = useState(null);

  useEffect(() => {
    async function getTagStates() {
      const postRes = await getPostByIdAPI(userToken, activity.post);
      setPost(postRes.data);
      const tagRes = await getPostTagsAPI(userToken, activity.post);
      const tagFound = tagRes.data.find((tag) => tag.id == activity.tag);
      setTag(tagFound.value);
      const taggerRes = await getAccountByIdAPI(
        activity.action_user,
        userToken
      );
      setTagger(taggerRes.data);
      const postAuthorRes = await getAccountByIdAPI(
        postRes.data.author,
        userToken
      );
      setPostAuthor(postAuthorRes.data);
    }
    getTagStates();
  }, []);

  return (
    tagger &&
    postAuthor &&
    post && (
      <View style={styles.tagElement}>
        <View style={{ flexDirection: "row", alignContent: "center" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.push("Profile", {
                id: tagger.id,
              });
            }}
          >
            <Image
              source={{ uri: tagger.profile_picture }}
              style={{
                width: 45,
                height: 45,
                borderRadius: 45 / 2,
                borderWidth: 1,
              }}
            ></Image>
          </TouchableOpacity>
          <Text
            style={{
              flexWrap: "wrap",
              flex: 1,
              marginHorizontal: 10,
              alignSelf: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", color: Colors.text }}>
              {tagger.username}
            </Text>
            <Text
              style={{ color: Colors.text }}
            >{` tagged you in ${postAuthor.username}'s post `}</Text>
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
              source={{ uri: post.album_cover }}
              style={{
                width: 45,
                height: 45,
                borderRadius: 5,
                borderWidth: 0.5,
              }}
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
    backgroundColor: Colors.BG,
  },
  tagElement: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
export default TagActivity;
