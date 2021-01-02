import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useAuthState } from "../context/authContext";
import { TextInput } from "react-native-gesture-handler";
import PostButton from "../../assets/PostButton.svg";
import { searchUsers as searchUsersAPI } from "../api";
import AccountTile from "../components/AccountTile";

const Explore = ({ navigation }) => {
  const { userToken } = useAuthState();
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState(null);

  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

  const handleSubmit = async () => {
    //check if searched text is not empty
    if (search) {
      const searchRes = await searchUsersAPI(search, userToken);
      setAccounts(searchRes.data);
    }
  };

  const handleChange = (text) => {
    setSearch(text);
    handleSubmit();
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 2,
          width: "90%",
          backgroundColor: "#C8C8C8",
          alignSelf: "center",
        }}
      />
    );
  };

  const renderItem = (item) => {
    let account = item.item;
    console.log(account);
    return <AccountTile account={account} navigation={navigation} />;
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: 8,
        }}
      >
        <TextInput
          clearButtonMode="always"
          editable={true}
          style={{ ...styles.searchBar }}
          placeholder={"Search"}
          onChangeText={(text) => {
            console.log("hi");
            handleChange(text);
          }}
          onSubmitEditing={handleSubmit}
        />

        <TouchableOpacity
          style={{}}
          onPress={() => {
            navigation.push("New Post");
          }}
        >
          <PostButton width={40} height={35} style={{}} />
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={accounts}
        keyExtractor={(item, index) => item.id.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={renderItem}
        keyboardDismissMode={"on-drag"}
      />
    </View>
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
    width: "85%",
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "gray",
    backgroundColor: "#065581",
    borderRadius: 10,
    color: "white",
    flex: 1,
  },
});

export default Explore;
