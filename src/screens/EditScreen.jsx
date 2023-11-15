/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ScrollView, TouchableOpacity, TextInput} from 'react-native';
import {
  SafeAreaView,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {encode} from 'base-64';

// Set up base-64 globally
if (!global.btoa) {
  global.btoa = encode;
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EditScreen = ({navigation, route}) => {
  const {displayPicture} = route.params;
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(image);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    mobile: '',
    dob: '',
    blood: '',
    nickname: '',
    favPersonality: '',
    pov: '',
    candle: '',
    favMoment: '',
    favQoute: '',
    facebook: '',
    github: '',
    instagram: '',
    gender: '',
    profilePicture: displayPicture,
    bio: '',
  });

  async function genAccessToken(refreshToken) {
    try {
      const response = await fetch(
        'https://tiny-teal-hedgehog-wig.cyclic.app/refresh',
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken,
          }),
        },
      );
      if (response.status === 200) {
        const data = await response.json();
        return data.accessToken;
      } else {
        navigation.navigate('SignIn');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchFormData(url) {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        const accessToken = await genAccessToken(refreshToken);
        if (accessToken) {
          const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            const setData = data[0];
            setFormData(setData);
          } else {
            console.log(response.status);
          }
        } else {
          console.log('maybe user logged out');
          navigation.navigate('SignIn');
        }
      } else {
        navigation.navigate('SignIn');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await fetchFormData('https://tiny-teal-hedgehog-wig.cyclic.app/profile');
    }
    fetchData();
  }, []);

  const handleInputChange = (fieldName, text) => {
    setFormData({
      ...formData,
      [fieldName]: text,
    });
  };

  const handleSubmit = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        const accessToken = await genAccessToken(refreshToken);
        if (accessToken) {
          const response = await fetch(
            'https://tiny-teal-hedgehog-wig.cyclic.app/profile',
            {
              method: 'PATCH',
              mode: 'cors',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            },
          );
          if (response.ok) {
            navigation.navigate('Profile');
          } else {
            console.log(response.status);
            // navigation.navigate('SignIn');
          }
        } else {
          console.log('maybe user logged out');
          navigation.navigate('SignIn');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cloudinaryConfig = {
    cloudName: 'dabzeeh4f',
    apiKey: '715157453871578',
    apiSecret: 'Z-0DtVDdyYA3-paHs4y-qWssDqw',
  };

  async function addImageUrlToProfile(imageUrl) {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        const accessToken = await genAccessToken(refreshToken);
        if (accessToken) {
          const response = await fetch(
            'https://tiny-teal-hedgehog-wig.cyclic.app/profile/imageurl',
            {
              method: 'PATCH',
              mode: 'cors',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageUrl,
              }),
            },
          );
          if (response.ok) {
            console.log('inside add image url function');
          } else {
            console.log(response.status);
          }
        }
      } else {
        navigation.navigate('SignIn');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const uploadImage = async () => {
    try {
      const dpUpload = new FormData();
      dpUpload.append('file', {
        uri: image,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      const uploadPreset = 'wq7wqtyj'; // Replace with your actual upload preset name
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload?upload_preset=${uploadPreset}`;
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(
            `${cloudinaryConfig.apiKey}:${cloudinaryConfig.apiSecret}`,
          )}`,
          'Content-Type': 'multipart/form-data',
        },
        body: dpUpload,
      });
      if (response.ok) {
        const data = await response.json();
        console.log('upload image');
        await addImageUrlToProfile(data.secure_url);
        console.log('just came back from inside image url');
        navigation.navigate('Profile');
      } else {
        console.log(response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={{color: 'red', fontSize: 30, fontWeight: 700}}>
            Hola,
          </Text>
          <View
            style={{
              width: 70,
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 30,
          }}>
          <TouchableOpacity onPress={pickImage}>
            <View style={{alignItems: 'center', marginBottom: 10}}>
              {image ? (
                <React.Fragment>
                  <Image
                    source={{uri: image}}
                    style={{
                      height: 200,
                      width: 200,
                      borderRadius: 100,
                      borderWidth: 5,
                      borderColor: 'red',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontStyle: 'italic',
                      fontWeight: 300,
                      padding: 20,
                      color: 'black',
                    }}>
                    oh my god ! Is it your first time or you already knew, you
                    look gorgeous?
                  </Text>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity
                      style={{padding: 10}}
                      onPress={() => setImage(null)}>
                      <Text style={{color: 'black'}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{padding: 10}}
                      onPress={uploadImage}>
                      <Text style={{color: 'black'}}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Image
                    source={{uri: formData.profilePicture}}
                    style={{
                      height: 200,
                      width: 200,
                      borderRadius: 100,
                      borderWidth: 5,
                      borderColor: 'red',
                    }}
                  />
                </React.Fragment>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Name
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={text => handleInputChange('name', text)}
              style={styles.textInput}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              student ID
            </Text>
            <TextInput
              value={formData.roll}
              style={styles.textInput}
              editable={false}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Contact
            </Text>
            <TextInput
              value={formData.mobile}
              style={styles.textInput}
              onChangeText={text => handleInputChange('mobile', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Date Of Birth
            </Text>
            <TextInput
              value={formData.dob}
              style={styles.textInput}
              onChangeText={text => handleInputChange('dob', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Blood Group
            </Text>
            <TextInput
              value={formData.blood}
              style={styles.textInput}
              onChangeText={text => handleInputChange('blood', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Gender
            </Text>
            <TextInput
              value={formData.gender}
              style={styles.textInput}
              onChangeText={text => handleInputChange('gender', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Everyone Calls Me
            </Text>
            <TextInput
              value={formData.nickname}
              style={styles.textInput}
              onChangeText={text => handleInputChange('nickname', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Favorite Personality{' '}
            </Text>
            <TextInput
              value={formData.favPersonality}
              style={styles.textInput}
              onChangeText={text => handleInputChange('favPersonality', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              I want people to perceive me as
            </Text>
            <TextInput
              value={formData.pov}
              style={styles.textInput}
              onChangeText={text => handleInputChange('pov', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Partner for Candle light dinner
            </Text>
            <TextInput
              value={formData.candle}
              style={styles.textInput}
              onChangeText={text => handleInputChange('candle', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Favorite moment in campus
            </Text>
            <TextInput
              value={formData.favMoment}
              style={styles.textInput}
              onChangeText={text => handleInputChange('favMoment', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Favorite Qoutes
            </Text>
            <TextInput
              value={formData.favQoute}
              style={styles.textInput}
              onChangeText={text => handleInputChange('favQoute', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Write bio
            </Text>
            <TextInput
              value={formData.bio}
              style={styles.textInput}
              onChangeText={text => handleInputChange('bio', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Facebook
            </Text>
            <TextInput
              value={formData.facebook}
              style={styles.textInput}
              onChangeText={text => handleInputChange('facebook', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Instagram
            </Text>
            <TextInput
              value={formData.instagram}
              style={styles.textInput}
              onChangeText={text => handleInputChange('instagram', text)}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text
              style={{
                fontWeight: 600,
                color: '#5A5A5A',
                fontSize: 20,
              }}>
              Github
            </Text>
            <TextInput
              value={formData.github}
              style={styles.textInput}
              onChangeText={text => handleInputChange('github', text)}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 20,
            margin: 30,
            backgroundColor: 'red',
            borderRadius: 30,
          }}>
          <Text style={{color: 'white', fontWeight: '900', fontSize: 20}}>
            Let my friends know, now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: windowHeight * 0.13,
    paddingLeft: windowWidth * 0.04,
    paddingRight: windowWidth * 0.04,
    paddingBottom: windowHeight * 0.001,
    backgroundColor: 'white',
    flex: 1,
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 100,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: 'red',
  },
  textInput: {
    width: '100%',
    color: 'black',
  },
});

export default EditScreen;
