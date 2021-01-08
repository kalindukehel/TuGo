import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  SafeAreaView,
} from "react-native";
import SearchItem from "../../components/SearchItem";

var { width, height } = Dimensions.get("window");

const CaptionSelection = (props) => {
  const { song } = props.route.params;
  const { navigation } = props;
  const [caption, setCaption] = useState("");

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
          disabled={true}
          onPress={() => {
            navigation.navigate("Video Selection", {
              song: selectedItem,
            });
          }}
        >
          <Text
            style={{
              color: "blue",
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
      <TextInput
        style={{ ...styles.commentBar }}
        placeholder={"Add caption..."}
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
    height: 40,
    paddingLeft: 20,
    margin: 5,
    marginRight: 10,
    borderColor: "gray",
    marginTop: 20,
  },
});

export default CaptionSelection;
