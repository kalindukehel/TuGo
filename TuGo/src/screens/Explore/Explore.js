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
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useAuthState } from "../../context/authContext";
import { TextInput } from "react-native-gesture-handler";
import PostButton from "../../../assets/PostButton.svg";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AccountsTabView from "../../components/TabViews/AccountsTabView";
import PostsTabView from "../../components/TabViews/PostsTabView";
import SongsTabView from "../../components/TabViews/SongsTabView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScrollToTop } from "@react-navigation/native";
import {
  getExplorePosts as getExplorePostsAPI,
  topArtists as topArtistsAPI,
  artistImage as artistImageAPI,
} from "../../api";
import SongBlock from "../../components/Explore/SongBlock";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, appTheme } from "../../../constants";
import { Feather } from "@expo/vector-icons";

//Components
import ChartBlock from "../../components/Explore/ChartBlock";
import ArtistBlock from "../../components/Explore/ArtistBlock";

var { width, height } = Dimensions.get("window");

const leftSpacing = 20;

const Explore = ({ navigation }) => {
  const { userToken } = useAuthState();
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [explore, setExplore] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [topArtists, setTopArtists] = useState(null);
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("");

  const insets = useSafeAreaInsets();

  //scroll to top
  let player = React.useRef(null);
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getExploreState() {
      setIsLoading(true);
      const exploreState = await getExplorePostsAPI(userToken);
      const topArtistsRes = await topArtistsAPI();
      setIsLoading(false);
      const filteredArtists = topArtistsRes.data.artists.map((artist) => {
        return {
          name: artist.name,
          id: artist.id,
          image:
            "https://api.napster.com/imageserver/v2/artists/" +
            artist.id +
            "/images/230x153.jpg",
        };
      });
      setTopArtists(filteredArtists);
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
    if (mode != "search") {
      setSearch("");
    }
  }, [mode]);

  const handleChange = (text) => {
    setSearch(text);
  };

  const handleEditing = (status) => {
    setIsEditing(status);
  };

  //Tab Views
  const FirstRoute = () => {
    if (index == 0) {
      return <AccountsTabView searchQuery={search} navigation={navigation} />;
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
      indicatorStyle={{ backgroundColor: Colors.FG }}
      style={{ backgroundColor: Colors.BG }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: Colors.text }}>{route.title}</Text>
      )}
    />
  );

  const renderItem = (component) => {
    const postId = component.item.post;
    return (
      <View style={{ height: 200 }}>
        <SongBlock postId={postId} navigation={navigation} />
      </View>
    );
  };

  const ItemSeparatorComponent = () => <View style={{ width: 10 }} />;

  const ListEmptyComponent = () => {
    return !isLoading ? (
      <ImageBackground
        style={{
          width: width - 40,
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
    ) : (
      <View
        style={{
          height: 200,
          justifyContent: "center",
          width: width - 40,
        }}
      >
        <ActivityIndicator animating={true} size="large" color={Colors.FG} />
      </View>
    );
  };

  const renderArtist = ({ item, index }) => {
    return (
      <View style={{ height: 200 }}>
        <ArtistBlock
          artist={item.name}
          navigation={navigation}
          image={item.image}
          id={item.id}
          index={index + 1}
        />
      </View>
    );
  };

  const ListEmptyComponentArtist = () => {
    return (
      isLoading && (
        <View
          style={{
            height: 200,
            justifyContent: "center",
            width: width - 40,
          }}
        >
          <ActivityIndicator animating={true} size="large" color={Colors.FG} />
        </View>
      )
    );
  };

  return (
    <View style={{ ...styles.container, paddingTop: insets.top }}>
      {mode != "search" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: leftSpacing,
            paddingBottom: 10,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
            }}
            onPress={() => setMode("search")}
          >
            <AntDesign name="search1" size={30} color={Colors.FG} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{}}
            onPress={() => {
              navigation.push("New Post");
            }}
          >
            <Feather name="plus-square" size={35} color={Colors.FG} />
          </TouchableOpacity>
        </View>
      )}
      {mode === "search" && (
        <View style={styles.containertwo}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 10,
            }}
          >
            <TextInput
              keyboardAppearance={appTheme}
              clearButtonMode="always"
              editable={true}
              autoFocus={true}
              autoCorrect={false}
              autoCapitalize="none"
              style={{ ...styles.searchBar }}
              placeholder={"Search"}
              placeholderTextColor={Colors.text}
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
            <TouchableOpacity onPress={() => setMode("")}>
              <Text style={{ color: Colors.text }}>Cancel</Text>
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
        </View>
      )}
      {mode != "search" && (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.FG}
            />
          }
        >
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: leftSpacing,
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 10,
            }}
          >
            <Text
              style={{
                fontSize: 35,
                color: Colors.FG,
              }}
            >
              Browse
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.push("Explore Posts");
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                }}
              >
                <Octicons name="chevron-right" size={24} color={Colors.FG} />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
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
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: leftSpacing,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 25, color: Colors.FG }}>Artists</Text>
            <TouchableWithoutFeedback>
              <Octicons name="chevron-right" size={24} color={Colors.FG} />
            </TouchableWithoutFeedback>
          </View>

          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
            ItemSeparatorComponent={ItemSeparatorComponent}
            data={topArtists}
            horizontal={true}
            renderItem={renderArtist}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={ListEmptyComponentArtist}
          />
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: leftSpacing,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 25, color: Colors.FG }}>Charts</Text>
            <TouchableWithoutFeedback>
              <Octicons name="chevron-right" size={24} color={Colors.FG} />
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingTop: 20,
            }}
          >
            <ChartBlock
              navigation={navigation}
              id={"pp.180234724"}
              text={"Trending HipHop"}
              image={"http://i.imgur.com/DbUle6M.png"}
            />
            <ChartBlock
              navigation={navigation}
              id={"pp.214725454"}
              text={"Trending Pop"}
              image={"https://ichef.bbci.co.uk/images/ic/1200x675/p09310ng.jpg"}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <ChartBlock
              navigation={navigation}
              id={"pp.225974698"}
              text={"New Music"}
              image={
                "data:image/png;base64,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"
              }
            />
            <ChartBlock
              navigation={navigation}
              id={"pp.323137423"}
              text={"Top 100 US Tracks"}
              image={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFdZxTc051wWEnAxE1Du7j6XzcVm2DuDVMEg&usqp=CAU"
              }
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  searchBar: {
    borderRadius: 10,
    borderRadius: 10,
    height: 40,
    paddingLeft: 20,
    marginRight: 10,
    color: Colors.text,
    borderColor: Colors.FG,
    borderWidth: 1,
    width: "85%",
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    color: Colors.text,
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
