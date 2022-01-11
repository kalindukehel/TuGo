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

const FollowActivity = (props) => {
  const { activity, navigation } = props;
  const { userToken } = useAuthState();
  const [follower, setFollower] = useState(null);

  useEffect(() => {
    async function getLikeStates() {
      const followerRes = await getAccountByIdAPI(
        activity.action_user,
        userToken
      );
      setFollower(followerRes.data);
    }
    getLikeStates();
  }, []);

  return (
    follower && (
      <View style={styles.followElement}>
        <View style={{ flexDirection: "row", alignContent: "center" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.push("Profile", {
                id: follower.id,
              });
            }}
          >
            <ImageS3
              accountId={follower.id}
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
            <GText style={{ fontWeight: "bold" }}>{follower.username}</GText>
            <GText style={{}}>{` started following you. `}</GText>
            <GText style={{ fontSize: 12, color: "#7D7D7D" }}>
              {moment(activity.created_at).fromNow(true)}
            </GText>
          </GText>
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
  followElement: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
export default FollowActivity;
