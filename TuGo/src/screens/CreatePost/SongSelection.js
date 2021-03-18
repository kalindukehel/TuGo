import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import {
  fullTextSongSearch as fullTextSongSearchAPI,
  typeSongAheadSearch as typeSongAheadSearchAPI,
} from "../../api";
import { TextInput } from "react-native-gesture-handler";
import PostButton from "../../../assets/PostButton.svg";
import SearchItem from "../../components/SearchItem";
import { render } from "react-dom";
import { FlatList } from "react-native-gesture-handler";

const CreatePost = ({ navigation }) => {
  const [search, setSearch] = useState();
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [loading, setLoading] = useState(false);

  //Update current text state when user types
  const handleChange = (text) => {
    setSearch(text);
    handleResults(text);
  };

  //Function passed into SearchItem as a propr to select that item
  const selectItem = (
    id,
    artist,
    audioLink,
    title,
    coverArt,
    genre,
    trackId
  ) => {
    //If item is already selected, deselect it
    if (selectedItem.id == id) {
      setSelectedItem({
        ...selectedItem,
        id: null,
        artist: null,
        audioLink: null,
        title: null,
        coverArt: null,
        genre: "",
        trackId: null,
      });
    } else {
      //If different item or no item is selected, then set item as selected
      setSelectedItem({
        ...selectedItem,
        id: id,
        artist: artist,
        audioLink: audioLink,
        title: title,
        coverArt: coverArt,
        genre: genre,
        trackId: trackId,
      });
    }
  };

  //When user enters their search term, perform search
  const handleResults = async (text) => {
    setLoading(true);
    let response = await typeSongAheadSearchAPI(text);
    const filteredSongs = response.data.search.data.tracks.map((song) => {
      return {
        albumId: song.albumId,
        trackId: song.id,
        song_name: song.name,
        song_artist: song.artistName,
        audioLink: song.previewURL,
        genres: song.links.genres.ids,
      };
    });
    setResults(filteredSongs);
    setLoading(false);
  };

  const getImage = (albumId) => {
    return `https://api.napster.com/imageserver/v2/albums/${albumId}/images/500x500.jpg`;
  };

  const renderItem = (item) => {
    const suggestion = item.item;
    return (
      <SearchItem
        index={suggestion.trackId}
        coverArt={getImage(suggestion.albumId)}
        selected={suggestion.trackId == selectedItem.id}
        selectItem={selectItem}
        artist={suggestion.song_artist}
        title={suggestion.song_name}
        audioLink={suggestion.audioLink}
        genre={suggestion.genres}
        trackId={suggestion.trackId}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 15,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ color: "blue" }}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={
            Object.keys(selectedItem).length === 0 || !selectedItem.audioLink
          }
          onPress={() => {
            navigation.navigate("Video Selection", {
              song: selectedItem,
            });
          }}
        >
          <Text
            style={{
              color:
                Object.keys(selectedItem).length === 0 ||
                !selectedItem.audioLink
                  ? "gray"
                  : "blue",
            }}
          >
            NEXT
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ margin: 8 }}>
        <TextInput
          autoCorrect={false}
          clearButtonMode="always"
          editable={true}
          style={{ ...styles.searchBar }}
          placeholder={"Search"}
          onChangeText={(text) => {
            handleChange(text);
          }}
        />
      </View>
      {loading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={results}
          keyExtractor={(item, index) => item.trackId.toString()}
          renderItem={renderItem}
          keyboardDismissMode="on-drag"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchBar: {
    borderRadius: 10,
    color: "black",
    borderRadius: 10,
    height: 40,
    paddingLeft: 20,
    marginRight: 10,
    borderColor: "gray",
    backgroundColor: "#E8E8E8",
    width: "100%",
  },
});

export default CreatePost;
