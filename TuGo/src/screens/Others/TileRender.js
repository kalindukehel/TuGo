import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Alert,
  Keyboard,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuthState } from "../../context/authContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    deleteTile as deleteTileAPI,
} from "../../api";
import { API, graphqlOperation } from "aws-amplify";
import {
  createChatRoom,
  createChatRoomUser,
  createMessage,
  updateChatRoom,
} from "../../graphql/mutations";
import { getUser } from "../Direct/queries";
import { listUsers } from "../../graphql/queries";
import WebView from "react-native-webview";

//icons
import { Foundation, Feather, AntDesign } from "@expo/vector-icons";
import { Colors } from "../../../constants";

var { width, height } = Dimensions.get("window");

const TileRender = ({ url, tileModal, isAuthor, tileId, postId }) => {
  const insets = useSafeAreaInsets();

  const { userToken, self } = useAuthState();
  const [showFull, setShowFull] = useState(false);
  const [scrollEnable, setScrollEnable] = useState(false)
  const [webViewY, setWebViewY] = useState(0)
  const _bottomSheetOffsetY = React.useMemo(() => new Animated.Value(0), []);
  const _bottomSheetAnim = React.useMemo(() => new Animated.Value(0), []);
  let WebViewRef;
  const ref = useRef({
    bottomSheetHeight: 0,
    preOffsetY: 0,
  });
  const STATUS_BAR_HEIGHT = 10 + insets.top;

    //delete tile confirmation alert function
    const deleteTileConfirmation = (tileId) =>
    Alert.alert(
      "Confirmation",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteTile(tileId);
          },
        },
      ],
      { cancelable: false }
    );

  //delete tile async function
  const deleteTile = async (tileId) => {
    try{
      const res = await deleteTileAPI(postId, tileId, userToken);
      tileModal.current.close();
    }
    catch(e){
      if (res.status === 400) {
        errorDispatch({type: 'REPORT_ERROR', message: "Video tile could not be deleted"})
      }
      else{
        errorDispatch({type: 'REPORT_ERROR', message: "Something went wrong, please try again."})
      }
    }
  };

  const _onGestureEventHandler = ({ nativeEvent: { translationY } }) => {
    if (translationY < -(0.4 * height - STATUS_BAR_HEIGHT)) return;
    _bottomSheetOffsetY.setValue(ref.current.preOffsetY + translationY);
  };
  const _onStateChangeHandler = ({ nativeEvent: { translationY, state } }) => {
    if (state === State.END) {
      if (ref.current.preOffsetY + translationY > height * 0.3) {
        Animated.timing(_bottomSheetOffsetY, {
          toValue: ref.current.bottomSheetHeight,
          useNativeDriver: true,
          duration: 150,
        }).start(() => {
          tileModal.current.close();
        });
      } else if (ref.current.preOffsetY + translationY < 0) {
        const offsetY = Math.abs(ref.current.preOffsetY + translationY);
        if (offsetY > height * 0.2) {
          Animated.timing(_bottomSheetAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
          Animated.spring(_bottomSheetOffsetY, {
            toValue: -height * 0.4 + STATUS_BAR_HEIGHT,
            useNativeDriver: true,
          }).start();
          setShowFull(true);
          setScrollEnable(true)
          ref.current.preOffsetY = -height * 0.4 + STATUS_BAR_HEIGHT;
        } else {
          Animated.timing(_bottomSheetAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
          Animated.spring(_bottomSheetOffsetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setShowFull(false);
          setScrollEnable(false)
          ref.current.preOffsetY = 0;
          Keyboard.dismiss();
        }
      } else {
        Animated.timing(_bottomSheetAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        ref.current.preOffsetY = 0;
        Animated.spring(_bottomSheetOffsetY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Keyboard.dismiss();
      }
    }
  };
  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          tileModal.current.close();
        }}
        style={{
          height: "100%",
          width: "100%",
        }}
      ></TouchableOpacity>
      <PanGestureHandler
        onGestureEvent={_onGestureEventHandler}
        onHandlerStateChange={_onStateChangeHandler}
      >
        <Animated.View
          onLayout={({
            nativeEvent: {
              layout: { height },
            },
          }) => {
            ref.current.bottomSheetHeight = height;
          }}
          style={{
            ...styles.bottomSheet,
            borderTopLeftRadius: _bottomSheetAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            }),
            borderTopRightRadius: _bottomSheetAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            }),
            shadowOpacity: _bottomSheetAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.25, 0],
            }),
            shadowRadius: _bottomSheetAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 1],
            }),
            transform: [
              {
                translateY: _bottomSheetOffsetY,
              },
            ],
          }}
        >

            <View>
                <View
                style={{
                    width: "100%",
                    height: "100%",
                }}
                >
                <View style={{backgroundColor: Colors.contrastGray, borderRadius: 20, height: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>

                {isAuthor && <TouchableOpacity
                    style={{ }}
                    onPress={() => {
                    deleteTileConfirmation(tileId);
                    }}
                >
                    <Feather name="trash-2" size={24} color="red" />
                </TouchableOpacity>}
                <TouchableOpacity
                    style={{}}
                    onPress={() => {
                    WebViewRef && WebViewRef.reload();
                    }}
                >
                    <Foundation name="refresh" size={30} color={Colors.primary} />
                </TouchableOpacity>
                </View>
                <WebView
                    ref={(WEBVIEW_REF) => (WebViewRef = WEBVIEW_REF)}
                    scrollEnabled={scrollEnable}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsInlineMediaPlayback={true}
                    source={{ uri: url }}
                    onScroll={syntheticEvent => {
                      const { contentOffset } = syntheticEvent.nativeEvent
                      setScrollEnable( showFull && webViewY === 0 && contentOffset.y < webViewY ? false : true)
                    }}
                >
                </WebView>
                </View>
            </View>
        </Animated.View>
      </PanGestureHandler>
    </SafeAreaView>
  );
};

export default TileRender;

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: Colors.contrastGray,
    opacity: 1,
    paddingBottom: 40,
    position: "absolute",
    zIndex: 1,
    top: height * 0.4,
    left: 0,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },

    elevation: 5,
    height: height,
  },
  titleWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  optionItem: {
    flexDirection: "row",
    height: 44,
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
  },
  messageInputWrapper: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 15,
    minHeight: 50,
    width: "100%",
  },
  messageInput: {
    minHeight: 30,
    width: width - 30 - 50,
    paddingHorizontal: 15,
    color: "white",
  },
  previewImage: {
    borderColor: "#ddd",
    borderWidth: 1,
    height: 50,
    width: 50,
    borderRadius: 5,
  },
  body: {
    padding: 15,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchBtn: {
    width: 36,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    height: "100%",
    width: width - 30 - 36 * 2,
    color: "white",
  },
  receiverItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-between",
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 44,
    borderWidth: 0.3,
    borderColor: "#333",
  },
  btnSend: {
    width: 64,
    height: 24,
    borderRadius: 3,

    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ddd",
  },
});