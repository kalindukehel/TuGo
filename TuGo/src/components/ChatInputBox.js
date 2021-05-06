import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import { API, Auth, graphqlOperation } from "aws-amplify";

import { createMessage, updateChatRoom } from "../graphql/mutations";

import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";
import { useAuthState } from "../context/authContext";
import { Colors } from "../../constants";

//audio for recording messages
import { Audio } from "expo-av";

const ChatInputBox = (props) => {
  const { chatRoomID } = props;
  const { self } = useAuthState();

  const [message, setMessage] = useState("");
  const [myUserId, setMyUserId] = useState(null);
  const [recording, setRecording] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      setMyUserId(self.id);
    };
    fetchUser();
  }, []);

  const onMicrophonePress = () => {
    if (recording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  async function onStartRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function onStopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
  }

  const updateChatRoomLastMessage = async (messageId) => {
    try {
      await API.graphql(
        graphqlOperation(updateChatRoom, {
          input: {
            id: chatRoomID,
            lastMessageID: messageId,
          },
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const onSendPress = async () => {
    try {
      const newMessageData = await API.graphql(
        graphqlOperation(createMessage, {
          input: {
            content: message,
            userID: myUserId,
            chatRoomID,
          },
        })
      );

      await updateChatRoomLastMessage(newMessageData.data.createMessage.id);
    } catch (e) {
      console.log(e);
    }

    setMessage("");
  };

  const onPress = () => {
    if (!message) {
      onMicrophonePress();
    } else {
      onSendPress();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={{ width: "100%" }}
    >
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <FontAwesome5 name="laugh-beam" size={24} color="grey" />
          <TextInput
            placeholder={"Type a message"}
            style={styles.textInput}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <Entypo
            name="attachment"
            size={24}
            color="grey"
            style={styles.icon}
          />
          {!message && (
            <Fontisto
              name="camera"
              size={24}
              color="grey"
              style={styles.icon}
            />
          )}
        </View>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.buttonContainer}>
            {!message ? (
              <MaterialCommunityIcons
                name="microphone"
                size={28}
                color={recording ? "red" : Colors.FG}
              />
            ) : (
              <MaterialIcons name="send" size={28} color="white" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    alignItems: "flex-end",
  },
  mainContainer: {
    flexDirection: "row",
    backgroundColor: Colors.BG,
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
    flex: 1,
    borderColor: Colors.FG,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    backgroundColor: "gray",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatInputBox;
