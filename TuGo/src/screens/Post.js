import React, {useState, useEffect} from "react";
import { Text, View, Image, Dimensions } from "react-native"

var { width, height } = Dimensions.get("window");

const Post = (props) => {
    const { post } = props.route.params;
    console.log(post.soundcloud_art);
    //const { postId } = props.route.params;

    
    return(
        <View>
            <Text>
                This is a Post!   
            </Text>
          <Image
            style={{ width: 200, height: 200 }}
            source={{ uri: post.soundcloud_art }}
          ></Image>
        </View>
    )
}
export default Post;