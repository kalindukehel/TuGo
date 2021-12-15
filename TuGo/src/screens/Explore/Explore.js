import React, { useState, useEffect, useRef } from "react";
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
import { useScrollToTop } from '@react-navigation/native';
import {
  getExplorePosts as getExplorePostsAPI,
  topFiveArtists as topFiveArtistsAPI,
  artistImage as artistImageAPI,
  getCharts as getChartsAPI,
  getNewAlbums as getNewAlbumsAPI
} from "../../api";
import SongBlock from "../../components/Explore/SongBlock";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, appTheme } from "../../../constants";
import { Feather } from "@expo/vector-icons";

//Components
import ChartBlock from "../../components/Explore/ChartBlock";
import ArtistBlock from "../../components/Explore/ArtistBlock";
import Animated from "react-native-reanimated";

import { usePlayerState, usePlayerDispatch } from "../../context/playerContext";
import AlbumBlock from "../../components/Explore/AlbumBlock";
import GText from "../../components/GText"

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
  const [charts, setCharts] = useState(null);
  const [albums, setAlbums] = useState(null);
  const playerDispatch = usePlayerDispatch();

  const insets = useSafeAreaInsets();

  //scroll to top
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getExploreState() {
      setIsLoading(true);
      const exploreState = await getExplorePostsAPI(userToken);
      const topArtistsRes = await topFiveArtistsAPI();
      const charts = await getChartsAPI();
      const albums = await getNewAlbumsAPI();
      setCharts(charts.data.playlists)
      setAlbums(albums.data.albums)
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
  const SecondRoute = () => {
    if (index == 1) {
      return <PostsTabView searchQuery={search} navigation={navigation} />;
    } else {
      return <View></View>;
    }
  };

  const ThirdRoute = () => {
    if (index == 2) {
      return <AccountsTabView searchQuery={search} navigation={navigation} />;
    } else {
      return <View></View>;
    }
  };

  const initialLayout = { width: Dimensions.get("window").width };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Music" },
    { key: "second", title: "Posts" },
    { key: "third", title: "Accounts" },
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
        <GText style={{ color: Colors.text }}>{route.title}</GText>
      )}
    />
  );

  const renderItem = (component) => {
    const postId = component.item.post;
    return (
      <View style={{ height: 150, width: 150 }}>
        <SongBlock postId={postId} navigation={navigation} columns={2} blockHeight={150} blockWidth={150}/>
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
          height: 150,
          borderRadius: 20,
          backgroundColor: "#DFDFDF",
        }}
      >
        <GText style={{ fontWeight: "bold", fontSize: 20 }}>
          No new posts...
        </GText>
      </ImageBackground>
    ) : (
      <View
        style={{
          height: 150,
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
      <View style={{ height: 170 }}>
        <ArtistBlock
          artist={item.name}
          navigation={navigation}
          image={item.image}
          id={item.id}
          index={index + 1}
          columns={3}
          topFive
        />
      </View>
    );
  };

  const renderChart = ({ item, index }) => {
    return (
      <ChartBlock
        navigation={navigation}
        id={item.id}
        text={item.name}
        image={`http://direct.napster.com/imageserver/v2/playlists/${item.id}/artists/images/230x153.jpg`}
      />
    );
  };

  const renderAlbum = ({ item, index }) => {
    return (
      <AlbumBlock
        navigation={navigation}
        id={item.id}
        text={item.name}
        image={`https://api.napster.com/imageserver/v2/albums/${item.id}/images/230x153.jpg`}
      />
    );
  };

  const ListEmptyComponentArtist = () => {
    return (
      isLoading && (
        <View
          style={{
            height: 150,
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
              playerDispatch({ type: "UNLOAD_PLAYER" });
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
              <GText style={{ color: Colors.text }}>Cancel</GText>
            </TouchableOpacity>
          </View>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
            swipeEnabled={index === 0 || index === 1 ? false : true}
          />
        </View>
      )}
      {mode != "search" && (
        <ScrollView
          ref={ref}
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
            <GText
              style={{
                fontSize: 35,
                color: Colors.FG,
              }}
            >
              Browse
            </GText>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.push("Explore Posts");
              }}
            >
              <View
                style={{
                  padding: 5,
                  alignItems: "flex-end",
                }}
              >
                {/* <Octicons name="chevron-right" size={24} color={Colors.FG} /> */}
                <GText style={{color: Colors.close}}>See All</GText>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
            ItemSeparatorComponent={ItemSeparatorComponent}
            horizontal={true}
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
            <GText style={{ fontSize: 25, color: Colors.FG }}>Artists</GText>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.push("All Artists");
              }}
            >
              <View
                style={{
                  padding: 5,
                  alignItems: "flex-end",
                }}
              > 
                {/* <Octicons name="chevron-right" size={24} color={Colors.FG} /> */}
                <GText style={{color: Colors.close}}>See All</GText>
              </View>
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
            <GText style={{ fontSize: 25, color: Colors.FG }}>Top Albums</GText>
            {/* <TouchableWithoutFeedback>
              <GText style={{color: Colors.close}}>See All</GText>
            </TouchableWithoutFeedback> */}
          </View>

          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
            ItemSeparatorComponent={ItemSeparatorComponent}
            data={albums}
            horizontal={true}
            renderItem={renderAlbum}
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
            <GText style={{ fontSize: 25, color: Colors.FG }}>Charts</GText>
            {/* <TouchableWithoutFeedback>
              <GText style={{color: Colors.close}}>See All</GText>
            </TouchableWithoutFeedback> */}
          </View>

          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, alignItems: 'center'}}
            ItemSeparatorComponent={ItemSeparatorComponent}
            data={charts}
            renderItem={renderChart}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={ListEmptyComponentArtist}
            numColumns={3}
          />
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
