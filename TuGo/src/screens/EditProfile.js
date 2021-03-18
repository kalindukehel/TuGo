import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { API_URL } from "../../constants";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { postProfilePicture as postProfilePictureAPI } from "../api";
import { useAuthState } from "../context/authContext";
import { Colors } from "react-native/Libraries/NewAppScreen";
var { width, height } = Dimensions.get("window");

const EditProfile = (props) => {
  const { userToken, self } = useAuthState();
  const { navigation } = props;
  const [image, setImage] = useState(self.profile_picture);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={async () => {
            try {
              //await postProfilePictureAPI(image, userToken, self.id);
              navigation.goBack();
            } catch (e) {
              console.log(e);
            }
          }}
        >
          <Text style={{ color: "blue" }}>SAVE</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BG }}>
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
            source={{
              uri: image,
            }}
            style={styles.profilePicture}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderColor: Colors.text,
    borderWidth: 2,
    borderRadius: 90,
    zIndex: 1,
    position: "absolute",
  },
});

export default EditProfile;
