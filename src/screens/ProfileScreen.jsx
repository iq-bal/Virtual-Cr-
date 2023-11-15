/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Linking,
  Alert,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const imageWidth = windowWidth - windowWidth * 0.04 * 2;

const ProfileScreen = ({navigation}) => {
  const [infos, setInfos] = useState([]);
  const [users, setUsers] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handlePress = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  async function fetchUsers(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.log(response.status);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await fetchUsers('https://tiny-teal-hedgehog-wig.cyclic.app/profile/all');
    }
    fetchData();
  }, [refreshing]);

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

  async function fetchInfo(url) {
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
            console.log(data);
            setInfos(setData);
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
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await fetchInfo('https://tiny-teal-hedgehog-wig.cyclic.app/profile');
    }
    fetchData();
  }, [refreshing]);

  const navigateToUserProfile = roll => {
    navigation.navigate('UserProfile', {roll});
  };

  async function handleUrl(url) {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        "can't open",
        'provided link for the url might be broken or invalid',
        [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
        {cancelable: false},
      );
      console.log(error);
    }
  }

  const [isImagePressed, setImagePressed] = useState(false);

  const handleLogout = () => {
    if (isImagePressed) {
      setImagePressed(false);
    } else {
      setImagePressed(true);
    }
  };

  async function signout() {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const url = `https://tiny-teal-hedgehog-wig.cyclic.app/logout?refreshToken=${refreshToken}`;
      if (refreshToken) {
        const accessToken = await genAccessToken(refreshToken);
        if (accessToken) {
          const response = await fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.ok) {
            await AsyncStorage.removeItem(refreshToken);
            navigation.navigate('SignIn');
          } else {
            console.log(response.status);
          }
        } else {
          console.log('maybe user logged out');
          navigation.navigate('SignIn');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const signOutFromApp = async () => {
    await signout();
  };

  const defaultImage = require('../../assets/images/square-512.jpg');
  const imageURI = infos.profilePicture
    ? {uri: infos.profilePicture}
    : defaultImage;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Text style={{fontSize: 20, fontWeight: 200, color: 'black'}}>
            Hello,
          </Text>
          <Text style={{fontSize: 25, fontWeight: 700, color: 'red'}}>
            {infos.name}
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={handleLogout} style={{elevation: 5}}>
            <Image
              source={imageURI}
              style={{
                margin: 5,
                borderWidth: 1,
                borderColor: 'red',
                height: 50,
                width: 50,
                borderRadius: 25,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {isImagePressed && (
            <TouchableOpacity
              onPress={signOutFromApp}
              style={{
                backgroundColor: '#FAF9F6',
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 5,
                margin: 2,
              }}>
              <Text style={{fontWeight: 800, color: 'black'}}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View
          style={{
            backgroundColor: 'red',
            width: 40,
            height: 40,
            borderRadius: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons name="search" size={30} color={'white'} />
        </View>
        <View style={styles.input}>
          <TextInput
            placeholder="Search Mates"
            placeholderTextColor={'black'}
          />
        </View>
      </View>

      <View style={{height: 70, marginTop: 30}}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {users.map((user, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigateToUserProfile(user.roll)}>
              <Image
                source={
                  user.profilePicture
                    ? {uri: user.profilePicture}
                    : defaultImage
                }
                style={{
                  margin: 5,
                  borderWidth: 1,
                  borderColor: 'red',
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        vertical={true}
        showsVerticalScrollIndicator={false}
        style={{marginTop: 40}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
            }}
          />
        }>
        <View>
          <View
            style={{
              backgroundColor: '#FAF9F6',
              elevation: 5,
              shadowColor: '#000',
              borderRadius: 15,
            }}>
            <View>
              {/* <View style={{padding:10}}> */}
              <Image
                source={imageURI}
                style={{height: imageWidth, width: imageWidth}}
                resizeMode="cover"
              />
              {/* </View> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 20,
                marginTop: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <Image
                    source={imageURI}
                    style={{margin: 5, height: 40, width: 40, borderRadius: 20}}
                    resizeMode="cover"
                  />
                </View>
                <View style={{marginLeft: 10}}>
                  <Text style={{fontSize: 18, fontWeight: 700, color: 'black'}}>
                    {infos.name}
                  </Text>
                  <Text style={{fontSize: 11, fontWeight: 300, color: 'black'}}>
                    {infos.roll}
                  </Text>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View>
                  {isDropdownVisible && (
                    <View style={{}}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Update', {
                            displayPicture: infos.profilePicture,
                          })
                        }>
                        <Text
                          style={{
                            color: '#5A5A5A',
                            padding: 5,
                            fontWeight: 500,
                          }}>
                          Update Information
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View>
                  <TouchableOpacity onPress={handlePress}>
                    <Ionicons
                      name="ellipsis-vertical"
                      size={30}
                      color={'black'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingTop: 0,
            }}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                style={{
                  padding: 50,
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: 'black',
                }}>
                {infos.bio}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 0,
            }}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="calendar" size={20} color={'black'} />
                <Text style={{fontWeight: 200, marginLeft: 5, color: 'black'}}>
                  Date of Birth
                </Text>
              </View>
              <Text style={{textAlign: 'center', color: 'black'}}>
                {infos.dob}
              </Text>
            </View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="pulse" size={20} color={'black'} />
                <Text style={{fontWeight: 200, marginLeft: 5, color: 'black'}}>
                  Blood Group
                </Text>
              </View>
              <Text style={{textAlign: 'center', color: 'black'}}>
                {infos.blood}
              </Text>
            </View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="ios-call" size={20} color={'black'} />
                <Text style={{fontWeight: 200, marginLeft: 5, color: 'black'}}>
                  Contact
                </Text>
              </View>
              <Text style={{textAlign: 'center', color: 'black'}}>
                {infos.mobile}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              backgroundColor: 'red',
              height: 2,
              marginVertical: 10,
            }}
          />

          <View>
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: '#FAF9F6',
                  padding: 20,
                  borderRadius: 15,
                  margin: 10,
                }}>
                <Text style={{fontWeight: 700, fontSize: 20, color: '#5A5A5A'}}>
                  Everyone Calls Me
                </Text>
                <Text style={{color: 'black'}}>{infos.nickname}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: '#FAF9F6',
                  padding: 20,
                  borderRadius: 15,
                  margin: 10,
                }}>
                <Text style={{fontWeight: 700, fontSize: 20, color: '#5A5A5A'}}>
                  Favorite Persona
                </Text>
                <Text style={{color: 'black'}}>{infos.favPersonality}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: '#FAF9F6',
                  padding: 20,
                  borderRadius: 15,
                  margin: 10,
                }}>
                <Text style={{fontWeight: 700, fontSize: 20, color: '#5A5A5A'}}>
                  I want people perceive me as
                </Text>
                <Text style={{color: 'black'}}>{infos.pov}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: '#FAF9F6',
                  padding: 20,
                  borderRadius: 15,
                  margin: 10,
                }}>
                <Text style={{fontWeight: 700, fontSize: 20, color: '#5A5A5A'}}>
                  Partner For Candle Light Dinner
                </Text>
                <Text style={{color: 'black'}}>{infos.candle}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: '#FAF9F6',
                  padding: 20,
                  borderRadius: 15,
                  margin: 10,
                }}>
                <Text style={{fontWeight: 700, fontSize: 20, color: '#5A5A5A'}}>
                  Favorite Moment in Campus
                </Text>
                <Text style={{color: 'black'}}>{infos.favMoment}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: '#FAF9F6',
                  padding: 20,
                  borderRadius: 15,
                  margin: 10,
                }}>
                <Text style={{fontWeight: 700, fontSize: 20, color: '#5A5A5A'}}>
                  Favorite Quote
                </Text>
                <Text style={{color: 'black'}}>{infos.favQoute}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingTop: 30,
              paddingBottom: 40,
            }}>
            <View>
              <TouchableOpacity onPress={() => handleUrl(infos.facebook)}>
                <Image
                  source={require('../../assets/images/facebook.png')}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    borderColor: 'green',
                    borderWidth: 1,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={() => handleUrl(infos.instagram)}>
                <Image
                  source={require('../../assets/images/instagram.jpg')}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    borderColor: 'green',
                    borderWidth: 1,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={() => handleUrl(infos.github)}>
                <Image
                  source={require('../../assets/images/github.png')}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    borderColor: 'green',
                    borderWidth: 1,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: windowHeight * 0.13,
    paddingLeft: windowWidth * 0.04,
    paddingRight: windowWidth * 0.04,
    backgroundColor: 'white',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FAF9F6',
    borderRadius: 20,
  },
  input: {
    width: '100%',
    padding: 7,
    marginLeft: 7,
  },
});

export default ProfileScreen;
