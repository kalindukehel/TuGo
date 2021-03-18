import React, { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { searchUsers as searchUsersAPI } from "../../api";
import { useAuthState } from "../../context/authContext";
import AccountTile from "../../components/AccountTile";

const AccountsTabView = (props) => {
  const { searchQuery, navigation } = props;
  const [accounts, setAccounts] = useState([]);
  const { userToken } = useAuthState();
  useEffect(() => {
    const getAccounts = async () => {
      //check if searched text is not empty
      if (searchQuery) {
        const searchRes = await searchUsersAPI(searchQuery, userToken);
        setAccounts(searchRes.data);
      } else {
        setAccounts([]);
      }
    };
    getAccounts();
  }, []);

  const renderItem = (item) => {
    let account = item.item;
    return <AccountTile account={account} navigation={navigation} />;
  };

  return (
    <View style={[{ flex: 1, backgroundColor: "white" }]}>
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

export default AccountsTabView;
