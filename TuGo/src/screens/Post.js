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
// import Modal from 'react-native-modal';

import {Audio} from "expo-av"
import Axios from "axios";

import {Slider} from 'react-native-elements'

var { width, height } = Dimensions.get("window");

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

Audio.setAudioModeAsync({playsInSilentModeIOS:true})
const soundObj = new Audio.Sound;
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
    const [maxlimit, setMaxlimit] = useState(95);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songPosition,setSongPosition] = useState(0);
    const [isSeeking,setIsSeeking] = useState(false);
    const [sliderValue,setSliderValue] = useState(0)
    //const { postId } = props.route.params;

    const onRefresh = React.useCallback(async () => {
      try{
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

        const sound_url = (await Axios.get(postRes.data.soundcloud_audio + '?client_id=HpnNV7hjv2C95uvBE55HuKBUOQGzNDQM')
          .then((result)=>result)
          .catch(error =>{
            console.log(error)
          })).data.url
        try{
          if(!(await soundObj.getStatusAsync()).isLoaded){
            await soundObj.loadAsync({uri:sound_url})
            await soundObj.setProgressUpdateIntervalAsync(1000)
            await soundObj.setOnPlaybackStatusUpdate(async (status)=>{
              if(status.didJustFinish){
                setIsPlaying(false)
                setSongPosition(0)
                soundObj.stopAsync()
              }else{
                setSongPosition(status.positionMillis/status.durationMillis)
              }
            })
        }
        }catch(error){
          console.log(error)
        }
      }
      await getPostStates();
      setRefreshing(false);
    }catch{
      console.log("Flag 1")
    }
    }, []);
    useEffect(() => {
      return()=>{ //When component exits
        try{
          soundObj.unloadAsync()
        }catch(error){
          console.log("Error")
        }
      }
    }, []);

    useEffect(() => {
      !isSeeking && songPosition && setSliderValue(songPosition)
    },[songPosition])

    React.useEffect(() => {
      const unsubscribe = navigation.addListener('focus', async () => {
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
      });
    
      return unsubscribe;
    }, [navigation]);


    async function getLikesStates() {
      const likesRes = await getPostLikesAPI(userToken, postId);
      setLikes(likesRes.data);
    }

    async function likePost(){
      const likeRes = await likePostAPI(userToken, postId);
      getLikesStates();
    }

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
    
    async function doPlay(){
      try {
        if (isPlaying) {
          await soundObj.pauseAsync();
        } else {
          await soundObj.playAsync();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.log(error)
      }
    }

    async function seekSliding(){
      setIsSeeking(true);
    }

    async function seekComplete(args){
      setIsSeeking(false);
      await soundObj.setStatusAsync({positionMillis:(await soundObj.getStatusAsync()).durationMillis*args});
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
                isPlaying && doPlay() //if sound is playing toggle it off when going to a profile
                navigation.push("Profile", {
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
              <Slider
                style={{ marginLeft:10, width: "35%", height: 40}}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#FFFFFF"
                onSlidingStart={seekSliding}
                onSlidingComplete={seekComplete}
                thumbStyle={{width:15,height:15}}
                thumbTintColor="white"
                value={sliderValue}
                disabled={refreshing?true:false}
              />
              <TouchableOpacity disabled={refreshing?true:false} onPress={doPlay} style={{marginLeft:"auto",paddingRight:20}} >
                <Text style={{fontWeight:"bold"}}>{isPlaying?"pause":"play"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{flexDirection: "row", justifyContent: "space-between", margin: 10}}>
            <View
              style={{flexDirection: "row"}}>
              <TouchableOpacity
                style={{alignSelf: "center"}}
                onPress={()=>{
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  likePost();
                }}>
                <View
                  style={{flexDirection: "row", alignItems: "center"}}>
                    <Like width={40} height={35} fill="red"/>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{alignSelf: "center"}}
                onPress={()=>{
                  navigation.push("Likes", {
                    postId: post.id,
                  });
                }}>
                <Text>{likes ? likes.length == 1 ? likes.length + ` like` : likes.length + ` likes` : `loading`}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleModal();
              }}>
              <Text
                style={styles.moreButtonText}>
                More
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: "center"}}
              onPress={()=>{
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if(maxlimit == 95) setMaxlimit(10000);
                if(maxlimit == 10000) setMaxlimit(95);
              }}>
              <DMButton width={40} height={35}/>
            </TouchableOpacity>
          </View>
          <View
            style={{flexDirection: "row", marginHorizontal: 20, marginVertical: 10}}>
            <Text
              style={{flexWrap: "wrap"}}>
              <Text
                style={{fontWeight: "bold"}}>
                  {author.username + `: ` }
              </Text>
              <Text
                style={{}}>{ ((post.caption).length > maxlimit) ? 
                  (((post.caption).substring(0,maxlimit-3)) + '...') : 
                  post.caption }
              </Text> 
            </Text>
          </View>
          <TouchableOpacity
              style={{marginLeft: 10, marginTop: 5}}
              onPress={()=>{
                navigation.push("Comments", {
                  postId: post.id,
                  authorId: authorId
                });
              }}>
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