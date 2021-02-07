import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { API_URL } from "../../constants";

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
      <View style={{ flexDirection: "row", alignContent: "center" }}>
        <Image
          source={{ uri: API_URL + account.profile_picture }}
          style={{
            width: height / 20,
            height: height / 20,
            borderRadius: "50%",
            borderWidth: 1,
          }}
        ></Image>
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            alignItems: "flex-start",
            marginLeft: 15,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            {account.username.length > maxlimit
              ? account.username.substring(0, maxlimit - 3) + "..."
              : account.username}
          </Text>
          <Text style={{}} account>
            {account.username.length > maxlimit
              ? account.name.substring(0, maxlimit - 3) + "..."
              : account.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textInputStyle: {
    height: 40,
    paddingLeft: 20,
    margin: 5,
    backgroundColor: "#065581",
    borderRadius: 10,
    color: "white",
  },
  followButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "white",
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
