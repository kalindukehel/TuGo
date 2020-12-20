import React, {useState, useEffect} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { onSignOut } from "../auth";
import { useAuthDispatch } from "../context/authContext";
import { signOut as signOutAPI } from "../api";
import { useAuthState } from "../context/authContext";
import { Entypo } from '@expo/vector-icons';
import Activity from "./Activity"

const Feed = ({ navigation }) => {
  const { userToken } = useAuthState();
  const dispatch = useAuthDispatch();

  const [showModal, setShowModal] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{marginLeft: 20}}
          onPress={()=>{
            navigation.navigate("Activity");
          }}>
          <Entypo name="notification" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <>
      {showModal && <Activity showModal={showModal} setShowModal={setShowModal}/>}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}></View>
    </>
  );
};

export default Feed;
