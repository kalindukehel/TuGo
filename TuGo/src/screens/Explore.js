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
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AccountsTabView from "../components/TabViews/AccountsTabView";
import PostsTabView from "../components/TabViews/PostsTabView";
import SongsTabView from "../components/TabViews/SongsTabView";
import { SafeAreaView } from "react-native-safe-area-context";

const Explore = ({ navigation }) => {
  const { userToken } = useAuthState();
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

  useEffect(() => {
    //If modal is dismissed, set search value to ""
    if (modalVisible == false) {
      setSearch("");
    }
  }, [modalVisible]);

  const handleChange = (text) => {
    setSearch(text);
  };

  const handleEditing = (status) => {
    setIsEditing(status);
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

  //Tab Views
  const FirstRoute = () => {
    if (index == 0) {
      return (
        <AccountsTabView
          setModalVisible={setModalVisible}
          searchQuery={search}
          navigation={navigation}
        />
      );
    } else {
      return <View></View>;
    }
  };
  const SecondRoute = () => {
    if (index == 1) {
      return <PostsTabView searchQuery={search} navigation={navigation} />;
    } else {
      return <View></View>;
    }
  };

  const ThirdRoute = () => {
    if (index == 2) {
      return (
        <SongsTabView
          searchQuery={search}
          navigation={navigation}
          isEditing={isEditing}
          handleEditing={handleEditing}
          handleChange={handleChange}
        />
      );
    } else {
      return <View></View>;
    }
  };

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
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 8,
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
          <SafeAreaView style={styles.containertwo}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: 10,
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
                value={search}
                onChangeText={(text) => {
                  if (!isEditing) {
                    handleEditing(true);
                  }
                  handleChange(text);
                }}
                onSubmitEditing={() => {
                  handleEditing(false);
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
          </SafeAreaView>
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
    </SafeAreaView>
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
    backgroundColor: "#065581",
    borderRadius: 10,
    color: "white",
  },
  containertwo: { flex: 1, flexDirection: "column" },
  scene: {
    flex: 1,
  },
});

export default Explore;
