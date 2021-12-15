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
  TextInput,
} from "react-native";

import {
  getExplorePosts as getExplorePostsAPI,
  artistSongsTop as artistSongsTopAPI,
  getArtistInfo as getArtistInfoAPI,
  artistSongs as artistSongsAPI,
} from "../../api";
import { useAuthState } from "../../context/authContext";

//Components
import SearchItem from "../../components/SearchItem";
import Player from "../../components/Player";
import { TouchableHighlight } from "react-native-gesture-handler";
import { API_URL, Colors, appTheme } from "../../../constants";
import GText from "../../components/GText"

import styles from './commonStyles'

var { width, height } = Dimensions.get("window");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Artist = (props) => {
  const { navigation } = props;
  const { artist } = props.route.params;
  const { userToken } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);
  const [artistSongs, setArtistSongs] = useState(null);
  const flatListRef = React.useRef();
  const searchBarRef = React.useRef();
  const [artistDetails, setArtistDetails] = useState("");
  const [disableScroll, setDisableScroll] = useState(false);
  const [profileImage, setProfileImage] = useState(API_URL + "/media/default.jpg")

  //filter search
  const [filteredData, setFilteredData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState("");
  const [searchBarWidth, setSearchBarWidth] = useState(
    new Animated.Value(width * 0.5)
  );

  const animatedValue = useRef(new Animated.Value(0)).current;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getSongList() {
      const infoRes = await getArtistInfoAPI(artist);
      setArtistDetails(infoRes.data.artists[0]);
      let res = await artistSongsTopAPI(artist);
      if (res.data.tracks.length < 10) {
        res = await artistSongsAPI(artist);
      }
      setArtistSongs(res.data.tracks);
      setFilteredData(res.data.tracks);
      setMasterData(res.data.tracks);
    }
    function checkImageURL(artistId){
      const url = `https://api.napster.com/imageserver/v2/artists/${artistId}/images/500x500.jpg`
      fetch(url)
         .then(res => {
         if(res.status == 404){
           if(masterData.length > 0) setProfileImage(getImage(masterData[0].albumId))
         }else{
           setProfileImage(`https://api.napster.com/imageserver/v2/artists/${artistId}/images/500x500.jpg`)
        }
      })
     .catch(err=>{console.log(err)})
    }
    getSongList();
    checkImageURL(artist);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const toTop = () => {
    // use current
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const scrollToTextInput = () => {
    flatListRef.current.scrollToOffset({
      animated: true,
      offset: searchBarRef.current,
    });
  };

  let translateY = animatedValue.interpolate({
    inputRange: [0, 220],
    outputRange: [0, -220],
    extrapolate: "clamp",
  });

  const searchAnimationInactive = () => {
    Animated.timing(searchBarWidth, {
      toValue: width * 0.5,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const searchAnimationActive = () => {
    Animated.timing(searchBarWidth, {
      toValue: width * 0.8,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const getImage = (albumId) => {
    return `https://api.napster.com/imageserver/v2/albums/${albumId}/images/500x500.jpg`;
  };

  const getArtistImage = (artistId) => {
    return `https://api.napster.com/imageserver/v2/artists/${artistId}/images/500x500.jpg`;
  };

  const renderSuggestion = ({ item }) => {
    return (
      <SearchItem
        index={item.id}
        coverArt={getImage(item.albumId)}
        artist={item.artistName}
        title={item.name}
        audioLink={item.previewURL}
        artistId={item.artistId}
        postable={true}
        navigation={navigation}
        genre={item.links.genres.ids}
        trackId={item.id}
        setDisableScroll={setDisableScroll}
      />
    );
  };

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const usernameData = item.name
          ? item.name.toUpperCase()
          : "".toUpperCase();
        const nameData = item.artistName
          ? item.artistName.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return (
          usernameData.indexOf(textData) > -1 || nameData.indexOf(textData) > -1
        );
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterData
      setFilteredData(masterData);
      setSearch(text);
    }
  };
  console
  return (
    filteredData && (
      <SafeAreaView style={styles.container}>
        <AnimatedFlatList
          scrollEnabled={!disableScroll}
          keyboardDismissMode="interactive"
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
          data={filteredData}
          renderItem={renderSuggestion}
          keyExtractor={(item, index) => {
            return item.id;
          }}
        />
        <Animated.View
          style={[artistStyles.artistHeader, { transform: [{ translateY }] }]}
        >
          <View style={artistStyles.artistImageView}>
            <Image
              style={{
                height: 140,
                width: 140,
                borderRadius: 40,
              }}
              source={{ uri: profileImage}}
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
                  });
                }}
              >
                <View style={styles.buttonView}>
                  <GText style={styles.button}>Related Artists</GText>
                </View>
              </TouchableWithoutFeedback>
              {artistDetails.bios &&
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.push("ArtistInfo", {
                    artistId: artist,
                  });
                }}
              >
                <View style={styles.buttonView}>
                  <GText style={styles.button}>Info</GText>
                </View>
              </TouchableWithoutFeedback>
              }
            </View>
          </View>
          <Animated.View
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              searchBarRef.current = layout.y;
            }}
            style={{
              ...styles.textInputViewStyle,
              width: searchBarWidth,
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <TextInput
              keyboardAppearance={appTheme}
              onChangeText={(text) => {
                scrollToTextInput();
                searchFilterFunction(text);
              }}
              style={styles.textInputStyle}
              defaultValue={search}
              placeholder="Search Top Songs..."
              placeholderTextColor={"white"}
              clearButtonMode="always"
              onFocus={() => {
                scrollToTextInput();
                searchAnimationActive();
              }}
              onBlur={searchAnimationInactive}
            />
          </Animated.View>
          {artistDetails.name &&
          <TouchableWithoutFeedback onPress={toTop}>
            <View style={artistStyles.artistNameView}>
              <GText style={artistStyles.artistName}>{artistDetails.name.length > styles.maxlimit 
              ? artistDetails.name.substring(0, styles.maxlimit - 3) + `...` 
              : artistDetails.name}</GText>
            </View>
          </TouchableWithoutFeedback>}
        </Animated.View>
      </SafeAreaView>
    )
  );
};

const artistStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.BG,
//   },
  artistImageView: {
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
  artistHeader: {
    height: 220,
    position: "absolute",
    width: width,
    flex: 1,
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 50,
  },
  artistName: {
    fontWeight: "bold",
  },
  artistNameView: {
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#E8E8E8",
    padding: 10,
    marginTop: 30,
  },
//   button: {
//     textAlign: "center",
//     width: 120,
//     paddingVertical: 5,
//     color: Colors.text
//   },
//   textInputStyle: {
//     height: 30,
//     borderRadius: 7,
//     borderColor: "black",
//     borderWidth: 1,
//     marginHorizontal: 20,
//     marginTop: 20,
//     width: "50%",
//     backgroundColor: Colors.contrastGray,
//   },
//   buttonView: {
//     borderRadius: 7, 
//     backgroundColor: Colors.contrastGray
//   }
});

export default Artist;
