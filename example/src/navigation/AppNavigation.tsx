import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import {
  BackgroundInterpolateUsageScreen,
  FlatListUsageScreen,
  HomeScreen,
  ProfileScreen,
  SectionListUsageScreen,
  SimpleUsageScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => (
  <Stack.Navigator screenOptions={{ headerShown: false, orientation: 'all' }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ presentation: 'modal', gestureEnabled: false }}
    />
    <Stack.Screen name="SimpleUsageScreen" component={SimpleUsageScreen} />
    <Stack.Screen name="FlatListUsageScreen" component={FlatListUsageScreen} />
    <Stack.Screen name="SectionListUsageScreen" component={SectionListUsageScreen} />
    <Stack.Screen
      name="BackgroundInterpolateUsageScreen"
      component={BackgroundInterpolateUsageScreen}
    />
  </Stack.Navigator>
);
