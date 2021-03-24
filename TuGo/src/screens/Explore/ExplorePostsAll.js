import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { useAuthState } from "../../context/authContext";
import { Colors } from "../../../constants";
import SongBlock from "../../components/Explore/SongBlock";

//api
import { getExplorePosts as getExplorePostsAPI } from "../../api";

const ExplorePostsAll = (props) => {
  const { navigation } = props;
  const { userToken } = useAuthState();
  const [explorePosts, setExplorePosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const onRefresh = useCallback(() => {
    setLoading(true);
    async function getExplorePosts() {
      const exploreState = await getExplorePostsAPI(userToken);
      setExplorePosts(exploreState.data);
    }
    getExplorePosts();
    setLoading(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={{}}>
        <SongBlock postId={item.post} navigation={navigation} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{}}
        data={explorePosts}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id.toString()}
        onRefresh={loading}
        numColumns={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
});

export default ExplorePostsAll;
