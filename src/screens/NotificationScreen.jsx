/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const NotificationScreen = ({route, navigation}) => {
  const {roll} = route.params;

  const [schedules, setSchedules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [labquizes, setLabQuizes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const cardColors = [
    '#e4b874',
    '#b0bbbc',
    '#bab2cc',
    '#cb9ca2',
    '#9ccbc8',
    '#c0cb9c',
  ];
  async function fetchCT(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
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
      await fetchCT('https://tiny-teal-hedgehog-wig.cyclic.app/classtest');
    }
    fetchData();
  }, [refreshing]);

  async function fetchAssignmnet(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
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
      await fetchAssignmnet(
        'https://tiny-teal-hedgehog-wig.cyclic.app/assignment',
      );
    }
    fetchData();
  }, [refreshing]);

  async function fetchlabquiz(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
      if (response.ok) {
        const data = await response.json();
        setLabQuizes(data);
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
      await fetchlabquiz('https://tiny-teal-hedgehog-wig.cyclic.app/labquiz');
    }
    fetchData();
  }, [refreshing]);

  async function deleteClassTest(classtTestId, userId) {
    try {
      const baseUrl = 'https://tiny-teal-hedgehog-wig.cyclic.app';
      const apiUrl = `${baseUrl}/classtest/${classtTestId}/${userId}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('ClassTest deleted successfully.');
        setRefreshing(true);
      } else {
        if (response.status === 403) {
          Alert.alert(
            'failed',
            'only a CR can make changes to this',
            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
            {cancelable: false},
          );
        } else {
          console.log('Failed to delete assignment:', responseData.message);
        }
      }
    } catch (error) {
      console.error('Error deleting ClassTest:', error.message);
    } finally {
      setRefreshing(false);
    }
  }

  async function deleteAssignment(assignmentId, userId) {
    try {
      const baseUrl = 'https://tiny-teal-hedgehog-wig.cyclic.app';
      const apiUrl = `${baseUrl}/assignment/${assignmentId}/${userId}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('assignment deleted successfully.');
        setRefreshing(true);
      } else {
        if (response.status === 403) {
          Alert.alert(
            'failed',
            'only a CR can make changes to this',
            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
            {cancelable: false},
          );
        } else {
          console.log('Failed to delete assignment:', responseData.message);
        }
      }
    } catch (error) {
      console.error('Error deleting assignment:', error.message);
    } finally {
      setRefreshing(false);
    }
  }

  async function deleteLabQuiz(labquizId, userId) {
    try {
      const baseUrl = 'https://tiny-teal-hedgehog-wig.cyclic.app';
      const apiUrl = `${baseUrl}/labquiz/${labquizId}/${userId}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('lab quiz deleted successfully.');
        setRefreshing(true);
      } else {
        if (response.status === 403) {
          Alert.alert(
            'failed',
            'only a CR can make changes to this',
            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
            {cancelable: false},
          );
        } else {
          console.log('Failed to delete assignment:', responseData.message);
        }
      }
    } catch (error) {
      console.error('Error deleting lab quiz:', error.message);
    } finally {
      setRefreshing(false);
    }
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          paddingBottom: windowHeight * 0.07,
          paddingLeft: windowWidth * 0.05,
          paddingRight: windowWidth * 0.05,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 30,
          }}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={[styles.nav, {marginRight: 20, backgroundColor: 'black'}]}>
              <Text style={{textAlign: 'center', color: 'white'}}>
                Upcoming Events
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View>
                        <TouchableOpacity style={{ backgroundColor: 'grey', borderRadius: 25, padding: 10, height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="ios-add" size={20} color={"white"} style={{}} />
                        </TouchableOpacity>
                    </View> */}
        </View>

        {/* <View> */}
        <ScrollView
          vertical={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
              }}
            />
          }>
          <View style={styles.notice_board}>
            <View style={{width: 100, flexDirection: 'row'}}>
              <Ionicons
                name="ios-rocket"
                color={'black'}
                style={{padding: 5}}
              />
              <Text style={{color: 'grey', fontWeight: 900}}>Class Test</Text>
            </View>
            <View style={{width: 220}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{flexDirection: 'row'}}>
                {schedules.map((schedule, index) => {
                  const cardStyle = {
                    ...styles.card,
                    backgroundColor:
                      cardColors[getRandomInt(1, 100) % cardColors.length],
                  };
                  return (
                    <View key={index} style={cardStyle}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        }}>
                        <TouchableOpacity
                          onPress={async () =>
                            await deleteClassTest(schedule._id, roll)
                          }>
                          <Ionicons name="close" size={20} color={'#f3a7b3'} />
                        </TouchableOpacity>
                      </View>
                      <View style={{flexDirection: 'row', flex: 1}}>
                        <View
                          style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View>
                            <Ionicons name="time" color={'black'} size={40} />
                          </View>
                          <View>
                            <Text
                              style={{
                                fontWeight: 900,
                                fontSize: 17,
                                color: 'black',
                              }}>
                              {schedule.from}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                fontWeight: 400,
                                fontSize: 13,
                                color: 'black',
                              }}>
                              {schedule.to}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: '#f3a7b3',
                              height: '70%',
                              marginLeft: 10,
                              marginRight: 10,
                            }}
                          />
                        </View>
                        <View>
                          <View>
                            <Text
                              style={{
                                fontWeight: 600,
                                fontSize: 15,
                                color: 'black',
                              }}>
                              {schedule.title}
                            </Text>
                          </View>
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <Ionicons
                              name="location"
                              color={'black'}
                              size={25}
                              style={{marginRight: 7}}
                            />
                            <Text
                              style={{
                                marginTop: 2,
                                fontWeight: 500,
                                fontSize: 14,
                                color: 'black',
                              }}>
                              {' '}
                              {schedule.venue}{' '}
                            </Text>
                          </View>
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <Ionicons
                              name="calendar"
                              color={'black'}
                              size={25}
                              style={{marginRight: 7}}
                            />
                            <Text
                              style={{
                                marginTop: 2,
                                fontWeight: 500,
                                fontSize: 14,
                                color: 'black',
                              }}>
                              {' '}
                              {schedule.date}{' '}
                            </Text>
                          </View>
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <Ionicons
                              name="md-person"
                              color={'black'}
                              size={25}
                              style={{marginRight: 7}}
                            />
                            <Text
                              style={{
                                marginTop: 2,
                                fontWeight: 500,
                                fontSize: 14,
                                color: 'black',
                              }}>
                              {schedule.teacher}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}

                <View style={styles.card}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      navigation.navigate('ClassTestCreate', {roll: roll})
                    }>
                    <Ionicons name="ios-add" color={'black'} size={100} />
                  </TouchableOpacity>
                </View>
                {/* </View> */}
              </ScrollView>

              <View style={{marginTop: 10, flexDirection: 'row'}}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: '#f3a7b3',
                    borderRadius: 5,
                  }}
                />
                <View
                  style={{
                    borderBottomWidth: 3,
                    borderColor: '#f3a7b3',
                    width: '150%',
                    marginBottom: 3,
                  }}
                />
              </View>
            </View>
          </View>

          <View style={styles.notice_board}>
            <View style={{width: 100, flexDirection: 'row'}}>
              <Ionicons
                name="ios-rocket"
                color={'black'}
                style={{padding: 5}}
              />
              <Text style={{color: 'grey', fontWeight: 900}}>Assignment</Text>
            </View>
            <View style={{width: 220}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{flexDirection: 'row'}}>
                {assignments.map((assignment, index) => {
                  const cardStyle = {
                    ...styles.card,
                    backgroundColor:
                      cardColors[getRandomInt(1, 100) % cardColors.length],
                    // backgroundColor: `${cardColors[getRandomInt(1, 100) % cardColors.length]}${Math.round(cardOpacity * 255).toString(16)}`
                  };
                  return (
                    <View key={index} style={cardStyle}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        }}>
                        <TouchableOpacity
                          onPress={async () =>
                            await deleteAssignment(assignment._id, roll)
                          }>
                          <Ionicons name="close" size={20} color={'#f3a7b3'} />
                        </TouchableOpacity>
                      </View>
                      <View style={{flexDirection: 'row', flex: 1}}>
                        <View
                          style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View>
                            <Ionicons name="time" color={'black'} size={40} />
                          </View>
                          <View>
                            <Text
                              style={{
                                fontWeight: 900,
                                fontSize: 17,
                                color: 'black',
                              }}>
                              {' '}
                              {assignment.from}{' '}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                fontWeight: 400,
                                fontSize: 13,
                                color: 'black',
                              }}>
                              {assignment.to}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: '#f3a7b3',
                              height: '70%',
                              marginLeft: 10,
                              marginRight: 10,
                            }}
                          />
                        </View>
                        <View>
                          <View>
                            <Text
                              style={{
                                fontWeight: 600,
                                fontSize: 15,
                                color: 'black',
                              }}>
                              {assignment.title}
                            </Text>
                          </View>
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <Ionicons
                              name="location"
                              color={'black'}
                              size={25}
                              style={{marginRight: 7}}
                            />
                            <Text
                              style={{
                                marginTop: 2,
                                fontWeight: 500,
                                fontSize: 14,
                                color: 'black',
                              }}>
                              {' '}
                              {assignment.venue}{' '}
                            </Text>
                          </View>
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <Ionicons
                              name="calendar"
                              color={'black'}
                              size={25}
                              style={{marginRight: 7}}
                            />
                            <Text
                              style={{
                                marginTop: 2,
                                fontWeight: 500,
                                fontSize: 14,
                                color: 'black',
                              }}>
                              {' '}
                              {assignment.venue}{' '}
                            </Text>
                          </View>
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <Ionicons
                              name="md-person"
                              color={'black'}
                              size={25}
                              style={{marginRight: 7}}
                            />
                            <Text
                              style={{
                                marginTop: 2,
                                fontWeight: 500,
                                fontSize: 14,
                                color: 'black',
                              }}>
                              {' '}
                              {assignment.teacher}{' '}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
                <View style={styles.card}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      navigation.navigate('AssignmentCreate', {roll: roll})
                    }>
                    <Ionicons name="ios-add" color={'black'} size={100} />
                  </TouchableOpacity>
                </View>
                {/* </View> */}
              </ScrollView>
              <View style={{marginTop: 10, flexDirection: 'row'}}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: '#f3a7b3',
                    borderRadius: 5,
                  }}
                />
                <View
                  style={{
                    borderBottomWidth: 3,
                    borderColor: '#f3a7b3',
                    width: '150%',
                    marginBottom: 3,
                  }}
                />
              </View>
            </View>
          </View>

          <View style={styles.notice_board}>
            <View style={{width: 100, flexDirection: 'row'}}>
              <Ionicons
                name="ios-rocket"
                color={'black'}
                style={{padding: 5}}
              />
              <Text style={{color: 'grey', fontWeight: 900}}>Lab Quiz</Text>
            </View>
            <View style={{width: 220}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{flexDirection: 'row'}}>
                {labquizes.map((labquiz, index) => {
                  const cardStyle = {
                    ...styles.card,
                    backgroundColor:
                      cardColors[getRandomInt(1, 100) % cardColors.length],
                    // backgroundColor: `${cardColors[getRandomInt(1, 100) % cardColors.length]}${Math.round(cardOpacity * 255).toString(16)}`
                  };

                  return (
                    <View key={index} style={cardStyle}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        }}>
                        <TouchableOpacity
                          onPress={async () =>
                            await deleteLabQuiz(labquiz._id, roll)
                          }>
                          <Ionicons name="close" size={20} color={'#f3a7b3'} />
                        </TouchableOpacity>
                      </View>
                      <View style={{flexDirection: 'row', flex: 1}}>
                        <View
                          style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View>
                            <Ionicons name="time" color={'black'} size={40} />
                          </View>
                          <View>
                            <Text
                              style={{
                                fontWeight: 900,
                                fontSize: 17,
                                color: 'black',
                              }}>
                              {' '}
                              {labquiz.from}{' '}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                fontWeight: 400,
                                fontSize: 13,
                                color: 'black',
                              }}>
                              {labquiz.to}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: '#f3a7b3',
                              height: '70%',
                              marginLeft: 10,
                              marginRight: 10,
                            }}
                          />
                        </View>
                        <View>
                          <View>
                            <Text
                              style={{
                                fontWeight: 600,
                                fontSize: 15,
                                color: 'black',
                              }}>
                              {labquiz.title}
                            </Text>
                          </View>
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <Ionicons
                              name="location"
                              color={'black'}
                              size={25}
                              style={{marginRight: 7}}
                            />
                            <Text
                              style={{
                                marginTop: 2,
                                fontWeight: 500,
                                fontSize: 14,
                                color: 'black',
                              }}>
                              {' '}
                              {labquiz.venue}{' '}
                            </Text>
                          </View>
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <Ionicons
                              name="calendar"
                              size={25}
                              style={{marginRight: 7}}
                            />
                            <Text
                              style={{
                                marginTop: 2,
                                fontWeight: 500,
                                fontSize: 14,
                                color: 'black',
                              }}>
                              {' '}
                              {labquiz.venue}{' '}
                            </Text>
                          </View>
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <Ionicons
                              name="md-person"
                              color={'black'}
                              size={25}
                              style={{marginRight: 7}}
                            />
                            <Text
                              style={{
                                marginTop: 2,
                                fontWeight: 500,
                                fontSize: 14,
                                color: 'black',
                              }}>
                              {' '}
                              {labquiz.teacher}{' '}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
                <View style={styles.card}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      navigation.navigate('LabQuizCreate', {roll: roll})
                    }>
                    <Ionicons name="ios-add" color={'black'} size={100} />
                  </TouchableOpacity>
                </View>
              </ScrollView>
              <View style={{marginTop: 10, flexDirection: 'row'}}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: '#f3a7b3',
                    borderRadius: 5,
                  }}
                />
                <View
                  style={{
                    borderBottomWidth: 3,
                    borderColor: '#f3a7b3',
                    width: '150%',
                    marginBottom: 3,
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: windowHeight * 0.13,
    paddingLeft: windowWidth * 0.03,
    paddingRight: windowWidth * 0.03,
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1,
  },
  nav: {
    borderRadius: 150,
    padding: 15,
    height: 50,
    width: 120,
  },
  card: {
    backgroundColor: '#f2fdfb',
    height: 200,
    width: 300,
    borderRadius: 30,
    marginRight: 20,
    padding: 10,
  },
  notice_board: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default NotificationScreen;
