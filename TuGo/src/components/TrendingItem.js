import React, { useState, useEffect } from "react";
import {
    Image,
    View,
    StyleSheet
  } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
  import {
    getPostById as getPostByIdAPI
  } from '../api'
import { useAuthState } from "../context/authContext";

const TrendingItem = (props) => {
    const { postId, navigation } = props
    const {userToken} = useAuthState()
    const [post, setPost] = useState(null)
    useEffect(()=>{
        async function getPost() {
            const postRes = await getPostByIdAPI(userToken, postId)
            setPost(postRes.data)
        }
        getPost()
    },[])
    return (
        post &&
        <View style={styles.containerView}>
            <Image style={styles.image} source={{uri: post.album_cover}}/>     
        </View>
    )

}

export default TrendingItem

const styles = StyleSheet.create({
    containerView: {
        height: 75, 
        width: 75, 
        borderRadius: 999, 
        borderWidth: 2, 
        borderColor: Colors.primary, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    image: {
        height: 65, 
        width: 65, 
        borderRadius: 999
    }
  });