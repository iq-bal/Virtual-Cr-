import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ScheduleScreen from './src/screens/ScheduleScreen';
import SignInScreen from './src/screens/SignInScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import EditScreen from './src/screens/EditScreen';
import ClassTestCreateScreen from './src/screens/ClassTestScreenCreate';
import LabQuizCreateScreen from './src/screens/LabQuizCreateScreen';
import AssignmentCreateScreen from './src/screens/AssignmentCreateScreen';
import SignUpScreen from './src/screens/SignUpScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Schedules">
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Schedules"
          component={ScheduleScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Update"
          component={EditScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ClassTestCreate"
          component={ClassTestCreateScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AssignmentCreate"
          component={AssignmentCreateScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LabQuizCreate"
          component={LabQuizCreateScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
