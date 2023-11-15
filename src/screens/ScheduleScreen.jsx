/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ScheduleScreen = ({navigation}) => {
  const [schedules, setSchedules] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const cardColors = [
    '#e4b874',
    '#b0bbbc',
    '#bab2cc',
    '#cb9ca2',
    '#9ccbc8',
    '#c0cb9c',
  ];

  const date = new Date();
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const currentDay = days[date.getDay()];
  const currentDate = date.getDate();
  const month = months[date.getMonth()];
  const month_numerical = date.getMonth();
  const currentMonth = month.toUpperCase();

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

  async function fetchSchedule(url) {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        const accessToken = await genAccessToken(refreshToken);
        console.log(accessToken);
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
            const currDay = currentDay.toLowerCase();
            const setData = Object.values(data[0][currDay]);
            const slicedData = setData.slice(0, -1);
            setSchedules(slicedData);
          } else {
            console.log(response.status);
            console.log('inside fetch schedule');
            navigation.navigate('SignIn');
          }
        } else {
          Alert.alert(
            'failed',
            'could not generate access token for the user',
            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
            {cancelable: false},
          );
          console.log('could not generate access token for the user');
          navigation.navigate('SignIn');
        }
      } else {
        navigation.navigate('SignIn');
      }
    } catch (error) {
      console.log(error);
      console.log('ekhane esheche');
    } finally {
      setRefreshing(false);
      console.log('refresh complete');
    }
  }

  useEffect(() => {
    async function fetchData() {
      await fetchSchedule('https://tiny-teal-hedgehog-wig.cyclic.app/routines');
    }
    fetchData();
  }, [refreshing]);

  const [infos, setInfos] = useState([]);

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
            setInfos(setData);
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

  const [users, setUsers] = useState({});
  const [birthday, setBirthday] = useState(false);
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');

  async function fetchUsers(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
      if (response.ok) {
        const data = await response.json();
        for (const element of data) {
          const dateObject = new Date(element.dob);
          const dateToday = new Date();
          if (
            dateObject.getMonth() === dateToday.getMonth() &&
            dateObject.getDate() === dateToday.getDate()
          ) {
            setBirthday(true);
            setUsers(element);
            const names = element.name.split(' ');
            const name = names[names.length - 1];
            setLastName(name);
            if (element.gender.toLowerCase === 'male') {
              setGender('him');
            } else if (element.gender.toLowerCase === 'female') {
              setGender('her');
            } else {
              setGender(' ');
            }
            break;
          }
          setBirthday(false);
          setGender('');
        }
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

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function increaseLoveCount(roll) {
    try {
    } catch (error) {}
  }

  const defaultImage = require('../../assets/images/square-512.jpg');
  const imageURI = infos.profilePicture
    ? {uri: infos.profilePicture}
    : defaultImage;

  const [todo, setToDo] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.child_1}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 30,
          }}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={[styles.nav, {marginRight: 20, backgroundColor: 'black'}]}>
              <Text style={{textAlign: 'center', color: 'white'}}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nav, {borderWidth: 1, borderColor: 'black'}]}
              onPress={() =>
                navigation.navigate('Notifications', {roll: infos.roll})
              }>
              <Text style={{textAlign: 'center', color: 'black'}}>
                Upcoming
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: 'grey',
                borderRadius: 25,
                padding: 10,
                height: 50,
                width: 50,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 10,
              }}
              onPress={() => navigation.navigate('Profile')}>
              <Image
                source={imageURI}
                style={{
                  margin: 5,
                  borderWidth: 1,
                  borderColor: '#96DED1',
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={{fontWeight: 600, fontSize: 25, color: 'black'}}>
            {currentDay}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 15,
            }}>
            <View>
              <Text style={{fontWeight: 900, fontSize: 60, color: 'black'}}>
                {currentDate}.{month_numerical}
              </Text>
              <Text style={{fontWeight: 900, fontSize: 60, color: 'black'}}>
                {currentMonth}
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderLeftColor: 'black',
                height: '100%',
              }}
            />
            <View>
              <Text style={{fontWeight: 900, fontSize: 25, color: 'black'}}>
                KUET
              </Text>
              <Text style={{color: 'black'}}>Bangladesh</Text>
              {birthday && (
                <View style={{marginTop: 20}}>
                  <Text
                    style={{
                      color: '#722F37',
                      fontStyle: 'normal',
                      fontWeight: '600',
                      fontSize: 25,
                    }}>
                    Big Day !
                  </Text>
                  <Text
                    style={{
                      color: '#2F726A',
                      fontSize: 15,
                      fontWeight: 300,
                      fontStyle: 'normal',
                    }}>
                    Happy Birthday to
                  </Text>
                  <Text
                    style={{color: '#722F37', fontSize: 25, fontWeight: 900}}>
                    {lastName}
                  </Text>
                  <Text
                    style={{
                      color: '#2F726A',
                      fontSize: 15,
                      fontWeight: 300,
                      fontStyle: 'normal',
                    }}>
                    {users.roll}
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginTop: 5,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      borderRadius: 20,
                      elevation: 5,
                    }}
                    onPress={() => increaseLoveCount(users.roll)}>
                    <Text
                      style={{
                        color: '#722F37',
                        fontSize: 15,
                        fontWeight: 300,
                        fontStyle: 'normal',
                        padding: 3,
                      }}>
                      Send {gender} Love
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.child_2}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
          }}>
          <TouchableOpacity onPress={() => setToDo(true)}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="time-outline"
                size={20}
                color={'grey'}
                paddingRight={5}
                paddingTop={5}
              />
              <Text style={{fontWeight: 500, fontSize: 20, color: 'black'}}>
                Schedules
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setToDo(false)}>
            <View
              style={{
                borderRadius: 30,
                borderColor: 'grey',
                backgroundColor: 'black',
              }}>
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 15,
                  padding: 10,
                  color: 'white',
                }}>
                Reminders
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{padding: 20}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                }}
              />
            }>
            {schedules.length > 0 ? (
              schedules.map((schedule, index) => {
                const cardStyle = {
                  ...styles.card,
                  backgroundColor:
                    cardColors[getRandomInt(1, 100) % cardColors.length],
                };
                return (
                  <View key={index} style={cardStyle}>
                    <View style={{flexDirection: 'column'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          marginBottom: 10,
                        }}>
                        <Ionicons
                          name="code-outline"
                          color={'grey'}
                          size={30}
                          marginRight={8}
                        />
                        <Text
                          style={{
                            fontWeight: 900,
                            fontSize: 20,
                            color: 'black',
                          }}>
                          {schedule.course_code}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          flexWrap: 'wrap',
                          marginBottom: 10,
                        }}>
                        <Ionicons
                          name="book-outline"
                          size={30}
                          color={'grey'}
                          marginRight={8}
                        />
                        <Text
                          style={{
                            fontWeight: 200,
                            fontSize: 17,
                            color: 'black',
                          }}>
                          {schedule.course_title}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          flexWrap: 'wrap',
                          marginBottom: 10,
                        }}>
                        <Ionicons
                          name="person-circle-outline"
                          size={30}
                          color={'grey'}
                          marginRight={8}
                        />
                        <Text style={{fontSize: 15, color: 'black'}}>
                          {schedule.course_teacher}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: 'black',
                          }}>
                          {schedule.from}
                        </Text>
                        <Text style={{color: 'black'}}>From</Text>
                      </View>
                      <View
                        style={{
                          borderRadius: 20,
                          width: 80,
                          backgroundColor: 'white',
                          borderColor: 'grey',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{color: 'black'}}>
                          {schedule.duration}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: 'black',
                          }}>
                          {schedule.to}
                        </Text>
                        <Text style={{color: 'black'}}>To</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text />
            )}

            <View style={{marginTop: 100}} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: windowHeight * 0.13,
    paddingLeft: windowWidth * 0.03,
    paddingRight: windowWidth * 0.03,
    backgroundColor: '#D3D3D3',
    flexDirection: 'column',
    flex: 1,
  },
  nav: {
    borderRadius: 150,
    padding: 12,
    height: 50,
    width: 120,
  },
  card: {
    borderRadius: windowWidth * 0.06,
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#c0cb9c',
  },
  child_1: {
    paddingBottom: windowHeight * 0.07,
    paddingLeft: windowWidth * 0.05,
    paddingRight: windowWidth * 0.05,
  },
  child_2: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: windowWidth * 0.09,
  },
});

export default ScheduleScreen;
