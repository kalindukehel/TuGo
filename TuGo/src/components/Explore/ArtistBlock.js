import React, { useState } from "react";
import {
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
} from "react-native";
import { Colors } from "../../../constants";
import GText from "../GText"

var { width } = Dimensions.get("window");
let maxlimit = 15;

const ArtistBlock = (props) => {
  const { artist, navigation, image, id, topFive, index, columns } = props;

  const size = width / columns;

  const [sizeValue, setSizeValue] = useState(new Animated.Value(size));

  const name = `${artist}`;

  const imageAnimationIn = () => {
    Animated.timing(sizeValue, {
      toValue: width / (columns + 0.2),
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  const imageAnimationOut = () => {
    Animated.timing(sizeValue, {
      toValue: size,
      duration: 20,
      useNativeDriver: false,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push("Artist", {
          artist: id,
          image: image,
        });
      }}
      onPressIn={imageAnimationIn}
      onPressOut={imageAnimationOut}
    >
      <View
        style={{
          width: width / (columns - 0.5),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.Image
            style={{
              ...styles.chartImage,
              width: sizeValue,
              height: sizeValue,
            }}
            source={{
              uri: image,
            }}
          />
        </View>
        <GText style={styles.chartName}>
          {name.length > maxlimit
            ? name.substring(0, maxlimit - 3) + "..."
            : name}
        </GText>
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
    color: Colors.FG,
  },
});

export default ArtistBlock;
