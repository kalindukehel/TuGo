import React, { useState, useEffect } from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import { searchPosts as searchPostsAPI } from "../../api";
import { useAuthState } from "../../context/authContext";
import AccountTile from "../../components/AccountTile";
import FavoritesTile from "../../components/FavoritesTile";
import { Colors } from "../../../constants";

const PostsTabView = (props) => {
  const { searchQuery, navigation } = props;
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false);
  const { userToken } = useAuthState()

  async function getPosts() {
    const postsRes = await searchPostsAPI(userToken, searchQuery)
    const filteredPosts = postsRes.data
    setPosts(filteredPosts)
  }

  const onRefresh = React.useCallback(() => {
    setLoading(true)
    getPosts()
    setLoading(false)
  },[])

  useEffect(()=>{
    onRefresh()
  },[searchQuery])

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 30,
          alignSelf: "center",
        }}
      />
    );
  };

  const renderItem = ({item}) => {
    return (
      <FavoritesTile
        postId={item.id}
        navigation={navigation}
        isSeeking={isSeeking}
        setIsSeeking={setIsSeeking}
      />
    );
  };

  return (
  <View style={[{ flex: 1, backgroundColor: Colors.BG }]}>
    {loading ?
        <ActivityIndicator
        animating={true}
        size="small"
        color={Colors.FG}
      /> :
      <FlatList
        keyboardDismissMode="interactive"
        scrollEnabled={!isSeeking}
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 10 }}
        ItemSeparatorComponent={ItemSeparatorView}
      />}
  </View>
  )
};

export default PostsTabView;
