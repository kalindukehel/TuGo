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
import { Colors, appTheme } from "../../../constants";
import { usePlayerState, usePlayerDispatch } from "../../context/playerContext";
import GText from "../../components/GText"

const CreatePost = ({ navigation }) => {
  const [search, setSearch] = useState();
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);
  const playerDispatch = usePlayerDispatch();
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
    trackId,
    artistId
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
        artistId: null,
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
        artistId: artistId,
      });
    }
  };

  //When user enters their search term, perform search
  const handleResults = async (search) => {
    if (search != "") {
      setLoading(true);
      let response = await typeSongAheadSearchAPI(search);
      const filteredSongs = response.data.search.data.tracks.map((song) => {
        return {
          albumId: song.albumId,
          trackId: song.id,
          song_name: song.name,
          song_artist: song.artistName,
          audioLink: song.previewURL,
          genres: song.links.genres.ids,
          artist_id: song.artistId,
        };
      });
      setResults(filteredSongs);
      setLoading(false);
    } else {
      setResults([]);
    }
  };

  const getImage = (albumId) => {
    return `https://api.napster.com/imageserver/v2/albums/${albumId}/images/500x500.jpg`;
  };

  const renderItem = ({ item }) => {
    return (
      <SearchItem
        index={item.trackId}
        coverArt={getImage(item.albumId)}
        selected={item.trackId == selectedItem.id}
        selectItem={selectItem}
        artist={item.song_artist}
        title={item.song_name}
        audioLink={item.audioLink}
        genre={item.genres}
        trackId={item.trackId}
        artistId={item.artist_id}
        setDisableScroll={setDisableScroll}
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
          <GText style={{ color: Colors.close }}>CANCEL</GText>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={
            Object.keys(selectedItem).length === 0 || !selectedItem.audioLink
          }
          onPress={() => {
            playerDispatch({ type: "UNLOAD_PLAYER" });
            navigation.navigate("Video Selection", {
              song: selectedItem,
            });
          }}
        >
          <GText
            style={{
              color:
                Object.keys(selectedItem).length === 0 ||
                !selectedItem.audioLink
                  ? "gray"
                  : Colors.close,
            }}
          >
            NEXT
          </GText>
        </TouchableOpacity>
      </View>
      <View style={{ margin: 8 }}>
        <TextInput
          keyboardAppearance={appTheme}
          autoCorrect={false}
          clearButtonMode="always"
          editable={true}
          style={{ ...styles.searchBar }}
          placeholder={"Search"}
          placeholderTextColor={Colors.FG}
          onChangeText={handleResults}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="small" animating={true} color={Colors.FG} />
      ) : (
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={results}
          keyExtractor={(item, index) => item.trackId.toString()}
          renderItem={renderItem}
          keyboardDismissMode="on-drag"
          scrollEnabled={!disableScroll}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  searchBar: {
    borderRadius: 10,
    color: Colors.text,
    borderRadius: 10,
    height: 40,
    paddingLeft: 20,
    marginRight: 10,
    color: Colors.text,
    borderColor: Colors.FG,
    borderWidth: 1,
    width: "100%",
  },
});

export default CreatePost;
