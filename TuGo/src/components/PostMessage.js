import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import moment from "moment";
import { useAuthState } from "../context/authContext";
import { Colors, API_URL } from "../../constants";
import {
  getPostById as getPostByIdAPI,
  getAccountById as getAccountByIdAPI,
} from "../api";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import GText from "./GText"

const PostMessage = ({ message, navigation }) => {
  const { userToken, self } = useAuthState();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null)
  const [loadingPost, setLoadingPost] = useState(false);
  const [author, setAuthor] = useState(null);
  const [isViewable, setIsViewable] = useState(false)

  useEffect(() => {
    setLoadingPost(true);
    async function getPost() {
      try{
      const postRes = await getPostByIdAPI(userToken, message.content);
      if (postRes.data.isViewable !== false) setIsViewable(true)
      setPost(postRes.data);
      const authorRes = await getAccountByIdAPI(postRes.data.author, userToken);
      setAuthor(authorRes.data);
      }
      catch(e){
        setError('Post has been Deleted.')
      }
    }
    getPost();
    setLoadingPost(false);
  }, []);
  const isMyMessage = () => {
    return message.user.id == self.id;
  };
  return (
    <View
      style={{
        ...styles.container,
        justifyContent: isMyMessage() ? "flex-end" : "flex-start",
      }}
    >
      {!isMyMessage() && (            
        <TouchableWithoutFeedback
          onPress={()=>{
            navigation.push("Profile", {
              id: author.id,
            });
          }}
        >
          <Image
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              marginRight: 10,
            }}
            source={{ uri: API_URL + message.user.imageUri }}
          />
        </TouchableWithoutFeedback>
      )}
      <View
        style={[
          styles.messageBox,
          {
            marginLeft: isMyMessage() ? 200 : 0,
            marginRight: isMyMessage() ? 0 : 200,
          },
        ]}
      >
        {post && author ? (
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 5,
                height: 40,
              }}
            >
              <Image
                source={{ uri: author.profile_picture }}
                style={{ borderRadius: 999, height: 25, width: 25 }}
              />
              <GText style={{ color: Colors.text, marginLeft: 10 }}>
                {author.username}
              </GText>
            </View>
            <TouchableWithoutFeedback
              disabled={!isViewable}
              onPress={() => {
                navigation.push("Post", {
                  screen: "Post",
                  params: {
                    postId: post.id,
                    authorId: post.author,
                  },
                });
              }}
            >
              <View 
                style={{
                  ...styles.image,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isViewable ? 
                <Image style={styles.image} source={{ uri: post.album_cover }} /> : 
                <View 
                style={styles.errorView}>
                  <GText style={{color: Colors.text, fontSize: 12}}>Post is private, follow to see.</GText>
                </View>}
              </View>
            </TouchableWithoutFeedback>
            {/* <GText style={styles.time}>{moment(message.createdAt).fromNow()}</GText> */}
          </View>
        ) : error ? (
          <View 
            style={styles.errorView}>
            <GText style={{color: Colors.text, fontSize: 12}}>{error}</GText>
          </View>
        ) : (
          <View style={{ height: 190, width: 150, justifyContent: 'center' }}>
            <ActivityIndicator
              animating={true}
              size="small"
              color={Colors.FG}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageBox: {
    borderRadius: 20,
  },
  name: {
    color: Colors.text,
    fontWeight: "bold",
    marginBottom: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  time: {
    alignSelf: "flex-end",
    color: "grey",
  },
  errorView: {
    height: 150, 
    width: 150, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, 
    backgroundColor: Colors.contrastGray
  }
});

export default PostMessage;
