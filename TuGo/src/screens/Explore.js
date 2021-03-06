import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
  Modal,
  Dimensions,
  ImageBackground,
  Button,
} from "react-native";
import { useAuthState } from "../context/authContext";
import { TextInput } from "react-native-gesture-handler";
import PostButton from "../../assets/PostButton.svg";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AccountsTabView from "../components/TabViews/AccountsTabView";
import PostsTabView from "../components/TabViews/PostsTabView";
import SongsTabView from "../components/TabViews/SongsTabView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScrollToTop } from "@react-navigation/native";
import { getExplorePosts as getExplorePostsAPI } from "../api";
import SongBlock from "../components/Explore/SongBlock";
import { AntDesign } from "@expo/vector-icons";

var { width, height } = Dimensions.get("window");

const leftSpacing = 20;

const Explore = ({ navigation }) => {
  const { userToken } = useAuthState();
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [explore, setExplore] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState({});

  //scroll to top
  const video = React.useRef(null);
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getExploreState() {
      const exploreState = await getExplorePostsAPI(userToken);
      setExplore(exploreState.data);
    }
    getExploreState();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

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

  const renderItem = (component) => {
    const postId = component.item.post;
    return <SongBlock postId={postId} navigation={navigation} />;
  };

  const ItemSeparatorComponent = () => <View style={{ width: 10 }} />;

  const ListEmptyComponent = () => {
    return (
      <ImageBackground
        style={{
          width: width,
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          borderRadius: 20,
          backgroundColor: "#DFDFDF",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          No new posts...
        </Text>
      </ImageBackground>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 50,
          marginHorizontal: leftSpacing,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
          }}
          onPress={() => setModalVisible(true)}
        >
          <AntDesign name="search1" size={30} color="black" />
        </TouchableOpacity>
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
            swipeEnabled={index == 2 ? false : true}
          />
        </SafeAreaView>
      </Modal>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Text
            style={{ marginLeft: leftSpacing, fontSize: 35, marginBottom: 20 }}
          >
            Browse
          </Text>
          <FlatList
            ItemSeparatorComponent={ItemSeparatorComponent}
            horizontal={true}
            ref={ref}
            style={{}}
            data={explore}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id.toString()}
            onRefresh={refreshing}
            ListEmptyComponent={ListEmptyComponent}
          />
        </View>
        <Text style={{ marginLeft: leftSpacing, fontSize: 25, marginTop: 20 }}>
          Artists
        </Text>
        <Text style={{ marginLeft: leftSpacing, fontSize: 25, marginTop: 20 }}>
          Charts
        </Text>
      </ScrollView>
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
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
});

export default Explore;
