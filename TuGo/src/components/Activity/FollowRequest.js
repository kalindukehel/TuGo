import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAuthState } from "../../context/authContext";
import {
  getRequests as getRequestsAPI,
  manageRequest as manageRequestAPI,
  by_ids as by_idsAPI,
} from "../../api";
import { TouchableOpacity } from "react-native-gesture-handler";
import { API_URL } from "../../../constants";
const styles = StyleSheet.create({
  acceptButton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
    width: 70,
    alignItems: "center",
    borderColor: "black",
    backgroundColor: "#065581",
    marginHorizontal: 20,
    marginBottom: 40,
  },
  deleteButton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
    width: 70,
    alignItems: "center",
    borderColor: "black",
    backgroundColor: "#DCDCDC",
    marginHorizontal: 10,
    marginBottom: 40,
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButtonText: { color: "black", fontWeight: "bold" },
  username: { paddingTop: 4, fontWeight: "bold" },
  name: { paddingTop: 4 },
  profilePicture: {
    width: 60,
    height: 60,
    alignSelf: "center",
    borderColor: "black",
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
        paddingTop: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.push("Profile", {
            id: requester.id,
          });
        }}
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 100,
        }}
      >
        <Image
          style={styles.profilePicture}
          source={
            requester
              ? { uri: API_URL + requester.profile_picture }
              : { uri: API_URL + "/media/default.jpg" }
          }
        />
        <Text style={styles.username}>
          {requester ? requester.username : null}
        </Text>
        <Text style={styles.name}>{requester ? requester.name : null}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={acceptRequest} style={styles.acceptButton}>
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteRequest} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};
export default FollowRequest;
