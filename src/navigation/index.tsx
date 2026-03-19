import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from '../screens/StartScreen';
import MatchScreen from '../screens/MatchScreen';

export type RootStackParamList = {
  Start: undefined;
  Match: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Start"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Match" component={MatchScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;
