import React, { useEffect, useState } from "react";
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
import { getYoutubeSearch } from "../../api";
import { Image } from "react-native";
import { Video } from "expo-av";
import VideoSearchItem from "../VideoSearchItem";

//TabView to display YouTube items in VideoSelection in CreatePost
const VoiceCoversTabView = (props) => {
  const [voiceCovers, setVoiceCovers] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState(new Set());

  const { song, selectFinalCover } = props;

  useEffect(() => {
    let isLoaded = true;

    const loadVoiceCovers = async () => {
      //Get top 10 cover results from youtube for user's selected song and store in voiceCovers
      const res = (
        await getYoutubeSearch(song.title + "  cover")
      ).data.items.map((item) => {
        return {
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
        };
      });
      if (isLoaded) setVoiceCovers(res);
    };
    loadVoiceCovers();

    return () => {
      isLoaded = false;
    };
  }, []);

  const selectVideo = (id) => {
    if (!selectedVideos.has(id)) {
      //If video is not currently selected, add it to selectedVideos
      const temp = selectedVideos.add(id);
      setSelectedVideos(new Set(temp));
      selectFinalCover(new Set(temp));
    } else {
      //If video is current selected, deselect it
      selectedVideos.delete(id);
      const temp = new Set(selectedVideos);
      setSelectedVideos(new Set(selectedVideos));
      selectFinalCover(temp);
    }
  };

  const renderItem = (item) => {
    return (
      <VideoSearchItem
        title={item.item.title}
        thumbnail={item.item.thumbnail}
        videoId={item.item.videoId}
        selectVideo={selectVideo}
        selected={selectedVideos.has(item.item.videoId)}
        key={item.item.videoId}
      />
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 15,
          alignSelf: "center",
        }}
      />
    );
  };

  return (
    <View>
      <FlatList
        style={{ paddingTop: 10 }}
        data={voiceCovers}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return item.videoId.toString();
        }}
        ItemSeparatorComponent={ItemSeparatorView}
      />
    </View>
  );
};

export default VoiceCoversTabView;
