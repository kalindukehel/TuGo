import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import MentionsTextInput from "react-native-mentions";
import {
  searchUsers as searchUsersAPI,
  getAccounts as getAccountsAPI,
} from "../api";
import { useAuthState } from "../context/authContext";

const { height, width } = Dimensions.get("window");

export const Tags = () => {
  const [value, setValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [data, setDate] = useState([]);
  const { userToken, self } = useAuthState();
  const [reqTimer, setReqTimer] = useState(0);

  //   constructor() {
  //     super();
  //     this.state = {
  //       value: "",
  //       keyword: "",
  //       data: [],
  //     };
  //     this.reqTimer = 0;
  //     this.userToken = useAuthState();
  //   }

  function renderSuggestionsRow({ item }, hidePanel) {
    return (
      <TouchableOpacity
        onPress={() => onSuggestionTap(item.username, hidePanel)}
      >
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <Text style={styles.usernameInitials}>
              {!!item.DisplayName &&
                item.DisplayName.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.DisplayName}</Text>
            <Text style={styles.usernameText}>@{item.UserName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function onSuggestionTap(username, hidePanel) {
    hidePanel();
    const comment = value.slice(0, -keyword.length);
    setDate([]);
    setValue(comment + "@" + username);
  }

  const callback = React.useCallback(() => {
    if (reqTimer) {
      clearTimeout(reqTimer);
    }

    reqTimer = setTimeout(() => {
      searchUsersAPI(keyword, userToken)
        .then((data) => {
          this.setState({
            keyword: keyword,
            data: [...data],
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 200);
  }, []);

  return (
    <View style={styles.container}>
      <Text
        onPress={() => {
          setValue("");
        }}
      >
        Clear textbox
      </Text>

      <MentionsTextInput
        textInputStyle={{
          borderColor: "#ebebeb",
          borderWidth: 1,
          padding: 5,
          fontSize: 15,
        }}
        suggestionsPanelStyle={{ backgroundColor: "rgba(100,100,100,0.1)" }}
        loadingComponent={() => (
          <View
            style={{
              flex: 1,
              width,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        )}
        textInputMinHeight={30}
        textInputMaxHeight={80}
        trigger={"@"}
        triggerLocation={"new-word-only"} // 'new-word-only', 'anywhere'
        value={this.state.value}
        onChangeText={(val) => {
          setValue(val);
        }}
        triggerCallback={callback}
        renderSuggestionsRow={renderSuggestionsRow}
        suggestionsData={data} // array of objects
        keyExtractor={(item, index) => item.username}
        suggestionRowHeight={45}
        horizontal={false} // defaut is true, change the orientation of the list
        MaxVisibleRowCount={3} // this is required if horizontal={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: "flex-end",
    paddingTop: 100,
  },
  suggestionsRowContainer: {
    flexDirection: "row",
  },
  userAvatarBox: {
    width: 35,
    paddingTop: 2,
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#54c19c",
  },
  usernameInitials: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 15,
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: "500",
  },
  usernameText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
  },
});
