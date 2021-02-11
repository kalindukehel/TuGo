import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
  Linking,
} from "react-native";
import { API_URL } from "../../constants";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import {
  editUserAccount as editUserAccountAPI,
  getSelf as getSelfAPI,
  postProfilePicture as postProfilePictureAPI,
} from "../api";
import { useAuthState } from "../context/authContext";
import Hyperlink from "react-native-hyperlink";

//images
import SoundcloudIcon from "../../assets/soundcloud.svg";
import SpotifyIcon from "../../assets/spotify.svg";
import YoutubeIcon from "../../assets/youtube.svg";

var { width, height } = Dimensions.get("window");

const EditProfile = (props) => {
  const { userToken, self } = useAuthState();
  const { navigation } = props;
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [soundcloudURL, setSoundcloudURL] = useState("");
  const [spotifyURL, setSpotifyURL] = useState("");
  const [youtubeURL, setYoutubeURL] = useState("");
  const [data, setData] = useState({});

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={async () => {
            try {
              //await postProfilePictureAPI(image, userToken, self.id);
              navigation.goBack();
              await editUserAccountAPI(data, userToken, self.id);
              if (image != originalImage) {
                await postProfilePictureAPI(image, userToken, self.id);
              }
            } catch (e) {
              console.log(e);
            }
          }}
        >
          <Text style={{ color: "blue" }}>SAVE</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, data, image]);

  useEffect(() => {
    async function getUserState() {
      const res = await getSelfAPI(userToken);
      setSoundcloudURL(
        res.data.soundcloud_account ? res.data.soundcloud_account : ""
      );
      setSpotifyURL(res.data.spotify_account ? res.data.spotify_account : "");
      setYoutubeURL(res.data.youtube_account ? res.data.youtube_account : "");
      setImage({ uri: res.data.profile_picture });
      setOriginalImage({ uri: res.data.profile_picture });
    }
    getUserState();
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  };

  const onChangeSpotifyURL = (link) => {
    setData({ ...data, spotify_account: "http://" + link + "/" });
    setSpotifyURL(link);
  };

  const onChangeSoundcloudURL = (link) => {
    setData({ ...data, soundcloud_account: "http://" + link + "/" });
    setSoundcloudURL(link);
  };

  const onChangeYoutubeURL = (link) => {
    setData({ ...data, youtube_account: "http://" + link + "/" });
    setYoutubeURL(link);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          width: width / 2,
          height: 200,
          marginTop: 10,
          alignSelf: "center",
        }}
      >
        <TouchableOpacity onPress={pickImage} style={{ flex: 1 }}>
          <Image
            source={
              image
                ? {
                    uri: image.uri,
                  }
                : null
            }
            style={styles.profilePicture}
          ></Image>
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
            borderTopWidth: 1,
          }}
        >
          <SoundcloudIcon width={40} height={40} />
          <TextInput
            clearButtonMode="always"
            style={{
              borderColor: "gray",
              borderBottomWidth: 1,
              paddingVertical: 15,
              marginLeft: 15,
              flex: 1,
            }}
            onChangeText={onChangeSoundcloudURL}
            value={soundcloudURL}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <SpotifyIcon width={40} height={40} />
          <TextInput
            clearButtonMode="always"
            style={{
              borderColor: "gray",
              borderBottomWidth: 1,
              flex: 1,
              paddingVertical: 15,

              marginLeft: 15,
            }}
            onChangeText={onChangeSpotifyURL}
            value={spotifyURL}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
            borderBottomWidth: 1,
          }}
        >
          <YoutubeIcon width={40} height={40} />
          <TextInput
            clearButtonMode="always"
            style={{
              borderColor: "gray",
              flex: 1,
              paddingVertical: 15,

              marginLeft: 15,
            }}
            onChangeText={onChangeYoutubeURL}
            value={youtubeURL}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 90,
    zIndex: 1,
    position: "absolute",
  },
});

export default EditProfile;
