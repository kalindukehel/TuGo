import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { API_URL, Colors } from "../../constants";
import GText from "./GText"

var { width, height } = Dimensions.get("window");
const maxlimit = 20;

const AccountTile = (props) => {
  const { account, navigation } = props;
  return (
    <TouchableOpacity
      style={styles.followElement}
      onPress={() => {
        navigation.push("Profile", {
          id: account.id,
        });
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        <Image
          source={{ uri: API_URL + account.profile_picture }}
          style={{
            width: height / 20,
            height: height / 20,
            borderRadius: 999,
            borderWidth: 1,
          }}
        ></Image>
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            marginLeft: 15,
          }}
        >
          <GText style={{ fontWeight: "bold", color: Colors.text }}>
            {account.username.length > maxlimit
              ? account.username.substring(0, maxlimit - 3) + "..."
              : account.username}
          </GText>
          <GText style={{ color: Colors.text }}>
            {account.username.length > maxlimit
              ? account.name.substring(0, maxlimit - 3) + "..."
              : account.name}
          </GText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  textInputStyle: {
    height: 40,
    paddingLeft: 20,
    margin: 5,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    color: Colors.complimentText,
  },
  followButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.complimentText,
    padding: 3,
  },
  followButtonText: {
    alignSelf: "flex-end",
  },
  followElement: {
    flex: 1,
    padding: 10,
  },
});

export default AccountTile;
