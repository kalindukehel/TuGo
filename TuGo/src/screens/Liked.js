import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList
} from "react-native";
import {
    userLikes as userLikesAPI
} from "../api"
import {Colors} from '../../constants'
import { useAuthState } from "../context/authContext";
import { Dimensions } from "react-native";
import SongBlock from "../components/Explore/SongBlock"

const { width, height } = Dimensions.get('window')

const Liked = ({navigation}) => {
    const [allLiked, setAllLiked] = useState([])
    const { userToken } = useAuthState()
    const [loading, setLoading] = useState(false);

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

    const renderItem = ({ item }) => {
        return (
            <SongBlock postId={item.post} navigation={navigation} columns={2} blockHeight={160} blockWidth={160}/>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={{ flexGrow: 1 }}
                contentContainerStyle={{
                flexGrow: 1,
                alignItems: "center",
                }}
                data={allLiked}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id.toString()}
                onRefresh={loading}
                numColumns={2}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.BG,
    },
  });

export default Liked