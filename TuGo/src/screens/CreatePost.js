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
import { TextInput } from "react-native-gesture-handler";
import axios from "axios";
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
    let response = await axios.get(
      "https://api-v2.soundcloud.com/search?q=" +
        search +
        "&sc_a_id=f29946ad3d328a8dc178d3d0f95e5722d672a7cd&variant_ids=&facet=model&user_id=638900-381327-695255-95876&client_id=HpnNV7hjv2C95uvBE55HuKBUOQGzNDQM&limit=20&offset=0&linked_partitioning=1&app_version=1609333331&app_locale=en"
    );

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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
          keyboardDismissMode={"on-drag"}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
