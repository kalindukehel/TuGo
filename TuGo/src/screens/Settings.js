import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Switch,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
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
import { Auth, API, graphqlOperation } from "aws-amplify";
import { updateUser } from "../graphql/mutations";

/*Images*/
import { FontAwesome5, FontAwesome, AntDesign } from "@expo/vector-icons";
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

    //toggle confirmation alert function
    const toggleConfirmation = (desired) =>
    Alert.alert(
      "Confirmation",
      `Are you sure you want to go ${desired}?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            toggleAccountVisilibity();
          },
        },
      ],
      { cancelable: false }
    );

  const toggleAccountVisilibity = async () => {
    await toggleAccountVisilibityAPI(!isPrivate, userToken);
    getSelf();
  };

  return (
    <ScrollView style={styles.container}>
      {/* setting block */}
      <View style={{ marginTop: 15, marginHorizontal: 10 }}>
        <Text style={styles.heading}>Account</Text>
        <View style={{ margin: 20 }}>
          {/* <View style={styles.titleBreak} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="account-settings"
              size={24}
              color={Colors.FG}
            />
            <Text style={styles.title}>Profile Settings</Text>
          </View> */}
          {/* <View style={styles.titleBreak} /> */}
          <TouchableWithoutFeedback 
            onPress={() => {
              navigation.push("Liked")}}
            >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome5 name="fire" size={24} color={"red"} />
            <Text style={styles.title}>Liked Posts</Text>
          </View>
          </TouchableWithoutFeedback>
          {/* <View style={styles.titleBreak} /> */}
        </View>
      </View>

      {/* setting block */}
      <View style={{ marginTop: 15, marginHorizontal: 10 }}>
        <Text style={styles.heading}>Privacy</Text>
        <View style={{ margin: 20 }}>
          {/* <View style={styles.titleBreak} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="eye-settings"
              size={24}
              color={Colors.FG}
            />
            <Text style={styles.title}>
              Manage who can view your profile and content
            </Text>
          </View> */}
          {/* <View style={styles.titleBreak} /> */}
          <View
            style={{
              flexDirection: "row", alignItems: "center" 
            }}
          >
            <FontAwesome name="lock" size={24} color={Colors.FG} />
            <Text style={styles.title}>
              Private Account
            </Text>
            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
              <Switch
                style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                value={isPrivate}
                onChange={() => {
                  toggleConfirmation(isPrivate ? 'public' : 'private');
                }}
              />
            </View>
          </View>
          {/* <View style={styles.titleBreak} /> */}
        </View>
      </View>

      {/* setting block */}
      {/* <View style={{ marginTop: 15, marginHorizontal: 10 }}>
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
      </View> */}

      {/* setting block */}
      <View style={{ marginTop: 15, marginHorizontal: 10 }}>
        <Text style={styles.heading}>About</Text>
        <View style={{ margin: 20 }}>
          {/* <View style={styles.titleBreak} /> */}
          <TouchableWithoutFeedback 
            onPress={() => {
              navigation.push("Policies")}}
            >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign name="infocirlce" size={24} color={Colors.FG} />
            <Text style={styles.title}>Terms of use and privacy policy</Text>
          </View>
          </TouchableWithoutFeedback>
          {/* <View style={styles.titleBreak} /> */}
        </View>
      </View>
      <TouchableWithoutFeedback
        onPress={async () => {
          setLoading(true)
          onSignOut();
          try {
            const update = {
              id: self.id,
              expoPushToken: null
            }
            const chatRoomData = await API.graphql(
              graphqlOperation(updateUser, { input: update })
            );
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
      <View style={styles.logout}>
        {loading ? (
          <ActivityIndicator
            animating={true}
            size="small"
            color={Colors.complimentText}
          />
        ) : (
          <Text style={{ color: Colors.complimentText }}>Logout</Text>
        )}
      </View>          
      </TouchableWithoutFeedback>
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
    marginVertical: 15,
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
