import React, {useEffect, useState} from 'react'
import { View, TouchableOpacity, Image, Text, Dimensions, StyleSheet } from 'react-native'
import 
{ getAccountDetails as getAccountDetailsAPI,
changeFollow as changeFollowAPI,
pushNotification as pushNotificationAPI } from "../api"
import { useAuthState } from "../context/authContext"
import { API_URL, Colors } from '../../constants'
import * as Haptics from "expo-haptics";
import GText from "./GText"

let {width, height} = Dimensions.get('window')
const maxlimit = 20;

const FollowTile = ({user, navigation}) => {
    const { userToken, self } = useAuthState();
    const [relation, setRelation] = useState()
    const isSelf = user.id == self.id;
    async function getFollowStatus () {
        const res = await getAccountDetailsAPI(user.id, userToken)
        setRelation(res.data.requested ? 'requested' : res.data.you_follow ? 'true' : 'false')
    }
    useEffect(() => {
        getFollowStatus()
    },[])
    const renderFollowingType = () => {
        if (relation == "true") {
          return "Following";
        } else if (relation == "false") {
          return "Follow";
        } else if (relation == "requested") {
          return "Requested";
        }
    };

    async function changeFollow(id, notification_token) {
        const res = await changeFollowAPI(userToken, id);
        getFollowStatus()
        if (res.status == 201) {
        await pushNotificationAPI(notification_token, {creator: self.username}, "follow");
        } else if (res.status == 202) {
        await pushNotificationAPI(notification_token, {creator: self.username}, "request");
        } else if (res.status == 204) {
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    return (
      <TouchableOpacity
        style={styles.followElement}
        onPress={() => {
          navigation.push("Profile", {
            id: user.id,
          });
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: API_URL + user.profile_picture }}
            style={{
              width: height / 20,
              height: height / 20,
              borderRadius: 999,
              borderWidth: 1,
            }}
          ></Image>
          <View style={{ flexDirection: "column", flex: 1, marginLeft: 10 }}>
            <GText style={{ fontWeight: "bold", color: Colors.text }}>
              {user.username.length > maxlimit
                ? user.username.substring(0, maxlimit - 3) + "..."
                : user.username}
            </GText>
            <GText style={{ color: Colors.text }}>
              {user.username.length > maxlimit
                ? user.name.substring(0, maxlimit - 3) + "..."
                : user.name}
            </GText>
          </View>
          <TouchableOpacity
            style={{
              ...styles.followButton,
              backgroundColor: isSelf
                ? "black"
                : relation === "true"
                ? "#065581"
                : "#DCDCDC",
            }}
            onPress={() =>
              !isSelf
                ? changeFollow(user.id, user.notification_token)
                : navigation.push("Profile", {
                    id: user.id,
                  })
            }
          >
            <GText
              style={{
                ...styles.followButtonText,
                color: isSelf
                  ? "white"
                  : relation === "true"
                  ? "white"
                  : "black",
                fontWeight: "bold",
              }}
            >
              {isSelf ? `View` : renderFollowingType()}
            </GText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    followButton: {
      borderWidth: 1,
      borderRadius: 5,
      borderColor: Colors.complimentText,
      width: 90,
      paddingVertical: 3,
      alignSelf: "center",
    },
    followButtonText: {
      alignSelf: "center",
    },
    followElement: {
      flex: 1,
      padding: 8,
    },
  });

export default FollowTile;