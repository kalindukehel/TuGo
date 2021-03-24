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
import { getSimilarArtists as getSimilarArtistsAPI } from "../../api";
import ArtistBlock from "../../components/Explore/ArtistBlock";
import { Colors } from "../../../constants";

var { width, height } = Dimensions.get("window");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const RelatedArtists = (props) => {
  const { navigation } = props;
  const { artistId } = props.route.params;
  const [similarArtists, setSimilarArtists] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = React.useRef();

  const animatedValue = useRef(new Animated.Value(0)).current;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getAlbums() {
      const res = await getSimilarArtistsAPI(artistId);
      const artists = res.data.artists.map((artist) => {
        return {
          artistId: artist.id,
          name: artist.name,
        };
      });
      setSimilarArtists(artists);
    }
    getAlbums();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  let translateY = animatedValue.interpolate({
    inputRange: [0, 220],
    outputRange: [0, -220],
    extrapolate: "clamp",
  });

  const toTop = () => {
    // use current
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const getArtistImage = (artistId) => {
    return `https://api.napster.com/imageserver/v2/artists/${artistId}/images/500x500.jpg`;
  };

  const renderAlbum = (item) => {
    console.log(item);
    return (
      <ArtistBlock
        artist={item.item.name}
        navigation={navigation}
        image={getArtistImage(item.item.artistId)}
        id={item.item.artistId}
        similarArtist={true}
      />
    );
  };

  return (
    similarArtists && (
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={flatListRef}
          style={{ flexGrow: 1 }}
          ItemSeparatorComponent={() => <View style={{ margin: 30 }}></View>}
          contentContainerStyle={{
            width: width,
            alignItems: "center",
            paddingVertical: 10,
          }}
          data={similarArtists}
          renderItem={renderAlbum}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          numColumns={2}
        />
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
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
  chartNameView: {
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#E8E8E8",
    padding: 10,
    marginTop: 70,
  },
});

export default RelatedArtists;
