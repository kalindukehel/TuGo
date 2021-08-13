import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Image,
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
import { API_URL, Colors } from "../../../constants";

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
  const [profileImage, setProfileImage] = useState(API_URL + "/media/default.jpg")

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
    loadsongs();
    return () => {
      isMounted = false;
    };
  }, []);

  const getImage = (albumId) => {
    return `https://api.napster.com/imageserver/v2/albums/${albumId}/images/500x500.jpg`;
  };

  const getArtistImage = (artistId) => {
    return `https://api.napster.com/imageserver/v2/artists/${artistId}/images/500x500.jpg`;
  };

  function checkImageURL(artistId){
    const url = `https://api.napster.com/imageserver/v2/artists/${artistId}/images/500x500.jpg`
    fetch(url)
       .then(res => {
       if(res.status == 404){
         return null
       }else{
         return url
      }
    })
   .catch(err=>{console.log(err)})
   }

  const renderSuggestion = ({ item }) => {
    return (
      <>
        {item.type === "track" && (
          <SearchItem
            index={item.id}
            coverArt={getImage(item.albumId)}
            selected={false}
            selectItem={null}
            artist={item.artistName}
            title={item.name}
            audioLink={item.previewURL}
            postable={true}
            navigation={navigation}
            genre={item.links.genres.ids}
            trackId={item.id}
            artistId={item.artistId}
          />
        )}
        {item.type === "artist" && (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.push("Artist", {
                artist: item.id,
              });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 8,
                marginTop: 12,
                marginBottom: 10
              }}
            >
              <Image  
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 999,
                  alignItems: "center",
                }}
                source={{
                  uri: getArtistImage(item.id)
                }}
              />
              <TextTicker
                style={{
                  marginLeft: 20,
                  color: Colors.text,
                  fontWeight: "bold",
                  height: 25,
                  fontSize: 20
                }}
                duration={7000}
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
                shouldAnimateTreshold={40}
              >
                {item.name.length > 32
                  ? item.name.substring(0, 32 - 3) + "..."
                  : item.name}
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
          <ActivityIndicator size="large" animating={true} color={Colors.FG} />
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
