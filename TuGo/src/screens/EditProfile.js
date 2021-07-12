import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { API_URL } from "../../constants";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { postProfilePicture as postProfilePictureAPI, editProfile as editProfileAPI } from "../api";
import { useAuthState } from "../context/authContext";
import { Colors } from "../../constants"
import { TextInput } from "react-native-gesture-handler";
var { width, height } = Dimensions.get("window");

const EditProfile = (props) => {
  const { userToken, self } = useAuthState();
  const { navigation } = props;
  const [image, setImage] = useState(self.profile_picture);
  const [username, setUsername] = useState(self.username);
  const [name, setName] = useState(self.name);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
        disabled={false}
          style={{ marginRight: 20 }}
          onPress={async () => {
            try {
              //await postProfilePictureAPI(image, userToken, self.id);
              const res = await editProfileAPI(username, name, userToken)
              navigation.goBack();
            } catch (e) {
              alert(e)
            }
          }}
        >
          <Text style={{ color: Colors.primary }}>SAVE</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, username, name, image]);

  // useEffect(() => {
  //   (async () => {
  //     let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

  //     if (permissionResult.granted === false) {
  
  //       alert('Permission to access camera roll is required!');
  
  //       return;
  
  //     }
  //   })();
  // }, []);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {

      alert('Permission to access camera roll is required!\nGo to settings > Privacy > TuGo');

      return;

    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container }>
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
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder={'Username'}
        placeholderTextColor={Colors.gray}
        maxLength={25}
      />
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder={'Name'}
        placeholderTextColor={Colors.gray}
        maxLength={25}
      />
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 999,
    zIndex: 1,
    position: "absolute",
  },
  input: {
    height: 40,
    margin: 20,
    borderBottomWidth: 1,
    color: Colors.text,
    borderColor: Colors.primary,
    fontSize: 20
  },
});

export default EditProfile;
