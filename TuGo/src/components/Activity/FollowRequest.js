import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthState } from "../../context/authContext";
import {
  getRequests as getRequestsAPI,
  getAccountById as getAccountByIdAPI,
  manageRequest as manageRequestAPI,
} from "../../api";
import { TouchableOpacity } from "react-native-gesture-handler";
const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "black",
    marginHorizontal: 10,
  },
});

const FollowRequest = (props) => {
  const { userId, navigation } = props;
  const { userToken } = useAuthState();

  //requester holds the username of the requester
  const [requester, setRequester] = useState();

  useEffect(() => {
    const getRequester = async () => {
      //Make API call to get username and set requester
      const res = await getAccountByIdAPI(userId, userToken);
      setRequester(res.data.username);
    };
    getRequester();
  }, []);

  const acceptRequest = async () => {
    //Use manageRequestAPI to confirm the follow request and refetch requests from props getRequests function
    const data = { action: "confirm", requester: userId };
    await manageRequestAPI(data, userToken);
    props.getRequests();
  };

  const deleteRequest = async () => {
    //Use manageRequestAPI to delete the follow request and refetch requests from props getRequests function
    const data = { action: "delete", requester: userId };
    await manageRequestAPI(data, userToken);
    props.getRequests();
  };

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <Text>{requester ? requester : null}</Text>
      <TouchableOpacity onPress={acceptRequest} style={styles.button}>
        <Text>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteRequest} style={styles.button}>
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};
export default FollowRequest;
