import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/auth/SplashScreen';
import InfoScreens from './screens/auth/InfoScreens';
import MainNavigator from './navigation/MainNavigator';
import { useFonts } from 'expo-font';
import AuthNavigator from './navigation/AuthNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Montserrat': require('./fonts/Montserrat/static/Montserrat-ExtraBold.ttf'),
    'Orbitron': require('./fonts/Orbitron/static/Orbitron-Bold.ttf'),
    'Roboto': require('./fonts/Roboto/static/RobotoSlab-Bold.ttf')
  });

  if (!fontsLoaded) {
    return null; // or a loading screen
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        {/* <Stack.Screen name="InfoScreens" component={InfoScreens} /> */}
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}