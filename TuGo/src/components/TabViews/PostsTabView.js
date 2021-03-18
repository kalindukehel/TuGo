import React, { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { searchUsers as searchUsersAPI } from "../../api";
import { useAuthState } from "../../context/authContext";
import AccountTile from "../../components/AccountTile";
import { Colors } from "../../../constants";

const PostsTabView = (props) => {
  const { searchQuery } = props;
  return <View style={[{ flex: 1, backgroundColor: Colors.BG }]}></View>;
};

export default PostsTabView;
