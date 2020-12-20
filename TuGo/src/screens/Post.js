import React, {useState, useEffect, useRef} from "react";
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
// import Modal from 'react-native-modal';

import {Audio} from "expo-av"
import Axios from "axios";

import {Slider} from 'react-native-elements'
import ImageColors from "react-native-image-colors"

var { width, height } = Dimensions.get("window");


Audio.setAudioModeAsync({playsInSilentModeIOS:true})
const soundObj = new Audio.Sound;
const Post = (props) => {
    let colors = '';
    let tileColor="#065581"
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
    const stateRef = useRef()
    stateRef.current = isSeeking;
    //const { postId } = props.route.params;

    const onRefresh = async () => {
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
          .catch(error = async () =>{
            const searchData = (await Axios.get('https://api-v2.soundcloud.com/search?q=' + postRes.data.soundcloud_search_query +'&variant_ids=&facet=model&user_id=448421-41791-230292-46720&client_id=HpnNV7hjv2C95uvBE55HuKBUOQGzNDQM&limit=20&offset=0&linked_partitioning=1&app_version=1607696603&app_locale=en')
              .then(result=>result.data)).collection[0].media.transcodings[0].url
            const tempSoundUrl = await Axios.get(searchData + '?client_id=HpnNV7hjv2C95uvBE55HuKBUOQGzNDQM')
              .then(result=>result.data.url)
            if(tempSoundUrl){
              setSoundCloudAudioAPI(searchData,userToken,postId)
            }
            return({
              data:{
                url:tempSoundUrl
              }
            })
          })).data.url
        try{
          if(!(await soundObj.getStatusAsync()).isLoaded && sound_url){
            await soundObj.loadAsync({uri:sound_url})
            await soundObj.setProgressUpdateIntervalAsync(1000)
            await soundObj.setOnPlaybackStatusUpdate(async (status)=>{
              if(status.didJustFinish && status.isLoaded){
                setIsPlaying(false)
                setSongPosition(0)
                soundObj.stopAsync()
              }else if(status.isLoaded && stateRef.current!= true){
                setSliderValue(status.positionMillis/status.durationMillis)
              }
            })
        }
        }catch(error){
          console.log(error)
        }
      }
      await getPostStates();
      setRefreshing(false);
    }catch (e){
      console.log(e)
    }
    }
    useEffect(() => {
      onRefresh();
      // async function getColor(){
      //   const img = require(`../../assets/ExploreIcon.png`)
      //   try{colors = await ImageColors.getColors('https://i.imgur.com/O3XSdU7.png', {
      //     fallback: "#228B22",
      //   })}
      //   catch(e){
      //     console.log(e)
      //   }
      //   console.log(colors);
      //   if (colors.platform === "android") {
      //     tileColor = colors.average
      //   } else {
      //     tileColor = colors.background
      //   }
      // }
      // getColor();
      return()=>{ //When component exits
        try{
          soundObj.unloadAsync()
          //setIsPlaying(false)
        }catch(error){
          console.log("Error")
        }
      }
    }, []);

    React.useEffect(() => {
      console.log("ran")
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
      setSliderValue(args)
      const playerStatus = await soundObj.getStatusAsync()
      await soundObj.setStatusAsync({positionMillis:playerStatus.durationMillis*args});
      setIsSeeking(false);
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
              style={{width: width, height: height/9, backgroundColor: tileColor, 
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 20, 
              borderTopRightRadius: 20,
              flexDirection: "row",
              alignItems: "center"}}>
              <ImageModal
                resizeMode="contain"
                imageBackgroundColor="#00000000"
                style={{ width: width/6, height: height/12, margin: 8}}
                source={{
                  uri: post.soundcloud_art,
                }}
              />
              <View
                style={{flexDirection: "column", height: '75%', flex: 1}}>
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
                style={{ marginLeft: '20%', width: "55%", alignSelf: "flex-end", position: "absolute", height: 35}}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#C4C4C4"
                maximumTrackTintColor="white"
                onSlidingStart={seekSliding}
                onSlidingComplete={seekComplete}
                thumbStyle={{width:15,height:15}}
                thumbTintColor="#C4C4C4"
                value={sliderValue}
                disabled={refreshing?true:false}
              />
              <TouchableOpacity disabled={refreshing?true:false} onPress={doPlay} style={{marginLeft:"auto", marginRight:10}} >
                {/* <Text style={{fontWeight:"bold"}}>{isPlaying?"pause":"play"}</Text> */}
                {isPlaying ? <Pause width={40} height={35} style={{marginTop: '30%'}}/> : <Play width={40} height={45} style={{marginTop: '30%'}} /> }
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
                  <Text>{comments ? `${comments.length}` : `loading`}</Text>
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