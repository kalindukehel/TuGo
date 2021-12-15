import React, { useState } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useAuthState } from "../context/authContext";
import PostComponent from "../components/PostComponent";
import { Colors } from "../../constants";

const Post = (props) => {
  let tileColor = "#065581";
  const { navigation } = props;
  const { postId, authorId } = props.route.params.params
    ? props.route.params.params //Post ID sent from Push to Post (in Profile)
    : props.route.params; //Post ID sent from PostNavigator
  const { userToken, self } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView scrollEnabled={!disableScroll} contentContainerStyle={{paddingBottom: 10}}>
        <PostComponent
          postId={postId}
          navigation={navigation}
          isSeeking={isSeeking}
          setIsSeeking={setIsSeeking}
          setDisableScroll={setDisableScroll}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  moreButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.complimentText,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "gray",
    alignSelf: "center",
  },
  moreButtonText: {
    alignSelf: "center",
    color: Colors.complimentText,
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
