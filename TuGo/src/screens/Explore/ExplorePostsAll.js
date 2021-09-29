import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { useAuthState } from "../../context/authContext";
import { Colors } from "../../../constants";
import SongBlock from "../../components/Explore/SongBlock";

//api
import { getExplorePosts as getExplorePostsAPI } from "../../api";
import { Dimensions } from "react-native";

let {width, height} = Dimensions.get('window')

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
      <View style={{height: width/2, width: width/2, }}>
        <SongBlock postId={item.post} navigation={navigation} columns={2} blockHeight={160} blockWidth={160}/>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{ flexGrow: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
        }}
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
