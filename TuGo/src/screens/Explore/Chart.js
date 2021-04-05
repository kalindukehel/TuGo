import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Text,
  FlatList,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

import {
  getExplorePosts as getExplorePostsAPI,
  songcharts as songchartsAPI,
  getChartImage as getChartImageAPI,
  getChartTracks as getChartTracksAPI,
} from "../../api";
import { useAuthState } from "../../context/authContext";

//Components
import SearchItem from "../../components/SearchItem";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Colors } from "../../../constants";

var { width, height } = Dimensions.get("window");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Chart = (props) => {
  const { navigation } = props;
  const { chart } = props.route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState(null);
  const flatListRef = React.useRef();
  const [chartImage, setChartImage] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);

  const animatedValue = useRef(new Animated.Value(0)).current;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getChartData() {
      const imageRes = await getChartImageAPI(chart);
      setChartImage({
        image: imageRes.data.playlists[0].images[0].url,
        chartName: imageRes.data.playlists[0].name,
      });
      const tracksRes = await getChartTracksAPI(chart);
      setChartData(tracksRes.data.tracks);
    }
    getChartData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const toTop = () => {
    // use current
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  let translateY = animatedValue.interpolate({
    inputRange: [0, 220],
    outputRange: [0, -220],
    extrapolate: "clamp",
  });

  const getImage = (albumId) => {
    return `https://api.napster.com/imageserver/v2/albums/${albumId}/images/500x500.jpg`;
  };

  const renderSuggestion = ({ item }) => {
    return (
      <SearchItem
        index={item.id}
        coverArt={getImage(item.albumId)}
        selected={false}
        selectItem={null}
        artist={item.artistName}
        title={item.name}
        audioLink={item.previewURL}
        postable={true}
        navigation={navigation}
        genre={item.links.genres.ids}
        trackId={item.id}
        artistId={item.artistId}
      />
    );
  };

  return (
    chartData &&
    chartImage && (
      <SafeAreaView style={styles.container}>
        <AnimatedFlatList
          scrollEnabled={!isSeeking}
          ref={flatListRef}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ marginTop: 270, paddingBottom: 270 }}
          scrollEventThrottle={16} // <-- Use 1 here to make sure no events are ever missed
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: animatedValue } },
              },
            ],
            { useNativeDriver: true } // <-- Add this
          )}
          data={chartData}
          renderItem={renderSuggestion}
          keyExtractor={(item, index) => {
            return item.id;
          }}
        />
        <Animated.View
          style={[styles.chartHeader, { transform: [{ translateY }] }]}
        >
          <View style={styles.chartImageView}>
            <Image
              style={{ height: 200, width: 200, borderRadius: 40 }}
              source={{ uri: chartImage.image }}
            />
          </View>
          <TouchableWithoutFeedback onPress={toTop}>
            <View style={styles.chartNameView}>
              <Text style={styles.chartName}>{chartImage.chartName}</Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  chartImageView: {
    marginTop: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  chartHeader: {
    height: 220,
    alignItems: "center",
    position: "absolute",
    width: width,
    flex: 1,
    backgroundColor: "#E3FBFF",
    borderBottomRightRadius: 50,
  },
  chartName: {
    fontWeight: "bold",
  },
  chartNameView: {
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#E8E8E8",
    padding: 10,
  },
});

export default Chart;
