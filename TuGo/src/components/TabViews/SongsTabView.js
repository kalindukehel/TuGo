import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";
import {
  searchUsers as searchUsersAPI,
  getSoundCloudSuggestions as getSoundCloudSuggestionsAPI,
  getSoundCloudSearch as getSoundCloudSearchAPI,
  typeSongAheadSearch as typeSongAheadSearchAPI,
  searchArtist as searchArtistAPI,
  fullTextSearch as fullTextSearchAPI,
} from "../../api";
import { useAuthState } from "../../context/authContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import SearchItem from "../SearchItem";
import TextTicker from "react-native-text-ticker";
import { Colors } from "../../../constants";

const styles = StyleSheet.create({
  activityIndicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});

const SongsTabView = (props) => {
  const { userToken } = useAuthState();
  const {
    searchQuery,
    isEditing,
    handleChange,
    handleEditing,
    navigation,
  } = props;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadsongs = async () => {
      if (isEditing && searchQuery != "") {
        setLoading(true);
        const resArtist = await searchArtistAPI(searchQuery);
        const resTracks = await typeSongAheadSearchAPI(searchQuery);
        setResults([
          ...resArtist.data.search.data.artists,
          ...resTracks.data.search.data.tracks,
        ]);
        setLoading(false);
      } else if (searchQuery != "") {
        setLoading(true);
        //const res = await songSearchAPI(searchQuery, userToken);
        const res = await fullTextSearchAPI(searchQuery);
        const resArray = [
          ...res.data.search.data.artists,
          ...res.data.search.data.albums,
          ...res.data.search.data.tracks,
        ];
        setResults(resArray);
        setLoading(false);
      }
    };
    const loadSuggestions = async () => {
      if (isEditing && searchQuery != "") {
        //If user is still typing, get suggested song names as results
        const tempSuggestions = (
          await getSoundCloudSuggestionsAPI(searchQuery)
        ).data.collection.map((item) => {
          return item.output;
        });
        if (isMounted) setResults(tempSuggestions);
      } else if (searchQuery != "") {
        //If editing is finished and searchQuery is valid, get song items as results
        let response = await getSoundCloudSearchAPI(searchQuery);
        let topData = response.data.collection.slice(
          0,
          response.data.collection.length
        );

        //Function to see if result has required attributes
        const checkValidPost = (item) => {
          if (item.media && item.artwork_url && item.title) {
            if (item.media.transcodings) {
              return true;
            }
          }
          return false;
        };

        //Filter results with filter and keep only valid
        let tempResults = topData.filter((item) => checkValidPost(item));
        if (isMounted) setResults(tempResults);
      }
    };
    loadsongs();
    return () => {
      isMounted = false;
    };
  }, []);

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          alignSelf: "center",
        }}
      />
    );
  };

  const getImage = (albumId) => {
    return `https://api.napster.com/imageserver/v2/albums/${albumId}/images/500x500.jpg`;
  };

  const getArtistImage = (artistId) => {
    return `https://api.napster.com/imageserver/v2/artists/${artistId}/images/500x500.jpg`;
  };

  const renderSuggestion = (item) => {
    const suggestion = item.item;
    return (
      <>
        {suggestion.type === "track" && (
          <SearchItem
            index={suggestion.id}
            coverArt={getImage(suggestion.albumId)}
            selected={false}
            selectItem={null}
            artist={suggestion.artistName}
            title={suggestion.name}
            audioLink={suggestion.previewURL}
          />
        )}
        {suggestion.type === "artist" && (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.push("Artist", {
                artist: suggestion.id,
              });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 8,
                marginTop: 8,
              }}
            >
              <ImageBackground
                imageStyle={{
                  width: 60,
                  height: 60,
                  borderRadius: 999,
                }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 999,
                  alignItems: "center",
                }}
                source={{
                  uri: getArtistImage(suggestion.id),
                }}
              ></ImageBackground>
              <TextTicker
                style={{
                  marginLeft: 20,
                  color: Colors.text,
                  fontWeight: "bold",
                  height: 20,
                }}
                duration={7000}
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
                shouldAnimateTreshold={40}
              >
                {suggestion.name.length > 32
                  ? suggestion.name.substring(0, 32 - 3) + "..."
                  : suggestion.name}
              </TextTicker>
            </View>
          </TouchableWithoutFeedback>
        )}
      </>
    );
  };

  return (
    <View style={[{ flex: 1, backgroundColor: Colors.BG }]}>
      {loading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          keyboardDismissMode="on-drag"
          style={{}}
          data={results}
          renderItem={renderSuggestion}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
        />
      )}
    </View>
  );
};

export default SongsTabView;
