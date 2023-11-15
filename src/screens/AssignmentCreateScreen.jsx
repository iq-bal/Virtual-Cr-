/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, TextInput, Alert} from 'react-native';
import {SafeAreaView, View, Dimensions, Text, StyleSheet} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AssignmentCreateScreen = ({navigation, route}) => {
  const {roll} = route.params;

  const [title, setTtile] = useState('');
  const [teacher, setTeacher] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  async function createAssignment(roll) {
    const apiUrl = `https://tiny-teal-hedgehog-wig.cyclic.app/assignment/${roll}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          teacher,
          venue,
          date,
          from,
          to,
        }),
      });
      const responseData = await response.json();
      if (response.ok) {
        console.log('assignment created successfully:', responseData.message);
        navigation.navigate('Notifications', {roll: roll});
      } else {
        if (response.status == 403) {
          Alert.alert(
            'failed',
            'only a CR can make changes to this',
            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
            {cancelable: false},
          );
        } else {
          console.log('Failed to create ClassTest:', responseData.message);
        }
      }
    } catch (error) {
      console.error('Error creating assignment:', error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={{color: 'red', fontSize: 30, fontWeight: 700}}>
            Assignment
          </Text>
          <View
            style={{
              width: 180,
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 10,
            }}></View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Course Title
            </Text>
            <TextInput
              value={title}
              onChangeText={text => setTtile(text)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                height: 50,
                color: 'black',
              }}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Course Teacher
            </Text>
            <TextInput
              value={teacher}
              onChangeText={text => setTeacher(text)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                height: 50,
                color: 'black',
              }}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Venue
            </Text>
            <TextInput
              value={venue}
              onChangeText={text => setVenue(text)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                height: 50,
                color: 'black',
              }}
            />
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Date
            </Text>
            <TextInput
              value={date}
              onChangeText={text => setDate(text)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                height: 50,
                color: 'black',
              }}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Starting Time
            </Text>
            <TextInput
              value={from}
              onChangeText={text => setFrom(text)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                height: 50,
                color: 'black',
              }}
            />
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#FAF9F6',
            borderRadius: 20,
            shadowColor: '#000',
            margin: 10,
          }}>
          <View style={{padding: 20}}>
            <Text style={{fontWeight: 600, color: '#5A5A5A', fontSize: 20}}>
              Ending Time
            </Text>
            <TextInput
              value={to}
              onChangeText={text => setTo(text)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                height: 50,
                color: 'black',
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            width: '100%',
            backgroundColor: '#FAF9F6',
            height: 60,
            marginBottom: 50,
          }}
          onPress={async () => await createAssignment(roll)}>
          <Text style={{fontSize: 20, fontWeight: 900, color: '#5A5A5A'}}>
            Create Assignment
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
});

export default AssignmentCreateScreen;
