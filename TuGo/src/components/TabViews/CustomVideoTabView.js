import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "../../../constants";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { Fontisto } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

var { width, height } = Dimensions.get("window");

const CustomVideoTabView = (props) => {
  const { setCustomVideos, customVideos, isMax } = props;
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState({});

  const videosRef = useRef([]);

  useEffect(() => {
    // (async () => {
    //   if (Platform.OS !== "web") {
    //     const {
    //       status,
    //     } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //     if (status !== "granted") {
    //       alert("Sorry, we need camera roll permissions to make this work!");
    //     }
    //   }
    // })();
  }, []);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setCustomVideos([
        ...customVideos,
        {
          isCustom: true,
          width: result.width,
          height: result.height,
          uri: result.uri,
        },
      ]);
    }
  };

  const renderVideo = ({ item, index }) => {
    return (
      <View style={{ padding: 5, flexDirection: "row" }}>
        <Video
          ref={videosRef.current[item.uri]}
          style={styles.video}
          source={{ uri: item.uri }} // Can be a URL or a local file.
          useNativeControls
          resizeMode="contain"
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        ></Video>

        <TouchableWithoutFeedback
          onPress={() => {
            setCustomVideos(
              customVideos.filter((video) => video.uri != item.uri)
            );
          }}
        >
          <View
            style={{
              position: "absolute",
              right: -1,
              backgroundColor: Colors.BG,
              borderRadius: 999,
            }}
          >
            <Fontisto name="close" size={24} color={Colors.FG} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isMax &&
      <Text style={{color: Colors.close, textAlign: 'center', fontWeight: '200', fontSize: 15}}>Sorry, max attachments reached</Text>}
      <FlatList
        data={customVideos}
        renderItem={renderVideo}
        keyExtractor={(item, index) => item.uri.toString()}
        numColumns={3}
        contentContainerStyle={{
          alignItems: "center",
          marginTop: 10,
          paddingBottom: 95,
        }}
      />
      <TouchableWithoutFeedback
        disabled={isMax}
        onPress={() => {
          pickVideo();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <View style={{...styles.actionButton, backgroundColor: isMax ? Colors.contrastGray:Colors.gray}}>
          <Text style={{...styles.actionButtonText, color: isMax ? Colors.gray :Colors.complimentText,}}>View Gallery</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10
  },
  video: {
    alignSelf: "center",
    width: 0.3 * width,
    height: 170,
    borderColor: Colors.FG,
    borderWidth: 3,
    borderRadius: 10,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 10,
    width: "90%",
    paddingVertical: 15,
    alignSelf: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
  },
  actionButtonText: {
    alignSelf: "center",
  },
});

export default CustomVideoTabView;
