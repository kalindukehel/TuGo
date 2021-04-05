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
import FavoritesTile from "../components/FavoritesTile";
import { Colors } from "../../constants";

var { width, height } = Dimensions.get("window");

const Favorites = ({ navigation }) => {
  const { userToken } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);
  const [songs, setSongs] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Saved Songs",
    });
  }, [navigation]);

  async function getSongsState() {
    const songsState = await getSavedSongsAPI(userToken);
    setSongs(songsState.data);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getSongsState();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const renderItem = (component) => {
    const postId = component.item.post;
    return (
      <FavoritesTile
        postId={postId}
        navigation={navigation}
        isSeeking={isSeeking}
        setIsSeeking={setIsSeeking}
      />
    );
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
        scrollEnabled={!isSeeking}
        data={songs}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.FG}
          />
        }
        contentContainerStyle={{ paddingTop: 10 }}
        ItemSeparatorComponent={ItemSeparatorView}
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

export default Favorites;
