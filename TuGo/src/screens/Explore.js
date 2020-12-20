import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import PostButton from "../../assets/PostButton.svg"

const Explore = ({ navigation }) => {

  const [search, setSearch] = useState('');

  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback 
      onPress={() => Keyboard.dismiss()}> 
      {children}
    </TouchableWithoutFeedback>
    );

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 8}}>
          <TextInput
              clearButtonMode="always"
              editable={true}
              style={{ ...styles.searchBar }}
              placeholder={"Search"}
              onChangeText={value => {
              }}
              onSubmitEditing={() => {
              }}
          />
          <TouchableOpacity
            style={{}}
            onPress={()=>{
              navigation.push("New Post");
            }}>
            <PostButton width={40} height={35} style={{}}/>
          </TouchableOpacity>
        </View>
      </View>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchBar: {
    borderRadius: 10,
    color: "black",
    borderRadius: 10,
    height: 40,
    paddingLeft: 20,
    marginRight: 10,
    borderColor: 'gray',
    backgroundColor: "#E8E8E8",
    width: '85%'
  }
});

export default Explore;
