import React, { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import {
  searchUsers as searchUsersAPI,
  getAccounts as getAccountsAPI,
} from "../../api";
import { useAuthState } from "../../context/authContext";
import ContactListItem from "../../components/ContactListItem";
import { Colors } from "../../../constants";

import { listUsers } from "../../graphql/queries";
import { graphqlOperation, API } from "aws-amplify";

const ContactList = (props) => {
  const { searchQuery, navigation } = props;
  const [accounts, setAccounts] = useState([]);
  const { userToken, self } = useAuthState();

  useEffect(() => {
    const fetchUsers = async () => {
      //get users from aws database
      try {
        const allUsersData = await API.graphql(graphqlOperation(listUsers));
        const filteredUsers = allUsersData.data.listUsers.items.filter(
          (user) => user.id != self.id
        );
        setAccounts(filteredUsers);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => {
    return <ContactListItem account={item} navigation={navigation} />;
  };

  return (
    <View style={[{ flex: 1, backgroundColor: Colors.BG }]}>
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ flexGrow: 1 }}
        data={accounts}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={renderItem}
        keyboardDismissMode={"on-drag"}
      />
    </View>
  );
};

export default ContactList;
