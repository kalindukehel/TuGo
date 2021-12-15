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
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  SafeAreaView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { 
postProfilePicture as postProfilePictureAPI, 
editProfile as editProfileAPI, 
getSelf as getSelfAPI,
isValidEmail as isValidEmailAPI,
isValidUsername as isValidUsernameAPI } from "../api";
import { useAuthState, useAuthDispatch } from "../context/authContext";
import { Colors, Length } from "../../constants"
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { updateUser } from "../graphql/mutations"
import { API, Auth, graphqlOperation } from "aws-amplify";
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GText from "../components/GText"

var { width, height } = Dimensions.get("window");

const EditProfile = (props) => {
  const { userToken, self } = useAuthState();
  const { navigation } = props;
  const [image, setImage] = useState(self.profile_picture);
  const [username, setUsername] = useState(self.username);
  const [name, setName] = useState(self.name);
  const [email, setEmail] = useState(self.email);
  const [usernameCheck, setUsernameCheck] = useState(true);
  const [emailCheck, setEmailCheck] = useState(true);
  const dispatch = useAuthDispatch();
  const [enabled, setEnabled] = useState(true)
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if(username !== self.username || email !== self.email || name !== self.name || image !== self.profile_picture) {
      setEnabled((usernameCheck && emailCheck) && name)
    }
    else{
      setEnabled(false)
    }
  },[username, email, usernameCheck, emailCheck, name, image])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={!enabled}
          style={{ marginRight: 20 }}
          onPress={async () => {
            try {
              if (image != self.profile_picture) {
                const userRes = await postProfilePictureAPI(image, userToken, self.id)
                const update = {
                  id: userRes.data.id,
                  name: userRes.data.name,
                  username: userRes.data.username,
                  imageUri: userRes.data.profile_picture,
                  status: "Hey, I am using Tugo",
                }
                const chatRoomData = await API.graphql(
                  graphqlOperation(updateUser, { input: update })
                );
              }
              if (name !== self.name || username !== self.username || email !== self.email){
                const userRes = await editProfileAPI(username, name, email, userToken)
                const update = {
                  id: userRes.data.id,
                  name: userRes.data.name,
                  username: userRes.data.username,  
                  imageUri: userRes.data.profile_picture,
                  status: "Hey, I am using Tugo",
                }
                const chatRoomData = await API.graphql(
                  graphqlOperation(updateUser, { input: update })
                );
              }
              //get self after updated self
              const selfRes = await getSelfAPI(userToken);
              dispatch({ type: "GET_SELF", self: selfRes.data });
              navigation.goBack();
            } catch (e) {
              alert(e)
            }
          }}
        >
          <GText style={{ color: enabled ? Colors.save : Colors.gray }}>SAVE</GText>
        </TouchableOpacity>
      ),
    });
  }, [navigation, username, name, image, enabled]);

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


  const onChangeEmail = async (text) => {
    if (text != self.email){
      setEmail(text)
      const res = await isValidEmailAPI(text)
      setEmailCheck(res.data.available)
    }
    else {
      setEmail(text)
      setEmailCheck(true)
    }
  }
  
  const onChangeUsername = async (text) => {
    if(text != self.username){
      setUsername(text)
      const res = await isValidUsernameAPI(text)
      setUsernameCheck(res.data.available)
    } 
    else{
      setUsername(text)
      setUsernameCheck(true)
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
    <KeyboardAvoidingView
    behavior={"position"}
    keyboardVerticalOffset={-insets.bottom - 75}
    style={{
      flex: 1,
      backgroundColor: Colors.BG,
    }}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View >
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
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder={'Name'}
          placeholderTextColor={Colors.gray}
          maxLength={Length.name}
        />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={{...styles.input, borderColor: usernameCheck ? Colors.primary : Colors.error}}
          onChangeText={onChangeUsername}
          value={username}
          placeholder={'Username'}
          placeholderTextColor={Colors.gray}
          maxLength={Length.username}
        />
        {(username === self.username) ?  null : usernameCheck === true ? 
        <View style={{position: 'absolute', right: '5%'}}>
          <AntDesign name="checkcircle" size={20} color={Colors.FG} /> 
        </View> :
        <TouchableWithoutFeedback 
          onPress={()=>{
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            alert(username === "" ? 'Username cannot be empty' : 'Username is taken')  
          }}
        >
          <View style={{position: 'absolute', right: '5%'}}>
            <AntDesign name="exclamationcircle" size={20} color={Colors.FG} />
          </View>
        </TouchableWithoutFeedback>}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={{...styles.input, borderColor: emailCheck ? Colors.primary : Colors.error}}
          onChangeText={onChangeEmail}
          value={email}
          placeholder={'Email'}
          placeholderTextColor={Colors.gray}
          maxLength={Length.email}
        />
        {(email === self.email) ? null : emailCheck === true ? 
        <View style={{position: 'absolute', right: '5%'}}>
          <AntDesign name="checkcircle" size={20} color={Colors.FG} /> 
        </View> :
        <TouchableWithoutFeedback 
          onPress={()=>{
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            alert('Email in use')  
          }}
        >
          <View style={{position: 'absolute', right: '5%'}}>
            <AntDesign name="exclamationcircle" size={20} color={Colors.FG} />
          </View>
        </TouchableWithoutFeedback> }
      </View>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
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
    fontSize: 20,
    flex: 1,
  },
});

export default EditProfile;
