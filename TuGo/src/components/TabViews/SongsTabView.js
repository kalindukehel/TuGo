import React, { useState, useEffect } from "react";
import { FlatList, View, Modal, Text } from "react-native";
import {
  searchUsers as searchUsersAPI,
  getSoundCloudSuggestions as getSoundCloudSuggestionsAPI,
  getSoundCloudSearch as getSoundCloudSearchAPI,
} from "../../api";
import { useAuthState } from "../../context/authContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import SearchItem from "../SearchItem";

const SongsTabView = (props) => {
  const { searchQuery, isEditing, handleChange, handleEditing } = props;
  const [results, setResults] = useState([]);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (isEditing && searchQuery != "") {
        //If user is still typing, get suggested song names as results
        const tempSuggestions = (
          await getSoundCloudSuggestionsAPI(searchQuery)
        ).data.collection.map((item) => {
          return item.output;
        });

        setResults(tempSuggestions);
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
        setResults(tempResults);
      }
    };
    loadSuggestions();
  }, []);

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 15,
          alignSelf: "center",
        }}
      />
    );
  };

  const renderSuggestion = (suggestion) => {
    if (isEditing) {
      //If user is still typing, render suggested items
      return (
        <TouchableOpacity
          onPress={() => {
            handleChange(suggestion.item);
            handleEditing(false);
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {suggestion.item}
          </Text>
        </TouchableOpacity>
      );
    } else {
      //If user is finished typing, render song items
      let artist;
      //Get name if official publisher metadata exists otherwise get username
      try {
        artist =
          suggestion.item.publisher_metadata.artist != null &&
          suggestion.item.publisher_metadata.artist != ""
            ? suggestion.item.publisher_metadata.artist
            : suggestion.item.user.username;
      } catch {
        artist = suggestion.item.user.username;
      }
      return (
        <SearchItem
          index={suggestion.item.id + "Soundcloud"}
          coverArt={suggestion.item.artwork_url.replace("large", "t500x500")}
          selected={false}
          selectItem={null}
          artist={artist}
          title={suggestion.item.title}
          audioLink={suggestion.item.media.transcodings[0].url}
        />
      );
    }
  };

  return (
    <View style={[{ flex: 1, backgroundColor: "white" }]}>
      <FlatList
        style={{}}
        data={results}
        renderItem={renderSuggestion}
        ItemSeparatorComponent={ItemSeparatorView}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
      />
    </View>
  );
};

export default SongsTabView;
