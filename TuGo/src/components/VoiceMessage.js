import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import moment from "moment";
import { useAuthState } from "../context/authContext";
import { usePlayerState, usePlayerDispatch } from "../context/playerContext";
import { Colors } from "../../constants";
import { Audio } from "expo-av";
import { Entypo, AntDesign } from "@expo/vector-icons";
import ProgressCircle from "react-native-progress-circle";

const VoiceMessage = (props) => {
  const { message } = props;
  const { soundObj, playingId, isPlaying } = usePlayerState(); //Use global soundObj from Redux state
  const playerDispatch = usePlayerDispatch();
  const { self } = useAuthState();
  const [loading, setLoading] = useState(false);

  const playingIdRef = useRef();
  const isLoaded = useRef(false);

  const [progress, setProgress] = useState(0);

  const isMyMessage = () => {
    return message.user.id == self.id;
  };

  const loadSound = async () => {
    const sound_url = message.content;
    try {
      if (!(await soundObj.getStatusAsync()).isLoaded && sound_url) {
        const res = await soundObj.loadAsync({
          uri: sound_url,
        });
        isLoaded.current = true;
        playerDispatch({
          type: "LOAD_VOICE",
          voiceUrl: sound_url,
          id: message.id,
        });
        await soundObj.setProgressUpdateIntervalAsync(50);
        await soundObj.setOnPlaybackStatusUpdate(async (status) => {
          if (isLoaded.current) {
            if (status.didJustFinish && status.isLoaded) {
              playerDispatch({ type: "PAUSE" });
              soundObj.stopAsync();
            } else if (status.isLoaded) {
              setProgress(status.positionMillis / status.durationMillis);
            }
          }
        });
      }
    } catch (error) {
      console.log("error1");
    }
  };

  useEffect(() => {
    playingIdRef.current = playingId;
  }, [playingId]);

  async function doPlay() {
    try {
      //If current post is different from current playing, unload player and load new
      if (message.id != playingIdRef.current) {
        playerDispatch({ type: "UNLOAD_VOICE" });
        await soundObj.unloadAsync();
        setLoading(true);
        await loadSound();
        setLoading(false);
        await soundObj.playAsync();
        playerDispatch({ type: "PLAY" });
      } else {
        if (isPlaying) {
          //if current post is playing
          await soundObj.pauseAsync();
          playerDispatch({ type: "PAUSE" });
        } else {
          // setLoadingPlayer(true);
          // await loadSound();
          // setLoadingPlayer(false);
          await soundObj.playAsync();
          playerDispatch({ type: "PLAY" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (message.content) {
      loadSound();
    }
  }, []);

  const barWidth = useRef();
  return (
    <View
      style={{
        ...styles.container,
        justifyContent: isMyMessage() ? "flex-end" : "flex-start",
      }}
    >
      {!isMyMessage() && (
        <Image
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            marginRight: 10,
          }}
          source={{ uri: message.user.imageUri }}
        />
      )}
      <View
        style={[
          styles.messageBox,
          {
            backgroundColor: isMyMessage()
              ? Colors.primary
              : Colors.otherMessageBubble,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={doPlay} style={{}}>
            <ProgressCircle
              percent={progress * 100}
              radius={30}
              borderWidth={2}
              color="red"
              shadowColor={Colors.gray}
              bgColor={Colors.primary}
            >
              {isPlaying && playingId === message.id ? (
                <AntDesign name="pause" size={24} color={Colors.FG} />
              ) : (
                <Entypo name="controller-play" size={24} color={Colors.FG} />
              )}
            </ProgressCircle>
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.time}>{moment(message.createdAt).fromNow()}</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageBox: {
    borderRadius: 20,
    padding: 10,
  },
  name: {
    color: Colors.text,
    fontWeight: "bold",
    marginBottom: 5,
  },
  message: {},
  time: {
    alignSelf: "flex-end",
    color: "grey",
    fontSize: 10,
  },
  progressBar: {
    // flexDirection: "row",
    // height: 10,
    // backgroundColor: Colors.FG,
    // borderRadius: 5,
    // width: "45%",
    // borderRadius: 999,
    // marginLeft: 20,
    alignItems: "center",
    width: 100,
    height: 100,
    borderWidth: 2,
    borderRadius: 100,
    borderColor: "grey",
    justifyContent: "center",
    borderBottomRightRadius: 50,
    backgroundColor: "red",
  },
});

export default VoiceMessage;
