import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  SafeAreaView,
  Image,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import SearchItem from "../../components/SearchItem";
import VideoTile from "../../components/VideoTile";
import {
  createPost as createPostAPI,
  getSongLyrics as getSongLyricsAPI,
} from "../../api";
import { useAuthState } from "../../context/authContext";
import { Colors, appTheme, Length } from "../../../constants";
import { Video } from "expo-av";
import { usePlayerState, usePlayerDispatch } from "../../context/playerContext";

var { width, height } = Dimensions.get("window");

const CaptionSelection = (props) => {
  const { song, customVideos } = props.route.params;
  let { danceChoreos, voiceCovers } = props.route.params;
  danceChoreos = danceChoreos.map((id) => ({
    is_youtube: true,
    video_id: id,
  }));
  voiceCovers = voiceCovers.map((id) => ({
    is_youtube: true,
    video_id: id,
  }));
  const choreosAndCovers = [...danceChoreos, ...voiceCovers, ...customVideos];
  const { navigation } = props;
  const { userToken } = useAuthState();
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState({});
  const videosRef = useRef([]);
  const playerDispatch = usePlayerDispatch();

  const renderTile = ({ item }) => {
    if (item.isCustom) {
      return (
        <View style={{ marginHorizontal: 10 }}>
          <Video
            ref={videosRef.current[item.uri]}
            style={styles.video}
            source={{ uri: item.uri }} // Can be a URL or a local file.
            useNativeControls
            resizeMode="contain"
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          ></Video>
        </View>
      );
    } else {
      return (
        <View style={{ margin: (width - (3 * width) / 3.4) / 8 }}>
          <VideoTile videoId={item.video_id} />
        </View>
      );
    }
  };

  // useEffect(() => {
  //   async function getLyrics() {
  //     const lyricsRes = await getSongLyricsAPI(song.)
  //   }
  // },[])

  const makePost = async () => {
    //Call createPostAPI to create a new post
    try{
      await createPostAPI(caption, song, choreosAndCovers, userToken);
    }
    catch(e){
      errorDispatch({type: 'REPORT_ERROR', message: "Something went wrong, could not create post"})
    }
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
          <Text style={{ color: Colors.close }}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            playerDispatch({ type: "UNLOAD_PLAYER" });
            makePost();
            navigation.pop();
            navigation.pop();
            navigation.navigate("Explore");
          }}
        >
          <Text
            style={{
              color: Colors.close,
            }}
          >
            POST
          </Text>
        </TouchableOpacity>
      </View>
      <SearchItem
        index={song.id}
        coverArt={song.coverArt.replace("large", "t500x500")}
        artist={song.artist}
        title={song.title}
        audioLink={song.audioLink}
      />
      {choreosAndCovers.length != 0 && (
        <FlatList
          scrollEnabled={false}
          data={choreosAndCovers}
          renderItem={renderTile}
          keyExtractor={(item, index) => index.toString()}
          style={{
            maxHeight: 200,
            marginTop: 15,
          }}
          numColumns={3}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
          }}
        />
      )}
      <TextInput
        maxLength={Length.caption}
        keyboardAppearance={appTheme}
        style={{ ...styles.commentBar }}
        placeholder={"Add caption..."}
        placeholderTextColor={Colors.text}
        multiline={true}
        onChangeText={(value) => {
          setCaption(value);
        }}
        value={caption}
      />
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
    borderColor: "gray",
    backgroundColor: "#E8E8E8",
    width: "100%",
  },
  commentBar: {
    borderRadius: 10,
    color: Colors.text,
    borderRadius: 10,
    height: 60,
    paddingLeft: 10,
    paddingTop: 10,
    margin: 10,
    textAlignVertical: "top",
    marginRight: 10,
    borderColor: Colors.FG,
    borderWidth: 1,
    marginTop: 20,
  },
  video: {
    alignSelf: "center",
    width: 300,
    height: 200,
    borderColor: Colors.FG,
    borderWidth: 1,
    borderRadius: 20,
  },
});

export default CaptionSelection;
