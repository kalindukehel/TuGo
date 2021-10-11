import React, { useState, useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  SafeAreaView,
  Linking
} from "react-native";
import { signUp as signUpAPI, 
signIn as SignInApi,
isValidEmail as isValidEmailAPI,
isValidUsername as isValidUsernameAPI,
isValidPassword as isValidPasswordAPI } from "../api";
import { onSignIn } from "../auth";
import { useAuthDispatch } from "../context/authContext";
import { Colors, appTheme } from "../../constants";
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from "expo-haptics";

let {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end",
    marginTop: "25%",
  },
  header: {
    fontSize: 50,
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    color: Colors.complimentText,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    width: '90%'
  },
  button: {
    alignItems: "center",
    marginTop: 30,
    marginHorizontal: 60,
    padding: 10,
    borderRadius: 30,
    //backgroundColor: Colors.FG,
  },
});

const SignIn = ({ navigation }) => {
  const dispatch = useAuthDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState(true);
  const [emailCheck, setEmailCheck] = useState(true);
  const [passwordCheck, setPasswordCheck] = useState(true);
  const [enabled, setEnabled] = useState(true)

  const refRBSheet1 = useRef();
  const refRBSheet2 = useRef();

  useEffect(() => {
    setEnabled(usernameCheck && emailCheck && name && password && username && email)
  },[username, email, usernameCheck, emailCheck, name, password])

  async function signup() {
    try {
      setLoading(true)
      const data = {
        username: username,
        password: password,
        email: email,
        name: name,
      };
      const signUpRes = await signUpAPI(data);
      const signInRes = await SignInApi({
        username: data.username,
        password: data.password,
      });
      onSignIn(signInRes.data.token);
      dispatch({ type: "SIGN_IN", token: signInRes.data.token });
    } catch (error) {
      errorDispatch({type: 'REPORT_ERROR', message: "Something went wrong, please try again."})
      setLoading(false)
    }
    setLoading(false)
  }

  useEffect(()=>{
    onChangeEmail('')
    onChangeUsername('')
    onChangePassword('')
  },[])

  const onChangeEmail = async (text) => {
      setEmail(text)
      const res = await isValidEmailAPI(text)
      console.log("email")
      setEmailCheck(res.data.available)
  }
  
  const onChangeUsername = async (text) => {
      setUsername(text)
      const res = await isValidUsernameAPI(text)
      console.log("username")
      setUsernameCheck(res.data.available)
  }

  const onChangePassword = async (text) => {
    setPassword(text)
    console.log('password is: ', text)
    const res = await isValidPasswordAPI(text)
    console.log('password')
    setPasswordCheck(res.data.available)
}

  const OpenURLButton = ({ url, children }) => {
    const handlePress = React.useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <TouchableOpacity onPress={handlePress}><Text style={{color: Colors.primary}}>{children}</Text></TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={50}
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.header}>SignUp</Text>
            <TextInput
              keyboardAppearance={appTheme}
              onChangeText={(name) => setName(name)}
              placeholder="Enter Name"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              style={styles.input}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                keyboardAppearance={appTheme}
                onChangeText={onChangeUsername}
                placeholder="Enter Username"
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                style={styles.input}
              />        
              {username === '' ? null : usernameCheck === true ? 
                <AntDesign name="checkcircle" size={20} color={"black"} /> : 
                <AntDesign name="closecircle" size={20} color={"black"} />}
            </View>
            
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                keyboardAppearance={appTheme}
                onChangeText={onChangeEmail}
                placeholder="Enter Email"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                style={styles.input}
              />        
              {email === '' ? null : emailCheck === true ? 
                <AntDesign name="checkcircle" size={20} color={"black"} /> : 
                <AntDesign name="closecircle" size={20} color={"black"} />}
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
              <TextInput
                keyboardAppearance={appTheme}
                onChangeText={onChangePassword}
                placeholder="Enter Password"
                keyboardType="default"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                style={styles.input}
              />
                {password === '' ? null : passwordCheck === true ? 
                  <AntDesign name="checkcircle" size={20} color={"black"} /> : 
                  <TouchableWithoutFeedback 
                    onPress={()=>{
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      alert('At least 8 characters\nAt least 1 capital letter')  
                    }}
                  >
                    <View style={{}}>
                      <AntDesign name="exclamationcircle" size={20} color={'black'} />
                    </View>
                  </TouchableWithoutFeedback>}
            </View>
              <Text style={{textAlign: 'center', color: 'gray'}}>By signing up, you agree to our
                <OpenURLButton url={"https://www.youtube.com/t/terms"}>Youtube Terms of Service</OpenURLButton>
                <Text>    </Text>
                <OpenURLButton url={"https://policies.google.com/privacy"}>Google Privacy policy</OpenURLButton>
              </Text>
              <TouchableOpacity
                disabled={!enabled}
                style={
                  enabled
                    ? { ...styles.button, backgroundColor: Colors.primary }
                    : { ...styles.button, backgroundColor: Colors.gray }
                }
                onPress={() => {
                  if (enabled) {
                    signup();
                  }
                }}
              >
              {loading ? (
                <ActivityIndicator
                  animating={true}
                  size="small"
                  color={Colors.complimentText}
                />
              ) : (
                <Text style={{ color: Colors.complimentText }}>SignUp</Text>
              )}
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
