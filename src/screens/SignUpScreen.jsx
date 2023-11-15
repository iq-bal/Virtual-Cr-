import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [dob, setDob] = useState('');
  const [blood, setBlood] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');

  async function register(url) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
          mobile,
          dob,
          blood,
          studentID,
          password,
          gender,
        }),
      });
      if (response.ok) {
        const responseData = await response.json();
        const accessToken = responseData.accessToken;
        const refreshToken = responseData.refreshToken;
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        console.log('token saved');
        navigation.navigate('Schedules');
      } else {
        console.log(response.status);
        if (response.status == 400) {
          Alert.alert(
            'failed',
            'all fields are required',
            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
            {cancelable: false},
          );
        } else if (response.status == 409) {
          Alert.alert(
            'failed',
            'user already exists with this student id',
            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
            {cancelable: false},
          );
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
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen_1}>
        <ScrollView showsVerticalScrollIndicator={false} vertical={true}>
          <View>
            <Text style={styles.header}>Hola</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inlineContainer}>
              <Ionicons
                name="ios-person"
                size={20}
                color="#333333"
                style={styles.iconStyle}
              />
              <TextInput
                placeholder="Karl Marx"
                placeholderTextColor={'#333333'}
                keyboardType="default"
                value={name}
                onChangeText={setName}
                style={styles.textInput}
              />
            </View>
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

          <View style={styles.form_container}>
            <View style={[styles.form, {width: '50%'}]}>
              <Text style={styles.label}>Date Of Birth</Text>
              <View style={styles.inlineContainer}>
                <Ionicons
                  name="calendar"
                  size={20}
                  color="#333333"
                  style={styles.iconStyle}
                />
                <TextInput
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={'#333333'}
                  value={dob}
                  keyboardType="default"
                  onChangeText={setDob}
                  style={styles.textInput}
                />
              </View>
            </View>
            <View style={[styles.form, {width: '45%'}]}>
              <Text style={styles.label}>Blood Group</Text>
              <View style={styles.inlineContainer}>
                <Ionicons
                  name="pulse"
                  size={20}
                  color="#333333"
                  style={styles.iconStyle}
                />
                <TextInput
                  placeholder="O+(ve)"
                  placeholderTextColor={'#333333'}
                  keyboardType="default"
                  value={blood}
                  onChangeText={setBlood}
                  style={styles.textInput}
                />
              </View>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.inlineContainer}>
              <Ionicons
                name="md-person"
                size={20}
                color="#333333"
                style={styles.iconStyle}
              />
              <TextInput
                placeholder="Male or Female"
                placeholderTextColor={'#333333'}
                keyboardType="default"
                value={gender}
                onChangeText={setGender}
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Mobile</Text>
            <View style={styles.inlineContainer}>
              <Ionicons
                name="call"
                size={20}
                color="#333333"
                style={styles.iconStyle}
              />
              <TextInput
                placeholder="015123456.."
                placeholderTextColor={'#333333'}
                keyboardType="number-pad"
                value={mobile}
                onChangeText={setMobile}
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
            onPress={async () =>
              await register(
                'https://tiny-teal-hedgehog-wig.cyclic.app/register',
              )
            }>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity>
              <Text
                onPress={() => navigation.navigate('SignIn')}
                style={styles.forgotSignUp}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  header_container: {},
  header: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  line: {
    borderBottomColor: 'red',
    borderBottomWidth: 5,
    marginVertical: 10,
    maxWidth: windowWidth * 0.2,
    borderRadius: windowWidth * 0.5,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: windowWidth * 0.05,
    marginBottom: windowHeight * 0.01,
    padding: windowWidth * 0.03,
  },
  form_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    padding: windowWidth * 0.03,
    marginBottom: windowHeight * 0.02,
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

export default SignUpScreen;
