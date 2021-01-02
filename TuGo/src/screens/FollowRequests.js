import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthState } from "../context/authContext";
import {
  getRequests as getRequestsAPI,
  getAccountById as getAccountByIdAPI,
  getAccountById,
} from "../api";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FollowRequest from "../components/Activity/FollowRequest";

const FollowRequests = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const { userToken } = useAuthState();

  const getRequests = async () => {
    //Get follow requests from API and store it in requests state
    const res = await getRequestsAPI(userToken);
    setRequests(res.data);
  };

  useEffect(() => {
    getRequests();
  }, []);

  const renderItem = (request) => {
    //Render FollowRequest item for flatlist, send in userId variable and getRequests function
    return (
      <FollowRequest
        userId={request.item.requester}
        navigation={navigation}
        getRequests={getRequests}
      />
    );
  };

  return (
    <View style={{ height: 100 }}>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default FollowRequests;
