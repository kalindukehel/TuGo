import React, { useEffect, useState } from "react";
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
import { createPost as createPostAPI } from "../../api";
import { useAuthState } from "../../context/authContext";

var { width, height } = Dimensions.get("window");

const CaptionSelection = (props) => {
  const { song, danceChoreos, voiceCovers } = props.route.params;
  const choreosAndCovers = [...danceChoreos, ...voiceCovers];
  const { navigation } = props;
  const { userToken } = useAuthState();
  const [caption, setCaption] = useState("");

  const renderTile = (tile) => {
    const videoId = tile.item;
    return <VideoTile videoId={videoId} />;
  };

  const makePost = () => {
    //Call createPostAPI to create a new post
    createPostAPI(caption, song, danceChoreos, userToken);
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
          disabled={caption == ""}
          onPress={() => {
            makePost();
            navigation.navigate("Explore");
          }}
        >
          <Text
            style={{
              color: caption == "" ? "grey" : "blue",
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
          data={choreosAndCovers}
          renderItem={renderTile}
          keyExtractor={(item, index) => index.toString()}
          style={{
            maxHeight: 170,
            marginTop: 15,
          }}
          horizontal={true}
        />
      )}
      <TextInput
        style={{ ...styles.commentBar }}
        placeholder={"Add caption..."}
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
  commentBar: {
    borderRadius: 10,
    color: "black",
    borderRadius: 10,
    height: 60,
    paddingLeft: 10,
    paddingTop: 10,
    margin: 10,
    textAlignVertical: "top",
    marginRight: 10,
    backgroundColor: "#E8E8E8",
    borderColor: "gray",
    marginTop: 20,
  },
});

export default CaptionSelection;
