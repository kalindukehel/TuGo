import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { getArtistInfo as getArtistInfoAPI } from "../../api";
import HTML from "react-native-render-html";

var { width, height } = Dimensions.get("window");

const ArtistInfo = (props) => {
  const { navigation } = props;
  const { artistId } = props.route.params;
  const [artistDetails, setArtistDetails] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    async function artistInfo() {
      const res = await getArtistInfoAPI(artistId);
      setArtistDetails(res.data.artists[0]);
    }
    artistInfo();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const getArtistImage = (artistId) => {
    return `https://api.napster.com/imageserver/v2/artists/${artistId}/images/500x500.jpg`;
  };

  const contentWidth = useWindowDimensions().width;

  return (
    artistDetails && (
      <View style={styles.container}>
        <View style={styles.chartHeader}>
          <View style={styles.chartImageView}>
            <Image
              style={{ height: 140, width: 140, borderRadius: 40 }}
              source={{ uri: getArtistImage(artistId) }}
            />
          </View>
        </View>
        <View style={styles.chartNameView}>
          <Text style={styles.chartName}>{artistDetails.name}</Text>
        </View>
        <ScrollView>
          <View style={styles.infoView}>
            <HTML
              source={{ html: artistDetails.bios[0].bio }}
              contentWidth={contentWidth}
            />
          </View>
        </ScrollView>
      </View>
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
    marginHorizontal: 10,
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
    position: "absolute",
    height: 180,
    width: width,
    backgroundColor: "#E3FBFF",
    borderBottomRightRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  chartName: {
    fontWeight: "bold",
  },
  chartNameView: {
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#E8E8E8",
    padding: 10,
    marginTop: 10,
    position: "absolute",
    top: 180,
    zIndex: 2,
  },
  infoView: {
    marginTop: 240,
    margin: 20,
  },
});

export default ArtistInfo;
