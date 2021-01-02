import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { getSoundCloudSearch as getSoundCloudSearchAPI } from "../api";
import { TextInput } from "react-native-gesture-handler";
import PostButton from "../../assets/PostButton.svg";
import SearchItem from "../components/SearchItem";
import { render } from "react-dom";
import { FlatList } from "react-native-gesture-handler";

const CreatePost = ({ navigation }) => {
  const [search, setSearch] = useState();
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState();

  //Update current text state when user types
  const handleChange = (text) => {
    setSearch(text);
  };

  //Function passed into SearchItem as a propr to select that item
  const selectItem = (id) => {
    setSelectedItem(selectedItem == id ? null : id);
  };

  //When user enters their search term, perform search
  const handleSubmit = async () => {
    let response = await getSoundCloudSearchAPI(search);

    let topData = response.data.collection.slice(
      0,
      response.data.collection.length >= 5
        ? 5
        : response.data.collections.length
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
  };

  const renderItem = (item) => {
    let artist;
    //Get name if official publisher metadata exists otherwise get username
    try {
      artist =
        item.item.publisher_metadata.artist != null &&
        item.item.publisher_metadata.artist != ""
          ? item.item.publisher_metadata.artist
          : item.item.user.username;
    } catch {
      artist = item.item.user.username;
    }
    return (
      <SearchItem
        index={item.item.id + "Soundcloud"}
        coverArt={item.item.artwork_url.replace("large", "t500x500")}
        selected={item.item.id + "Soundcloud" == selectedItem}
        selectItem={selectItem}
        artist={artist}
        title={item.item.title}
        audioLink={item.item.media.transcodings[0].url}
      />
    );
  };
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

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ color: "blue" }}>CANCEL</Text>
        </TouchableOpacity>
        <Text>NEXT</Text>
      </View>
      <View style={{ margin: 8 }}>
        <TextInput
          clearButtonMode="always"
          editable={true}
          style={{ ...styles.searchBar }}
          placeholder={"Search"}
          onChangeText={(text) => {
            handleChange(text);
          }}
          onSubmitEditing={handleSubmit}
        />
      </View>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={results}
        keyExtractor={(item, index) => item.id.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={renderItem}
        keyboardDismissMode="on-drag"
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
});

export default CreatePost;
