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
import CustomVideoTabView from "../../components/TabViews/CustomVideoTabView";
import { Colors } from "../../../constants";
import { usePlayerState, usePlayerDispatch } from "../../context/playerContext";
import { AntDesign } from '@expo/vector-icons';

var { width, height } = Dimensions.get("window");

const VideoSelection = (props) => {
  const { song } = props.route.params;
  const [customVideos, setCustomVideos] = useState([]);
  const [isMax, setIsMax] = useState(false)
  const playerDispatch = usePlayerDispatch();

  const { navigation } = props;

  //Use finalChoreos variable to keep track of which videos are selected within child components
  const finalChoreos = useRef([]);

  const finalCovers = useRef([]);
  const selectFinalChoreo = (newSet) => {
    //Function to send into child components to set finalChoreos, set is taken as a parameter
    finalChoreos.current = Array.from(newSet);
    setIsMax(customVideos.length + finalChoreos.current.length + finalCovers.current.length < 9 ? false : true)
  };

  const selectFinalCover = (newSet) => {
    //Function to send into child components to set finalChoreos, set is taken as a parameter
    finalCovers.current = Array.from(newSet);
    setIsMax(customVideos.length + finalChoreos.current.length + finalCovers.current.length < 9 ? false : true)
  };

  const selectCustomVideos = (newVids) => {
    setCustomVideos(newVids)
    setIsMax(newVids.length + finalChoreos.current.length + finalCovers.current.length < 9 ? false : true)
  }
  //Tab view for Dance Choreos
  const FirstRoute = () => {
    if (index == 0) {
      return (
        <CustomVideoTabView
          setCustomVideos={selectCustomVideos}
          customVideos={customVideos}
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
        <DanceChoreosTabView
          inCreatePost={true}
          selectFinalChoreo={selectFinalChoreo}
          parentSelected={new Set(finalChoreos.current)}
          song={song}
        />
      );
    } else {
      return null;
    }
  };

  //Tab view for Voice Covers
  const ThirdRoute = () => {
    if (index == 2) {
      return (
        <VoiceCoversTabView
          inCreatePost={true}
          selectFinalCover={selectFinalCover}
          parentSelected={new Set(finalCovers.current)}
          song={song}
        />
      );
    } else {
      return null;
    }
  };

  const initialLayout = { width: Dimensions.get("window").width };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Custom Videos" },
    { key: "second", title: "Dance Choreos" },
    { key: "third", title: "Voice Covers" },
  ]);

  // const renderScene = SceneMap({
  //   first: FirstRoute,
  //   second: SecondRoute,
  //   third: ThirdRoute,
  // });

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <CustomVideoTabView
        setCustomVideos={selectCustomVideos}
        customVideos={customVideos}
        isMax={isMax}
      />
      case 'second':
        return <DanceChoreosTabView
        inCreatePost={true}
        selectFinalChoreo={selectFinalChoreo}
        parentSelected={new Set(finalChoreos.current)}
        song={song}
        isMax={isMax}
      />;
      case 'third':
        return <VoiceCoversTabView
        inCreatePost={true}
        selectFinalCover={selectFinalCover}
        parentSelected={new Set(finalCovers.current)}
        song={song}
        isMax={isMax}
      />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: Colors.FG }}
      style={{ backgroundColor: Colors.BG }}
      renderLabel={({ route, focused, color }) => (
        <>
          <Text style={{ color: Colors.text }}>{route.title}</Text>
        </>
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
          <Text style={{ color: Colors.close }}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            playerDispatch({ type: "UNLOAD_PLAYER" });
            navigation.navigate("Caption Selection", {
              song: song,
              danceChoreos: finalChoreos.current,
              voiceCovers: finalCovers.current,
              customVideos: customVideos,
            });
          }}
        >
          <Text
            style={{
              color: Colors.close,
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
