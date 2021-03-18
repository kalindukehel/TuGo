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
import VoiceCoversTabView from "../../components/TabViews/VoiceCoversTabView";
import { Colors } from "../../../constants";

var { width, height } = Dimensions.get("window");

const VideoSelection = (props) => {
  const { song } = props.route.params;
  console.log(song);
  const { navigation } = props;

  //Use finalChoreos variable to keep track of which videos are selected within child components
  const finalChoreos = useRef([]);

  const finalCovers = useRef([]);

  const selectFinalChoreo = (newSet) => {
    //Function to send into child components to set finalChoreos, set is taken as a parameter
    finalChoreos.current = Array.from(newSet);
  };

  const selectFinalCover = (newSet) => {
    //Function to send into child components to set finalChoreos, set is taken as a parameter
    finalCovers.current = Array.from(newSet);
  };

  //Tab view for Dance Choreos
  const FirstRoute = () => {
    if (index == 0) {
      return (
        <DanceChoreosTabView
          selectFinalChoreo={selectFinalChoreo}
          song={song}
        />
      );
    } else {
      return null;
    }
  };

  //Tab view for Voice Covers
  const SecondRoute = () => {
    if (index == 1) {
      return (
        <VoiceCoversTabView selectFinalCover={selectFinalCover} song={song} />
      );
    } else {
      return null;
    }
  };

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
      indicatorStyle={{ backgroundColor: Colors.FG }}
      style={{ backgroundColor: Colors.BG }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: Colors.text }}>{route.title}</Text>
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
              danceChoreos: finalChoreos.current,
              voiceCovers: finalCovers.current,
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
        coverArt={song.coverArt}
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
    backgroundColor: Colors.BG,
  },
  searchBar: {
    borderRadius: 10,
    color: Colors.text,
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
