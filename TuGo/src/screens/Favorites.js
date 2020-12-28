import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import { getSavedSongs as getSavedSongsAPI } from "../api";
import { useAuthState } from "../context/authContext";
import SongTile from "../components/SongTile";

var { width, height } = Dimensions.get("window");

const Favorites = ({ navigation }) => {
  const { userToken } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);
  const [songs, setSongs] = useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Saved Songs",
    });
  }, [navigation]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getSongsState() {
      const songsState = await getSavedSongsAPI(userToken);
      console.log(songsState.data);
      setSongs(songsState.data);
    }
    getSongsState();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const renderItem = (component) => {
    const postId = component.item.post;
    console.log(songs);
    let list = songs.map((song) => song.post);
    return <SongTile postId={postId} navigation={navigation} list={list} />;
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ItemSeparatorComponent={ItemSeparatorView}
        extraData={songs}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Favorites;
