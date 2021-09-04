import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from "react-native";
import {
  getSelf as getSelfAPI,
  signOut as signOutAPI,
  toggleAccountVisilibity as toggleAccountVisilibityAPI,
  deleteNotificationToken as deleteNotificationTokenAPI,
} from "../api";
import { onSignOut } from "../auth";
import { useAuthState, useAuthDispatch } from "../context/authContext";
import { Colors } from "../../constants";

/*Images*/
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const Settings = ({ navigation }) => {
  const { userToken, self } = useAuthState();
  const [isPrivate, setIsPrivate] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useAuthDispatch();

  useEffect(() => {
    getSelf();
  }, []);

  const getSelf = async () => {
    const res = await getSelfAPI(userToken);
    setIsPrivate(res.data.is_private);
  };

  const toggleAccountVisilibity = async () => {
    await toggleAccountVisilibityAPI(!isPrivate, userToken);
    getSelf();
  };

  return (
    <ScrollView style={styles.container}>
      {/* setting block */}
      <View style={{ marginTop: 15, marginHorizontal: 10 }}>
        <Text style={styles.heading}>Account</Text>
        <View style={{ margin: 10 }}>
          <View style={styles.titleBreak} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="account-settings"
              size={24}
              color={Colors.FG}
            />
            <Text style={styles.title}>Profile Settings</Text>
          </View>
          <View style={styles.titleBreak} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome5 name="fire" size={24} color={"red"} />
            <Text style={styles.title}>Liked Posts</Text>
          </View>
          <View style={styles.titleBreak} />
        </View>
      </View>

      {/* setting block */}
      <View style={{ marginTop: 15, marginHorizontal: 10 }}>
        <Text style={styles.heading}>Privacy</Text>
        <View style={{ margin: 10 }}>
          <View style={styles.titleBreak} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="eye-settings"
              size={24}
              color={Colors.FG}
            />
            <Text style={styles.title}>
              Manage who can view your profile and content
            </Text>
          </View>
          <View style={styles.titleBreak} />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              maxHeight: 40,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ marginRight: 5, color: Colors.text }}>
              Private Account
            </Text>
            <Switch
              value={isPrivate}
              onValueChange={() => {
                toggleAccountVisilibity();
              }}
            />
          </View>
          <View style={styles.titleBreak} />
        </View>
      </View>

      {/* setting block */}
      <View style={{ marginTop: 15, marginHorizontal: 10 }}>
        <Text style={styles.heading}>Search History</Text>
        <View style={{ margin: 10 }}>
          <View style={styles.titleBreak} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="history"
              size={24}
              color={Colors.FG}
            />
            <Text style={styles.title}>Manage your search history</Text>
          </View>
          <View style={styles.titleBreak} />
        </View>
      </View>

      {/* setting block */}
      <View style={{ marginTop: 15, marginHorizontal: 10 }}>
        <Text style={styles.heading}>Language</Text>
        <View style={{ margin: 10 }}>
          <View style={styles.titleBreak} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="language" size={24} color={Colors.FG} />
            <Text style={styles.title}>Choose your primary Language</Text>
          </View>
          <View style={styles.titleBreak} />
        </View>
      </View>
      <TouchableOpacity
        style={styles.logout}
        onPress={async () => {
          setLoading(true)
          onSignOut();
          try {
            await deleteNotificationTokenAPI(userToken, self.id);
            await signOutAPI(userToken);
            console.log("logout pressed");
            dispatch({ type: "SIGN_OUT" });
          } catch (e) {
            console.log(e);
            setLoading(false)
          }
          setLoading(false)
        }}
      >              
      {loading ? (
        <ActivityIndicator
          animating={true}
          size="small"
          color={Colors.complimentText}
        />
      ) : (
        <Text style={{ color: Colors.complimentText }}>Logout</Text>
      )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG,
  },
  logout: {
    height: 40,
    marginHorizontal: 60,
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray,
    marginBottom: 15
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.text,
  },
  titleBreak: {
    borderWidth: 0.8,
    width: "100%",
    alignSelf: "center",
    borderColor: "#DCDCDC",
    marginVertical: 10,
    color: Colors.FG,
  },
  title: {
    fontSize: 15,
    marginLeft: 10,
    color: Colors.text,
  },
  headingBreak: {
    borderWidth: 2,
    width: "100%",
    alignSelf: "center",
    borderColor: "#DCDCDC",
    marginVertical: 5,
    color: Colors.FG,
  },
});

export default Settings;
