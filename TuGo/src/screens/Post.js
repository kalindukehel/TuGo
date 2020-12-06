import React, {useState, useEffect} from "react";
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
} from "../api";
import { useAuthState } from "../context/authContext";
import { API_URL } from "../../constants";

import Like from "../../assets/LikeButton.svg"
import DMButton from "../../assets/DMButton.svg"
import CommentsButton from "../../assets/CommentsButton.svg"

import moment from "moment";
import ImageModal from 'react-native-image-modal';
import * as Haptics from 'expo-haptics';

var { width, height } = Dimensions.get("window");

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const Post = (props) => {
    const { navigation } = props;
    const { postId, authorId } = props.route.params;
    const { userToken, self } = useAuthState();
    const [refreshing, setRefreshing] = useState(false);
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(null);
    const [comments, setComments] = useState(null);
    const [tiles, setTiles] = useState(null);
    const [author, setAuthor] = useState(null);
    const [maxlimit, setMaxlimit] = useState(6);
    //const { postId } = props.route.params;

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      async function getPostStates() {
        const postRes = await getPostByIdAPI(userToken, postId);
        setPost(postRes.data);
        const likesRes = await getPostLikesAPI(userToken, postId);
        setLikes(likesRes.data);
        const commentsRes = await getPostCommentsAPI(userToken, postId);
        setComments(commentsRes.data);
        const authorRes = await getAccountByIdAPI(authorId, userToken);
        setAuthor(authorRes.data);
        const tilesRes = await getPostTilesAPI(userToken, postId);
        setTiles(tilesRes.data);
      }
      getPostStates();
      wait(500).then(() => setRefreshing(false));
    }, []);
    useEffect(() => {
      onRefresh();
    }, []);


    async function getLikesStates() {
      const likesRes = await getPostLikesAPI(userToken, postId);
      setLikes(likesRes.data);
    }

    async function likePost(){
      const likeRes = await likePostAPI(userToken, postId);
      getLikesStates();
    }

    return( 
      post && author &&
      <View
        style={{flex: 1, backgroundColor: "white"}}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10, alignItems: "center", marginHorizontal: 10}}>
            <TouchableOpacity
              onPress={()=>{
                navigation.navigate("Profile", {
                  id: author.id,
                });
              }}>
              <View
                style={{flexDirection: "row", alignItems: "center"}}>
                <Image
                  source={{ uri: author ? author.profile_picture : API_URL + "/media/default.jpg" }}
                  style={{width:30, height: 30, borderRadius: 20, marginRight: 5}}
                ></Image>
                <Text
                  style={{fontWeight: "bold", color: "gray"}}>
                  {author ? author.username : ""}
                </Text>
              </View>
            </TouchableOpacity>
            <Text
                style={{color: "gray"}}>
                {post ? moment(post.created_at).fromNow() : ""}
              </Text>
          </View>
          <View
            style={{flexDirection: "row",
            alignItems: "center"}}>
            <View
              style={{width: width, height: height/9, backgroundColor: "#065581", 
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 20, 
              borderTopRightRadius: 20,
              flexDirection: "row",
              alignItems: "center"}}>
              <ImageModal
                resizeMode="contain"
                imageBackgroundColor="#00000000"
                style={{ width: width/6, height: height/12, margin: 8 }}
                source={{
                  uri: post.soundcloud_art,
                }}
              />
              <View
                style={{flexDirection: "column"}}>
                <Text
                  style={{color: "white"}}>
                  {post.song_artist}
                </Text>
                <Text
                  style={{color: "white", fontWeight: "bold"}}>
                  {post.song_name}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{flexDirection: "row", justifyContent: "space-between", margin: 10}}>
            <TouchableOpacity
              style={{alignSelf: "center"}}
              onPress={()=>{
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                likePost();
              }}>
              <View
                style={{flexDirection: "row", alignItems: "center"}}>
                  <Like width={40} height={35} fill="red"/>
                  <Text>{likes ? likes.length : `loading`}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);}}>
              <Text
                style={styles.moreButtonText}>
                More
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: "center"}}
              onPress={()=>{
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if(maxlimit == 6) setMaxlimit(100);
                if(maxlimit == 100) setMaxlimit(6);
              }}>
              <DMButton width={40} height={35}/>
            </TouchableOpacity>
          </View>
          <View
            style={{flexDirection: "row", marginHorizontal: 20, marginVertical: 10}}>
            <Text
              style={{fontWeight: "bold"}}>
                {author.username + `: `}
            </Text>
            <Text>{ ((post.caption).length > maxlimit) ? 
                (((post.caption).substring(0,maxlimit-3)) + '...') : 
                post.caption }
            </Text> 
          </View>
          <TouchableOpacity
              style={{marginLeft: 10, marginTop: 5}}
              onPress={()=>{Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);}}>
              <View
                style={{flexDirection: "row", alignItems: "center"}}>
                  <CommentsButton width={40} height={35} fill="#0ff"/>
                  <Text>{comments ? comments.length : `loading`}</Text>
              </View>
            </TouchableOpacity>
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
});

export default Post;