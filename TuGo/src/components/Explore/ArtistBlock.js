import React from "react";
import {
  ImageBackground,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
} from "react-native";
const ArtistBlock = (props) => {
  const { artist, navigation, image, id, similarArtist, index } = props;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push("Artist", {
          artist: id,
          image: image,
        });
      }}
    >
      <View>
        <ImageBackground
          imageStyle={{
            ...styles.chartImage,
            width: similarArtist ? 180 : 180,
            height: similarArtist ? 180 : 180,
          }}
          style={{
            width: similarArtist ? 180 : 180,
            height: similarArtist ? 180 : 180,
          }}
          source={{
            uri: image,
          }}
        ></ImageBackground>
        <Text style={styles.chartName}>{similarArtist ? `${artist}` : `${index} ${artist}`}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  chartImage: {
    width: 120,
    height: 120,
    borderRadius: 999,
    opacity: 1,
  },
  chartName: {
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "center",
    marginTop: 10,
  },
});

export default ArtistBlock;
