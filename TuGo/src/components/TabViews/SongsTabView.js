import React, { useState, useEffect } from "react";
import { FlatList, View, Modal } from "react-native";
import { searchUsers as searchUsersAPI } from "../../api";
import { useAuthState } from "../../context/authContext";
import AccountTile from "../../components/AccountTile";

const SongsTabView = (props) => {
  const { searchQuery } = props;
  console.log(searchQuery);
  return <View style={[{ flex: 1, backgroundColor: "white" }]}></View>;
};

export default SongsTabView;
