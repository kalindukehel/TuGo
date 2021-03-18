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
} from "../../api";
import { useAuthState } from "../../context/authContext";

//Components
import SearchItem from "../../components/SearchItem";
import { TouchableHighlight } from "react-native-gesture-handler";

var { width, height } = Dimensions.get("window");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Chart = (props) => {
  const { chart } = props.route.params;
  const { userToken } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState(null);
  const flatListRef = React.useRef();

  const animatedValue = useRef(new Animated.Value(0)).current;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function getChartOne() {
      const chartoneRes = await songchartsAPI("pp.180234724", userToken);
      setChartData(chartoneRes.data.data);
    }
    async function getChartTwo() {
      const charttwoRes = await songchartsAPI("pp.214725454", userToken);
      setChartData(charttwoRes.data.data);
    }
    async function getChartThree() {
      const chartthreeRes = await songchartsAPI("pp.225974698", userToken);
      setChartData(chartthreeRes.data.data);
    }
    async function getChartFour() {
      const chartfourRes = await songchartsAPI("pp.323137423", userToken);
      setChartData(chartfourRes.data.data);
    }
    chart === "one"
      ? getChartOne()
      : chart === "two"
      ? getChartTwo()
      : chart === "three"
      ? getChartThree()
      : getChartFour();
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

  const renderSuggestion = (suggestion) => {
    return (
      <SearchItem
        index={suggestion.item.id}
        coverArt={suggestion.item.albumCover}
        selected={false}
        selectItem={null}
        artist={suggestion.item.artist}
        title={suggestion.item.title}
        audioLink={suggestion.item.audio_url}
        color={"#ffffff00"}
      />
    );
  };

  return (
    chartData && (
      <SafeAreaView style={styles.container}>
        <AnimatedFlatList
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
          data={chartData.tracks}
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
              source={{ uri: chartData.playlist_image }}
            />
          </View>

          <TouchableWithoutFeedback onPress={toTop}>
            <View style={styles.chartNameView}>
              <Text style={styles.chartName}>{chartData.name}</Text>
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
    backgroundColor: "white",
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
    borderRadius: 10,
    backgroundColor: "#E8E8E8",
    padding: 10,
    marginTop: 20,
  },
});

export default Chart;
