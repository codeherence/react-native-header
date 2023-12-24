import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigation } from './src/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default () => (
  <NavigationContainer>
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="dark" />
        <AppNavigation />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  </NavigationContainer>
);

const styles = StyleSheet.create({ container: { flex: 1 } });
