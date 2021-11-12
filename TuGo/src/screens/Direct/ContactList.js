import React, { useState, useEffect } from "react";
import { FlatList, View, TextInput, StyleSheet } from "react-native";
import {
  viewableUsers as viewableUsersAPI,
} from "../../api";
import { useAuthState } from "../../context/authContext";
import ContactListItem from "../../components/ContactListItem";
import { Colors, appTheme } from "../../../constants";

import { listUsers } from "../../graphql/queries";
import { graphqlOperation, API } from "aws-amplify";

const ContactList = (props) => {
  const { searchQuery, navigation } = props;
  const [accounts, setAccounts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState("");
  const { userToken, self } = useAuthState();

  useEffect(() => {
    const fetchUsers = async () => {
      //get users from aws database
      try {
        const allUsersData = await viewableUsersAPI(userToken)
        const filteredList = allUsersData.data.filter(item => item.id !== self.id)
        setAccounts(filteredList);
        setFilteredData(filteredList);
        setMasterData(filteredList);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => {
    return <ContactListItem account={item} navigation={navigation} />;
  };

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const usernameData = item.username
          ? item.username.toUpperCase()
          : "".toUpperCase();
        const nameData = item.name ? item.name.toUpperCase() : "".toUpperCase();
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

  return (
    <View style={styles.container}>
      <TextInput
        keyboardAppearance={appTheme}
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        placeholder="Search"
        placeholderTextColor={Colors.text}
        clearButtonMode="always"
      />
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ flexGrow: 1 }}
        data={filteredData}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={renderItem}
        keyboardDismissMode={"on-drag"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  textInputStyle: {
    marginTop: 10,
    height: 40,
    paddingLeft: 20,
    borderRadius: 20,
    color: Colors.text,
    borderColor: Colors.FG,
    borderWidth: 1,
  },
})

export default ContactList;
