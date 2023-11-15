import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignInScreen = ({navigation}) => {
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');

  // Perform the login request
  async function login(studentID, password) {
    try {
      const response = await fetch(
        'https://tiny-teal-hedgehog-wig.cyclic.app/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({studentID, password}),
        },
      );
      if (response.ok) {
        // Successful login, store tokens in AsyncStorage or state
        const data = await response.json();
        AsyncStorage.setItem('refreshToken', data.refreshToken);
        // AsyncStorage.setItem('accessToken', data.accessToken);
        // we will use this refresh token to get access token whenever needed
        navigation.navigate('Schedules');
        // Update your authentication state
        // For example, set isAuthenticated to true and store tokens
      } else {
        // Handle error cases, e.g., show an error message
        console.log(response.status);
        if (response.status === 401) {
          Alert.alert(
            'failed',
            'you Used Wrong Password',
            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
            {cancelable: false},
          );
          console.log('wrong credentials');
        } else if (response.status === 404) {
          Alert.alert(
            'failed',
            'user not found with this ID, sign up first?',
            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
            {cancelable: false},
          );
          console.log('user not found');
        } else if (response.status === 400) {
          Alert.alert(
            'failed',
            'missing fields',
            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
            {cancelable: false},
          );
          console.log('missing credentials');
        } else {
          Alert.alert(
            'failed',
            'something fishy! we will get back to you soon',
            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
            {cancelable: false},
          );
        }
      }
    } catch (error) {
      Alert.alert(
        'failed',
        'network request failed',
        [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
        {cancelable: false},
      );
      console.error('Error during login:', error);
    }
  }

  // Call the login function when the user submits the form
  // login(studentID, password);

  console.log(process.env.LOGIN_ROUTE);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen_1}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/logo_2.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Student ID</Text>
          <View style={styles.inlineContainer}>
            <Ionicons
              name="ios-person"
              size={20}
              color="#333333"
              style={styles.iconStyle}
            />
            <TextInput
              placeholder="2007..."
              placeholderTextColor={'#333333'}
              keyboardType="number-pad"
              value={studentID}
              onChangeText={setStudentID}
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inlineContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#333333"
              style={styles.iconStyle}
            />
            <TextInput
              placeholder="*****"
              placeholderTextColor={'#333333'}
              secureTextEntry={true}
              keyboardType="default"
              value={password}
              onChangeText={setPassword}
              style={styles.textInput}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={async () => await login(studentID, password)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity>
            <Text
              onPress={() => navigation.navigate('SignUp')}
              style={styles.forgotSignUp}>
              Sign Up
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotSignUp}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen_1: {
    backgroundColor: '#E0F0FF',
    padding: windowWidth * 0.07, // 10% of the window width as padding
    flexDirection: 'column',
    borderRadius: windowWidth * 0.1, // 10% of the window width as border radius
    shadowColor: 'rgba(0, 0, 0, 0.5)', // Adjust the shadow color
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1, // Increase shadow opacity for visibility
    shadowRadius: windowWidth * 0.05, // 5% of the window width as shadow radius
    marginVertical: windowWidth * 0.05, // 5% of the window width as vertical margin
    width: '90%',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: windowWidth * 0.05,
    marginBottom: windowHeight * 0.03,
    padding: windowWidth * 0.04,
  },
  label: {
    fontWeight: '200',
    fontSize: 15,
    marginBottom: 7,
    color: '#333333',
  },
  inlineContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#6b8ca4',
    borderRadius: windowWidth * 0.05,
    padding: windowWidth * 0.04,
    marginBottom: windowHeight * 0.03,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: windowWidth * 0.15,
  },
  image: {
    height: 150,
    width: 100,
    resizeMode: 'contain',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: windowWidth * 0.15,
  },
  iconStyle: {
    marginRight: 8,
    marginTop: 10,
  },
  textInput: {
    width: '100%',
    color: '#333333',
  },
  forgotSignUp: {
    color: '#333333',
  },
});

export default SignInScreen;
