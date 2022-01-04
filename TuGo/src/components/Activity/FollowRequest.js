import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAuthState } from "../../context/authContext";
import {
  getRequests as getRequestsAPI,
  manageRequest as manageRequestAPI,
  by_ids as by_idsAPI,
} from "../../api";
import { TouchableOpacity } from "react-native-gesture-handler";
import { API_URL, Colors } from "../../../constants";
import GText from "../GText"
import ImageS3 from "../ImageS3";

const styles = StyleSheet.create({
  acceptButton: {
    borderRadius: 5,
    padding: 3,
    width: 70,
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    borderRadius: 5,
    padding: 3,
    width: 70,
    alignItems: "center",
    backgroundColor: "#DCDCDC",
    marginHorizontal: 15,
  },
  acceptButtonText: {
    fontWeight: "bold",
  },
  deleteButtonText: {
    fontWeight: "bold",
  },
  username: { paddingTop: 4, fontWeight: "bold", color: Colors.text },
  name: { paddingTop: 4, color: Colors.text },
  profilePicture: {
    width: 60,
    height: 60,
    alignSelf: "center",
    borderColor: Colors.FG,
    borderWidth: 1,
    borderRadius: 90,
  },
});

const FollowRequest = (props) => {
  const { userId, navigation, getRequests } = props;
  const { userToken } = useAuthState();

  //requester holds the username of the requester
  const [requester, setRequester] = useState();

  useEffect(() => {
    const getRequester = async () => {
      //Make API call to get username and get requester
      const res = (await by_idsAPI([userId], userToken)).data[0];
      setRequester(res);
    };
    getRequester();
  }, []);

  const acceptRequest = async () => {
    //Use manageRequestAPI to confirm the follow request and refetch requests from props getRequests function
    const data = { action: "confirm", requester: userId };
    await manageRequestAPI(data, userToken);
    getRequests();
  };

  const deleteRequest = async () => {
    //Use manageRequestAPI to delete the follow request and refetch requests from props getRequests function
    const data = { action: "delete", requester: userId };
    await manageRequestAPI(data, userToken);
    getRequests();
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        color: Colors.BG,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.push("Profile", {
            id: requester.id,
          });
        }}
        style={{
          marginHorizontal: 15,
        }}
      >
        <ImageS3
          style={styles.profilePicture}
          url={requester.profile_picture}
        />
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.push("Profile", {
              id: requester.id,
            });
          }}
          style={{}}
        >
          <GText style={styles.username}>
            {requester ? requester.username : null}
          </GText>
        </TouchableOpacity>
        <GText style={styles.name}>{requester ? requester.name : null}</GText>
      </View>
      <View style={{ alignItems: "flex-end", flex: 1, alignContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TouchableOpacity onPress={acceptRequest} style={styles.acceptButton}>
            <GText style={styles.acceptButtonText}>Accept</GText>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteRequest} style={styles.deleteButton}>
            <GText style={styles.deleteButtonText}>Delete</GText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default FollowRequest;
