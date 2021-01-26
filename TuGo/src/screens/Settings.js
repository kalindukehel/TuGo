import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  getSelf as getSelfAPI,
  signOut as signOutAPI,
  toggleAccountVisilibity as toggleAccountVisilibityAPI,
  postNotificationToken as postNotificationTokenAPI,
} from "../api";
import { onSignOut } from "../auth";
import { useAuthState, useAuthDispatch } from "../context/authContext";

/*Images*/
import LikeRed from "../../assets/LikeButtonRed.svg";
import ProfileSettings from "../../assets/settings/profileSettingsIcon.svg";
import PrivacySettings from "../../assets/settings/privacySettingsIcon.svg";
import SearchHistory from "../../assets/settings/searchHistoryIcon.svg";
import LanguageSettings from "../../assets/settings/languageSettingsIcon.svg";

const Settings = ({ navigation }) => {
  const { userToken, self } = useAuthState();
  const [isPrivate, setIsPrivate] = useState();
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
            <ProfileSettings width={20} height={20} />
            <Text style={styles.title}>Profile Settings</Text>
          </View>
          <View style={styles.titleBreak} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <LikeRed width={20} height={20} />
            <Text style={styles.title}>Liked Posts</Text>
          </View>
          <View style={styles.titleBreak} />
        </View>
      </View>

      <View style={styles.headingBreak} />

      {/* setting block */}
      <View style={{ marginTop: 15, marginHorizontal: 10 }}>
        <Text style={styles.heading}>Privacy</Text>
        <View style={{ margin: 10 }}>
          <View style={styles.titleBreak} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <PrivacySettings width={20} height={20} />
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
            <Text style={{ marginRight: 5 }}>Private Account</Text>
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

      <View style={styles.headingBreak} />

      {/* setting block */}
      <View style={{ marginTop: 15, marginHorizontal: 10 }}>
        <Text style={styles.heading}>Search History</Text>
        <View style={{ margin: 10 }}>
          <View style={styles.titleBreak} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SearchHistory width={20} height={20} />
            <Text style={styles.title}>Manage your search history</Text>
          </View>
          <View style={styles.titleBreak} />
        </View>
      </View>

      <View style={styles.headingBreak} />

      {/* setting block */}
      <View style={{ marginTop: 15, marginHorizontal: 10 }}>
        <Text style={styles.heading}>Language</Text>
        <View style={{ margin: 10 }}>
          <View style={styles.titleBreak} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <LanguageSettings width={20} height={20} />
            <Text style={styles.title}>Choose your primary Language</Text>
          </View>
          <View style={styles.titleBreak} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.logout}
        onPress={async () => {
          onSignOut();
          try {
            await postNotificationTokenAPI(null, userToken, self.id);
            await signOutAPI(userToken);
            console.log("logout pressed");
            dispatch({ type: "SIGN_OUT" });
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logout: {
    backgroundColor: "#DCDCDC",
    paddingVertical: 15,
    paddingHorizontal: 80,
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 40,
    marginBottom: 20,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
  },
  titleBreak: {
    borderWidth: 0.8,
    width: "100%",
    alignSelf: "center",
    borderColor: "#DCDCDC",
    marginVertical: 10,
  },
  title: {
    fontSize: 15,
    marginLeft: 10,
  },
  headingBreak: {
    borderWidth: 2,
    width: "100%",
    alignSelf: "center",
    borderColor: "#DCDCDC",
    marginVertical: 5,
  },
});

export default Settings;
