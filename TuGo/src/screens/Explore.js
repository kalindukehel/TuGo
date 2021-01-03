import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Dimensions,
} from "react-native";
import { useAuthState } from "../context/authContext";
import { TextInput } from "react-native-gesture-handler";
import PostButton from "../../assets/PostButton.svg";
import { searchUsers as searchUsersAPI } from "../api";
import AccountTile from "../components/AccountTile";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const Explore = ({ navigation }) => {
  const { userToken } = useAuthState();
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

  useEffect(() => {
    const handleSubmit = async () => {
      //check if searched text is not empty
      if (search) {
        const searchRes = await searchUsersAPI(search, userToken);
        setAccounts(searchRes.data);
      } else {
        setAccounts(null);
      }
    };
    handleSubmit();
  }, [search]);

  const handleChange = (text) => {
    setSearch(text);
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
    return (
      <AccountTile
        account={account}
        navigation={navigation}
        setModalVisible={setModalVisible}
      />
    );
  };

  //Tab Views
  const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: "white" }]}>
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ flexGrow: 1 }}
        data={accounts}
        keyExtractor={(item, index) => item.id.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={renderItem}
        keyboardDismissMode={"on-drag"}
      />
    </View>
  );

  const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: "white" }]} />
  );

  const ThirdRoute = () => (
    <View style={[styles.scene, { backgroundColor: "white" }]} />
  );

  const initialLayout = { width: Dimensions.get("window").width };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Accounts" },
    { key: "second", title: "Posts" },
    { key: "third", title: "Songs" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "black" }}
      style={{ backgroundColor: "white" }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: "black" }}>{route.title}</Text>
      )}
    />
  );

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
        <TouchableOpacity
          style={{
            ...styles.searchBar,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "gray" }}>Search</Text>
        </TouchableOpacity>

        {/* Search results modal */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View
            style={{
              marginTop: 50,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 10,
              height: Expo.Constants.statusBarHeight,
            }}
          >
            <TextInput
              clearButtonMode="always"
              editable={true}
              autoFocus={true}
              autoCorrect={false}
              autoCapitalize="none"
              style={{ ...styles.searchBar }}
              placeholder={"Search"}
              onChangeText={(text) => {
                handleChange(text);
              }}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
          />
        </Modal>

        <TouchableOpacity
          style={{}}
          onPress={() => {
            setModalVisible(false);
            navigation.push("New Post");
          }}
        >
          <PostButton width={40} height={35} style={{}} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
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
  scene: {
    flex: 1,
  },
});

export default Explore;
