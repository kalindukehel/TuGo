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
  getPostComments as getPostCommentsAPI,
} from "../../api";

import moment from "moment";
import { Colors } from "../../../constants";
import GText from "../GText";
import ImageS3 from "../ImageS3";

var { width, height } = Dimensions.get("window");

const LikeActivity = (props) => {
  const { activity, navigation } = props;
  const { userToken } = useAuthState();
  const [post, setPost] = useState(null);
  const [liker, setLiker] = useState(null);

  useEffect(() => {
    async function getLikeStates() {
      const postRes = await getPostByIdAPI(userToken, activity.post);
      setPost(postRes.data);
      const likerRes = await getAccountByIdAPI(activity.action_user, userToken);
      setLiker(likerRes.data);
    }
    getLikeStates();
  }, []);

  return (
    liker &&
    post && (
      <View style={styles.likeElement}>
        <View style={{ flexDirection: "row", alignContent: "center" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.push("Profile", {
                id: liker.id,
              });
            }}
          >
            <ImageS3
              accountId={liker.id}
              style={{
                width: 45,
                height: 45,
                borderRadius: 45 / 2,
                borderWidth: 1,
              }}
            ></ImageS3>
          </TouchableOpacity>
          <GText
            style={{
              flexWrap: "wrap",
              flex: 1,
              marginHorizontal: 10,
              alignSelf: "center",
              color: Colors.FG,
            }}
          >
            <GText style={{ fontWeight: "bold" }}>{liker.username}</GText>
            <GText style={{}}>{` liked your post. `}</GText>
            <GText style={{ fontSize: 12, color: "#7D7D7D" }}>
              {moment(activity.created_at).fromNow(true)}
            </GText>
          </GText>

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
  likeElement: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
export default LikeActivity;
