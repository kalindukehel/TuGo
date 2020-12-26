import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  processColor
} from "react-native";
import {
  getPostById as getPostByIdAPI,
  getPostLikes as getPostLikesAPI,
  getPostComments as getPostCommentsAPI,
  getAccountById as getAccountByIdAPI,
  getPostTiles as getPostTilesAPI,
  likePost as likePostAPI,
  setSoundCloudAudio as setSoundCloudAudioAPI,
} from "../api";
import { useAuthState } from "../context/authContext";
import { API_URL } from "../../constants";

import Like from "../../assets/LikeButton.svg"
import Play from "../../assets/PlayButton.svg"
import Pause from "../../assets/PauseButton.svg"
import DMButton from "../../assets/DMButton.svg"
import CommentsButton from "../../assets/CommentsButton.svg"

import moment from "moment";
import ImageModal from 'react-native-image-modal';
import * as Haptics from 'expo-haptics';


import { Audio } from "expo-av"
import Axios from "axios";

import { Slider } from 'react-native-elements'
import PostComponent from "../components/PostComponent"

var { width, height } = Dimensions.get("window");

const Post = (props) => {
  let tileColor = "#065581"
  const { navigation } = props;
  const { postId, authorId } = props.route.params;
  const { userToken, self } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);

  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   <PostComponent postId={postId} authorId={authorId} navigation={navigation} />
  //   setRefreshing(false);
  // }

  return (
    <View
      style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={styles.scrollView}

      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
      >
        <PostComponent postId={postId} authorId={authorId} navigation={navigation} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  moreButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "gray",
    alignSelf: "center"
  },
  moreButtonText: {
    alignSelf: "center",
    color: "white"
  },
  imageViewNotPlaying: {
    marginLeft: 8,
  },
  imageViewPlaying: {
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  image: {
    width: 60,
    height: 60,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default Post;