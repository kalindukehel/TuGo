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
  const { song, selectFinalCover, parentSelected, inCreatePost } = props;
  const [voiceCovers, setVoiceCovers] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState(
    parentSelected ? parentSelected : new Set()
  );

  useEffect(() => {
    console.log(parentSelected);
    console.log(selectedVideos);
  }, []);
  useEffect(() => {
    let isLoaded = true;

    const loadVoiceCovers = async () => {
      //Get top 10 cover results from youtube for user's selected song and store in voiceCovers
      const searchQuery = inCreatePost
        ? song.title + " " + song.artist + " cover"
        : song.song_name + " " + song.song_artist + " cover";
      const res = (await getYoutubeSearch(searchQuery)).data.items.map(
        (item) => {
          return {
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
          };
        }
      );
      if (isLoaded) setVoiceCovers(res);
    };
    loadVoiceCovers();

    return () => {
      isLoaded = false;
    };
  }, []);

  const selectVideo = (id) => {
    if (inCreatePost) {
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
    }
  };

  const renderItem = (item) => {
    return inCreatePost ? (
      <VideoSearchItem
        inCreatePost={inCreatePost}
        title={item.item.title}
        thumbnail={item.item.thumbnail}
        videoId={item.item.videoId}
        selectVideo={selectVideo}
        selected={selectedVideos.has(item.item.videoId)}
        key={item.item.videoId}
        outlineColor={"purple"}
      />
    ) : (
      <VideoSearchItem
        inCreatePost={inCreatePost}
        title={item.item.title}
        thumbnail={item.item.thumbnail}
        videoId={item.item.videoId}
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
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }}
        data={voiceCovers}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        ItemSeparatorComponent={ItemSeparatorView}
      />
    </View>
  );
};

export default VoiceCoversTabView;
