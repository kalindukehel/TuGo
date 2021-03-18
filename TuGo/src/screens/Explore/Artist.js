import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Text,
  FlatList,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

import {
  getExplorePosts as getExplorePostsAPI,
  artistSongs as artistSongsAPI,
} from "../../api";
import { useAuthState } from "../../context/authContext";

//Components
import SearchItem from "../../components/SearchItem";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Colors } from "../../../constants";

var { width, height } = Dimensions.get("window");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Artist = (props) => {
  const { navigation } = props;
  const { artist } = props.route.params;
  const { userToken } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);
  const [artistSongs, setArtistSongs] = useState(null);
  const flatListRef = React.useRef();

  const animatedValue = useRef(new Animated.Value(0)).current;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getSongList() {
      const res = await artistSongsAPI(artist);
      setArtistSongs(res.data.tracks);
    }
    getSongList();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const toTop = () => {
    // use current
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  let translateY = animatedValue.interpolate({
    inputRange: [0, 220],
    outputRange: [0, -220],
    extrapolate: "clamp",
  });

  const getImage = (albumId) => {
    return `https://api.napster.com/imageserver/v2/albums/${albumId}/images/500x500.jpg`;
  };

  const getArtistImage = (artistId) => {
    return `https://api.napster.com/imageserver/v2/artists/${artistId}/images/500x500.jpg`;
  };

  const renderSuggestion = (suggestion) => {
    return (
      <SearchItem
        index={suggestion.item.id}
        coverArt={getImage(suggestion.item.albumId)}
        selected={false}
        selectItem={null}
        artist={suggestion.item.artistName}
        title={suggestion.item.name}
        audioLink={suggestion.item.previewURL}
      />
    );
  };

  return (
    artistSongs && (
      <SafeAreaView style={styles.container}>
        <AnimatedFlatList
          ref={flatListRef}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ marginTop: 270, paddingBottom: 270 }}
          scrollEventThrottle={16} // <-- Use 1 here to make sure no events are ever missed
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: animatedValue } },
              },
            ],
            { useNativeDriver: true } // <-- Add this
          )}
          data={artistSongs}
          renderItem={renderSuggestion}
          keyExtractor={(item, index) => {
            return item.id;
          }}
        />
        <Animated.View
          style={[styles.chartHeader, { transform: [{ translateY }] }]}
        >
          <View style={styles.chartImageView}>
            <Image
              style={{ height: 150, width: 150, borderRadius: 40 }}
              source={{ uri: getArtistImage(artist) }}
            />
            <View
              style={{
                justifyContent: "space-around",
                height: 100,
                flex: 1,
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.push("Related Artists", {
                    artistId: artist,
                    name: artistSongs[0].artistName,
                  });
                }}
              >
                <Text style={styles.button}>Related Artists</Text>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.push("ArtistInfo", {
                    artistId: artist,
                  });
                }}
              >
                <Text style={styles.button}>Info</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={toTop}>
            <View style={styles.chartNameView}>
              <Text style={styles.chartName}>{artistSongs[0].artistName}</Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  chartImageView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  chartHeader: {
    height: 220,
    position: "absolute",
    width: width,
    flex: 1,
    backgroundColor: "#E3FBFF",
    borderBottomRightRadius: 50,
  },
  chartName: {
    fontWeight: "bold",
  },
  chartNameView: {
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#E8E8E8",
    padding: 10,
    marginTop: 70,
  },
  button: {
    borderColor: "black",
    borderWidth: 1,
    textAlign: "center",
    width: 120,
    borderRadius: 5,
    paddingVertical: 5,
  },
});

export default Artist;
