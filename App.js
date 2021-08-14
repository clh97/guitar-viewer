import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import utils from './src/config/utils';
import Home from './src/screens/Home';
import Scale from './src/screens/Scale';

const Stack = createNativeStackNavigator();

export default function App() {
  React.useEffect(() => {
    (async () => {
      const collections = await utils.collections.retrieveSavedCollections();

      if (!collections || collections.length <= 0) {
        await utils.collections.initCollection();
      }
    })()
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{
          statusBarHidden: true,
          headerShown: false,
        }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Scale" component={Scale} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}