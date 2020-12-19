import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput
  } from "react-native";
  import {
    getPostLikes as getPostLikesAPI,
    by_ids as by_idsAPI,
  } from "../api";
  import { useAuthState } from "../context/authContext";
  import { API_URL } from "../../constants";
  import { FlatList } from "react-native-gesture-handler";

  var { width, height } = Dimensions.get("window");  

  const maxlimit = 20;
  

const Likes = (props) => {
    const { navigation } = props;
    const {postId} = props.route.params
    const { userToken, self } = useAuthState();
    const [filteredData, setFilteredData] = useState([]);
    const [masterData, setMasterData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    let list = [];

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        async function getPostStates() {
          const likesRes = await getPostLikesAPI(userToken, postId);
          list = likesRes.data.map(item => item.author);
          const res = await by_idsAPI(list, userToken);
          setFilteredData(res.data);
          setMasterData(res.data);
        }
        await getPostStates();
        setRefreshing(false);
      }, []);
      useEffect(() => {
        onRefresh();
      }, []);

      const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = masterData.filter(function (item) {
            // Applying filter for the inserted text in search bar
            const usernameData = item.username
                ? item.username.toUpperCase()
                : ''.toUpperCase();
            const nameData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
            const textData = text.toUpperCase();
            return usernameData.indexOf(textData) > -1 || nameData.indexOf(textData) > -1 ;
            });
            setFilteredData(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterData
            setFilteredData(masterData);
            setSearch(text);
        }
    };

    const renderItem = (item) => {
      let follow = item.item;
      return(
        <TouchableOpacity
          style={styles.followElement}
          onPress={()=>{
            navigation.push("Profile", {
              id: follow.id,
            });
          }}>
          <View
            style={{flexDirection: "row", alignContent: "center"}}>
              <Image
                source={{ uri: API_URL + follow.profile_picture }}
                style={{ width: height/20, height: height/20, borderRadius: 5, borderWidth: 1 }}
              ></Image>
              <View
                style={{flexDirection: "column", flex: 1, alignItems: "flex-start", marginLeft: 15}}>
                <Text
                  style={{fontWeight: "bold"}}>{ ((follow.username).length > maxlimit) ? 
                    (((follow.username).substring(0,maxlimit-3)) + '...') : 
                    follow.username }
                </Text>
                <Text
                  style={{}}>{ ((follow.username).length > maxlimit) ? 
                    (((follow.name).substring(0,maxlimit-3)) + '...') : 
                    follow.name }
                </Text>
              </View>
  
          </View>
        </TouchableOpacity>
      )
    }

    const ItemSeparatorView = () => {
      return (
        // Flat List Item Separator
        <View
          style={{
            height: 5,
            width: '90%',
            backgroundColor: '#C8C8C8',
            alignSelf: "center"
          }}
        />
      );
    };

    return(
      <View
      style={styles.container}
    >
      <TextInput
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        placeholder="Search"
        placeholderTextColor="white"
      />
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={renderItem}
        keyboardDismissMode={'on-drag'}
      />
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: 'gray',
    backgroundColor: "#065581",
    borderRadius: 10,
    color: "white"
  },
  followButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "white",
    padding: 3
  },
  followButtonText: {
    alignSelf: "flex-end"
  },
  followElement: {
    flex: 1,
    borderColor: "#C8C8C8",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 20, 
    borderRadius: 20
  }
});
  

export default Likes;

