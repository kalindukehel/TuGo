import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  Dimensions,
} from "react-native";
import {
  getPostById as getPostByIdAPI,
} from "../api";
import { useAuthState } from "../context/authContext";
import { API_URL } from "../../constants";
import SvgUri from 'react-native-svg-uri';
import Like from "../../assets/LikeButton.svg"
import SvgIcon from 'react-native-svg-icon';
import Svg, {
  Use,
  Image,
} from 'react-native-svg';

var { width, height } = Dimensions.get("window");

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const Post = (props) => {
    const { postId } = props.route.params;
    const { userToken, self } = useAuthState();
    const [refreshing, setRefreshing] = useState(false);
    const [post, setPost] = useState(null);
    //const { postId } = props.route.params;

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      async function getPostStates() {
        const postRes = await getPostByIdAPI(userToken, postId);
        setPost(postRes.data);
      }
      getPostStates();
      wait(1000).then(() => setRefreshing(false));
    }, []);
    useEffect(() => {
      onRefresh();
    }, []);
    const TestSvgUri = () => (
      <View>
        <Text>
          This is a Post
        </Text>
      </View>
    );
    return(
      TestSvgUri()
    )
}
export default Post;