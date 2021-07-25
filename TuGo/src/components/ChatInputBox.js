import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { API, Auth, graphqlOperation } from "aws-amplify";

import { createMessage, updateChatRoom } from "../graphql/mutations";
import { getChatRoom, getUser } from "../screens/Direct/queries";

import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";
import { useAuthState } from "../context/authContext";
import { Colors, appTheme } from "../../constants";

//audio for recording messages
import { Audio } from "expo-av";
import { Dimensions } from "react-native";

const sound = new Audio.Sound();

const ChatInputBox = (props) => {
  const { chatRoomID } = props;
  const { self } = useAuthState();
  const insets = useSafeAreaInsets();
  let animation = useRef(new Animated.Value(0));
  const [recordedAnimation, setRecordingAnimated] = useState(
    new Animated.Value(0)
  );
  console.log(chatRoomID);
  const [message, setMessage] = useState("");
  const [myUserId, setMyUserId] = useState(null);
  const [recording, setRecording] = useState();
  const [recordingUri, setRecordingUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

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
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function onStopRecording() {
    await sound.unloadAsync();
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingUri(uri);
    animatedRecordingDone();
  }

  async function onPlaySound() {
    await sound.playAsync();
    setIsPlaying(true);
  }

  const loadSound = async () => {
    try {
      await sound.loadAsync({ uri: recordingUri });
      sound.setProgressUpdateIntervalAsync(50);
      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (playbackStatus.didJustFinish) onStopSound();
        setProgress(
          playbackStatus.positionMillis / playbackStatus.durationMillis
        );
      });
    } catch (e) {
      console.log("error1");
    }
  };

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const animatedRecordingDone = () => {
    Animated.timing(recordedAnimation, {
      toValue: 0.7 * Dimensions.get("window").width,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  let width = animation.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (recordingUri) {
      loadSound();
    }
  }, [recordingUri]);

  async function onStopSound() {
    await sound.stopAsync();
    setIsPlaying(false);
  }

  async function onPauseSound() {
    await sound.pauseAsync();
    setIsPlaying(false);
  }

  function onPlayRecording() {
    if (recordingUri) {
      if (isPlaying) {
        onPauseSound();
      } else {
        onPlaySound();
      }
    }
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

  const onSendVoice = async () => {
    try {
      const newMessageData = await API.graphql(
        graphqlOperation(createMessage, {
          input: {
            content: recordingUri,
            userID: myUserId,
            chatRoomID,
            type: "VOICE",
            seen: 0,
          },
        })
      );
      await updateChatRoomLastMessage(newMessageData.data.createMessage.id);
    } catch (e) {
      console.log(e);
    }

    setRecordingUri(null);
  };
  const onSendText = async () => {
    try {
      //to update last message
      const newMessageData = await API.graphql(
        graphqlOperation(createMessage, {
          input: {
            content: message,
            userID: myUserId,
            chatRoomID,
            type: "TEXT",
            seen: 0,
          },
        })
      );
      await updateChatRoomLastMessage(newMessageData.data.createMessage.id);

      // update seen list
      let seen = []
      seen.push(self.id)
      const chatRoomData = await API.graphql(
        graphqlOperation(updateChatRoom, {
          input: {
            id: chatRoomID,
            seen: seen
          },
        })
      );


      // const notifRes = await pushNotificationAPI(
      //   author.notification_token,
      //   {creator: self.username, content: message},
      //   "message"
      // );
    } catch (e) {
      console.log(e);
    }

    setMessage("");
  };

  const onPress = () => {
    if (!(message || recordingUri)) {
      onMicrophonePress();
    } else if (recordingUri) {
      onSendVoice();
    } else {
      onSendText();
    }
  };

  const clearRecording = () => {
    setRecordingAnimated(new Animated.Value(0));
    setRecordingUri(null);
  };

  const barWidth = useRef();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={65 + insets.bottom}
    >
      <View style={styles.container}>
        {/* {recordingUri ? (
          <>
            <TouchableOpacity onPress={clearRecording}>
              <AntDesign name="closecircle" size={24} color={Colors.FG} />
            </TouchableOpacity>

            <Animated.View
              style={{ ...styles.progressBar, width: recordedAnimation }}
              onLayout={(event) => {
                barWidth.current = event.nativeEvent.layout.width;
              }}
            >
              <Animated.View
                style={
                  ([StyleSheet.absoluteFill],
                  {
                    backgroundColor: "#8BED4F",
                    width: progress ? progress * barWidth.current : 0,
                    borderRadius: 5,
                  })
                }
              />
            </Animated.View>

            <TouchableOpacity onPress={onPlayRecording}>
              {isPlaying ? (
                <AntDesign name="pause" size={24} color={Colors.FG} />
              ) : (
                <AntDesign name="play" size={24} color={Colors.FG} />
              )}
            </TouchableOpacity>
          </>
        ) : ( */}
          <>
            <View style={styles.mainContainer}>
              <TextInput
                placeholder={"Send a message"}
                placeholderTextColor={Colors.text}
                style={styles.textInput}
                multiline
                value={message}
                onChangeText={setMessage}
                keyboardAppearance={appTheme}
                color={Colors.text}
              />
              <TouchableOpacity onPress={onPress} style={{marginBottom: 3}}>
                <View style={{ marginRight: 5 }}>
                    <MaterialCommunityIcons
                      name="send-circle"
                      size={30}
                      color={message ? Colors.primary : Colors.FG}
                    />
                </View>
              </TouchableOpacity>
            </View>
          </>
        {/* )} */}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    justifyContent: "space-between",
  },
  mainContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.contrastGray,
    borderRadius: 20,
    margin: 5,
    maxHeight: 100
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    backgroundColor: Colors.BG,
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    flexDirection: "row",
    height: 4,
    backgroundColor: Colors.FG,
    borderRadius: 5,
  },
});

export default ChatInputBox;
