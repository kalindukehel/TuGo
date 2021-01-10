import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import SearchItem from "../../components/SearchItem";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { FlatList } from "react-native-gesture-handler";
import DanceChoreosTabView from "../../components/TabViews/DanceChoreosTabView";

var { width, height } = Dimensions.get("window");

const VideoSelection = (props) => {
  const { song } = props.route.params;
  const { navigation } = props;

  //Use finalVideos variable to keep track of which videos are selected within child components
  const finalVideos = useRef([]);

  const selectFinalVideo = (newSet) => {
    //Function to send into child components to set finalVideos, set is taken as a parameter
    finalVideos.current = Array.from(newSet);
  };

  //Tab view for Dance Choreos
  const FirstRoute = () => {
    return (
      <DanceChoreosTabView selectFinalVideo={selectFinalVideo} song={song} />
    );
  };

  const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: "white" }]} />
  );

  const initialLayout = { width: Dimensions.get("window").width };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Dance Choreos" },
    { key: "second", title: "Voice Covers" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
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
          marginHorizontal: 15,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ color: "blue" }}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Caption Selection", {
              song: song,
              danceChoreos: finalVideos.current,
            });
          }}
        >
          <Text
            style={{
              color: "blue",
            }}
          >
            NEXT
          </Text>
        </TouchableOpacity>
      </View>
      <SearchItem
        index={song.id}
        coverArt={song.coverArt.replace("large", "t500x500")}
        artist={song.artist}
        title={song.title}
        audioLink={song.audioLink}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
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
    width: "100%",
  },
});

export default VideoSelection;
