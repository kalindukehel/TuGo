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
import { createPost, getYoutubeSearch } from "../../api";
import { Image } from "react-native";
import { Video } from "expo-av";
import VideoSearchItem from "../VideoSearchItem";

//TabView to display YouTube items in VideoSelection in CreatePost
const DanceChoreosTabView = (props) => {
  const [danceChoreos, setDanceChoreos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState(new Set());

  const { song, selectFinalChoreo, inCreatePost } = props;

  useEffect(() => {
    let isLoaded = true;

    const loadDanceChoreos = async () => {
      //Get top 10 choreo results from youtube for user's selected song and store in danceChoreos
      const searchQuery = inCreatePost
        ? song.title + " " + song.artist + " choreo"
        : song.song_name + " " + song.song_artist + " choreo";
      const res = (await getYoutubeSearch(searchQuery)).data.items.map(
        (item) => {
          return {
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
          };
        }
      );
      console.log(res);
      if (isLoaded) setDanceChoreos(res);
    };
    loadDanceChoreos();

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
        selectFinalChoreo(new Set(temp));
      } else {
        //If video is current selected, deselect it
        selectedVideos.delete(id);
        const temp = new Set(selectedVideos);
        setSelectedVideos(new Set(selectedVideos));
        selectFinalChoreo(temp);
      }
    }
  };

  const renderItem = (item) => {
    return inCreatePost ? (
      <VideoSearchItem
        title={item.item.title}
        thumbnail={item.item.thumbnail}
        videoId={item.item.videoId}
        selectVideo={selectVideo}
        inCreatePost={inCreatePost}
        selected={selectedVideos.has(item.item.videoId)}
        key={item.item.videoId}
      />
    ) : (
      <VideoSearchItem
        title={item.item.title}
        thumbnail={item.item.thumbnail}
        videoId={item.item.videoId}
        inCreatePost={inCreatePost}
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
        data={danceChoreos}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        ItemSeparatorComponent={ItemSeparatorView}
      />
    </View>
  );
};

export default React.memo(DanceChoreosTabView);
