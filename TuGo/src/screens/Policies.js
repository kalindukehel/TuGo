import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  SafeAreaView
} from "react-native";
import {
    userLikes as userLikesAPI
} from "../api"
import {Colors} from '../../constants'
import { useAuthState } from "../context/authContext";
import { Dimensions } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import WebView from "react-native-webview";


const { width, height } = Dimensions.get('window')

const Policies = ({navigation}) => {
    const [allLiked, setAllLiked] = useState([])
    const { userToken } = useAuthState()
    const [loading, setLoading] = useState(false);
    const [isSelected, setIsSelected] = useState(false)

    const refRBSheet1 = useRef();
    const refRBSheet2 = useRef();

    const onRefresh = useCallback(() => {
        setLoading(true);
        async function getLiked() {
            const likedRes = await userLikesAPI(userToken)
            setAllLiked(likedRes.data)
        }
        getLiked();
        setLoading(false);
    }, []);

    useEffect(() => {
        onRefresh()
    }, [])

    return (
        <View style={styles.container}>
            <View style={{margin: 20}}>
                {/* <TouchableWithoutFeedback>
                <View style={{borderColor: 'red', borderWidth: 1, height: 20, width: 20}}/>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                <View style={{borderColor: 'red', borderWidth: 1, height: 20, width: 20, marginTop: 20}}/>
                </TouchableWithoutFeedback> */}
                <TouchableWithoutFeedback
                    onPress={() => {
                    refRBSheet1.current.open();
                    }}
                >
                    <Text style={{color: Colors.primary, marginBottom: 10, fontSize: 18}}>Youtube Terms of Service</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => {
                        refRBSheet2.current.open();
                    }}
                >
                    <Text style={{color: Colors.primary, fontSize: 18}}>Google Privacy policy</Text>
                </TouchableWithoutFeedback>
                <RBSheet
                    height={height * 0.8}
                    ref={(ref) => {
                    //set RBSheet array index equal to this object
                    refRBSheet1.current = ref;
                    }}
                    closeOnDragDown={false}
                    closeOnPressMask={true}
                    customStyles={{
                    wrapper: {
                        backgroundColor: "transparent",
                    },
                    draggableIcon: {
                        backgroundColor: Colors.FG,
                    },
                    container: {
                        backgroundColor: Colors.BG,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: Colors.FG,
                    },
                    }}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                    <WebView
                        style={{ borderColor: Colors.text }}
                        javaScriptEnabled={true}
                        allowsInlineMediaPlayback={true}
                        source={{
                        uri: "https://www.youtube.com/t/terms",
                        }}
                    />
                    </SafeAreaView>
                </RBSheet>
                <RBSheet
                    height={height * 0.8}
                    ref={(ref) => {
                    //set RBSheet array index equal to this object
                    refRBSheet2.current = ref;
                    }}
                    closeOnDragDown={false}
                    closeOnPressMask={true}
                    customStyles={{
                    wrapper: {
                        backgroundColor: "transparent",
                    },
                    draggableIcon: {
                        backgroundColor: Colors.FG,
                    },
                    container: {
                        backgroundColor: Colors.BG,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: Colors.FG,
                    },
                    }}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                    <WebView
                        style={{ borderColor: Colors.text }}
                        javaScriptEnabled={true}
                        allowsInlineMediaPlayback={true}
                        source={{
                        uri: "https://policies.google.com/privacy",
                        }}
                    />
                    </SafeAreaView>
                </RBSheet>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.BG,
    },
  });

export default Policies