import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { onSignOut } from "../auth";
import { useAuthDispatch } from "../context/authContext";
import { signOut as signOutAPI } from "../api";
import { useAuthState } from "../context/authContext";
import { Entypo } from '@expo/vector-icons';

const Activity = (props) => {
  const { showModal , setShowModal } = props
  const { userToken } = useAuthState();
  const dispatch = useAuthDispatch();

  return (
    <View
        style={styles.container}>
            <Text>
                Activity
            </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
  });

export default Activity;
