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
  TextInput,
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
import { Colors, appTheme } from "../../../constants";

var { width, height } = Dimensions.get("window");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Chart = (props) => {
  const { navigation } = props;
  const { chart } = props.route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState(null);
  const flatListRef = React.useRef();
  const searchBarRef = React.useRef();
  const [chartImage, setChartImage] = useState(null);
  const [disableScroll, setDisableScroll] = useState(false);

  //filter search
  const [filteredData, setFilteredData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState("");
  const [searchBarWidth, setSearchBarWidth] = useState(
    new Animated.Value(width * 0.5)
  );

  const [positionY, setPositionY] = useState(150);
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
      setFilteredData(tracksRes.data.tracks);
      setMasterData(tracksRes.data.tracks);
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

  const searchAnimationInactive = () => {
    Animated.timing(searchBarWidth, {
      toValue: width * 0.5,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const searchAnimationActive = () => {
    Animated.timing(searchBarWidth, {
      toValue: width * 0.8,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

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
        setDisableScroll={setDisableScroll}
      />
    );
  };

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const usernameData = item.name
          ? item.name.toUpperCase()
          : "".toUpperCase();
        const nameData = item.artistName
          ? item.artistName.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return (
          usernameData.indexOf(textData) > -1 || nameData.indexOf(textData) > -1
        );
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterData
      setFilteredData(masterData);
      setSearch(text);
    }
  };

  const scrollToTextInput = () => {
    flatListRef.current.scrollToOffset({
      animated: true,
      offset: searchBarRef.current,
    });
  };

  return (
    chartData &&
    chartImage && (
      <SafeAreaView style={styles.container}>
        <AnimatedFlatList
          keyboardDismissMode="interactive"
          scrollEnabled={!disableScroll}
          ref={flatListRef}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{
            marginTop: 270,
            paddingBottom: 270,
          }}
          scrollEventThrottle={1} // <-- Use 1 here to make sure no events are ever missed
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: animatedValue } },
              },
            ],
            { useNativeDriver: true }, // <-- Add this
            { listener: (event) => handleScroll(event) }
          )}
          data={filteredData}
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
              style={{ height: positionY, width: positionY, borderRadius: 40 }}
              source={{ uri: chartImage.image }}
            />
          </View>
          <Animated.View
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              searchBarRef.current = layout.y;
            }}
            style={{
              ...styles.textInputStyle,
              width: searchBarWidth,
              justifyContent: "center",
            }}
          >
            <TextInput
              keyboardAppearance={appTheme}
              onChangeText={(text) => {
                scrollToTextInput();
                searchFilterFunction(text);
              }}
              style={{
                flex: 1,
                paddingLeft: 20,
                paddingRight: 5,
              }}
              defaultValue={search}
              placeholder="Search Top Songs..."
              placeholderTextColor={"black"}
              clearButtonMode="always"
              onFocus={() => {
                scrollToTextInput();
                searchAnimationActive();
              }}
              onBlur={searchAnimationInactive}
            />
          </Animated.View>
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
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 50,
  },
  chartName: {
    fontWeight: "bold",
  },
  chartNameView: {
    marginTop: 30,
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#E8E8E8",
    padding: 10,
  },
  textInputStyle: {
    height: 30,
    borderRadius: 20,
    color: Colors.text,
    borderColor: "black",
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 15,
    width: "50%",
  },
  box2: {
    backgroundColor: "red",
    height: "100%",
    flexGrow: 1,
  },
});

export default Chart;
