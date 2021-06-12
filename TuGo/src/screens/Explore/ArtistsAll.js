import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { useAuthState } from "../../context/authContext";
import { Colors } from "../../../constants";
import ArtistBlock from "../../components/Explore/ArtistBlock";

//api
import { topArtists as topArtistsAPI } from "../../api";

const ArtistsAll = (props) => {
  const { navigation } = props;
  const { userToken } = useAuthState();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setLoading(true);
    async function getArtists() {
      const artistsRes = await topArtistsAPI();
      const filteredArtists = artistsRes.data.artists.map((artist) => {
        return {
          name: artist.name,
          id: artist.id,
          image:
            "https://api.napster.com/imageserver/v2/artists/" +
            artist.id +
            "/images/230x153.jpg",
        };
      });
      setArtists(filteredArtists);
    }
    getArtists();
    setLoading(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const renderArtist = ({ item, index }) => {
    return (
      <ArtistBlock
        artist={item.name}
        navigation={navigation}
        image={item.image}
        id={item.id}
        index={index + 1}
        columns={3}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 20,
        }}
        data={artists}
        renderItem={renderArtist}
        keyExtractor={(item, index) => item.id.toString()}
        onRefresh={loading}
        numColumns={2}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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

export default ArtistsAll;
