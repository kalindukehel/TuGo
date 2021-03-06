import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import {
  searchUsers as searchUsersAPI,
  getSoundCloudSuggestions as getSoundCloudSuggestionsAPI,
  getSoundCloudSearch as getSoundCloudSearchAPI,
  songSearch as songSearchAPI,
} from "../../api";
import { useAuthState } from "../../context/authContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import SearchItem from "../SearchItem";

const styles = StyleSheet.create({
  activityIndicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});

const SongsTabView = (props) => {
  const { userToken } = useAuthState();
  const { searchQuery, isEditing, handleChange, handleEditing } = props;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadsongs = async () => {
      if (isEditing && searchQuery != "") {
      } else if (searchQuery != "") {
        setLoading(true);
        const res = await songSearchAPI(searchQuery, userToken);
        setResults(res.data);
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

  const renderSuggestion = (suggestion) => {
    console.log(suggestion.item);
    if (isEditing) {
    } else {
      return (
        <SearchItem
          index={suggestion.item.video_id}
          coverArt={suggestion.item.thumbnail.replace("large", "t500x500")}
          selected={false}
          selectItem={null}
          artist={suggestion.item.artist}
          title={suggestion.item.title}
          audioLink={suggestion.item.audio_url}
        />
      );
    }
  };

  return (
    <View style={[{ flex: 1, backgroundColor: "white" }]}>
      {loading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          style={{}}
          data={results}
          renderItem={renderSuggestion}
          ItemSeparatorComponent={ItemSeparatorView}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
        />
      )}
    </View>
  );
};

export default SongsTabView;
