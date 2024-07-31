import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import RidesScreen from '../screens/RidesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileDetailsScreen from '../screens/Profile/ProfileDetailsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import HelpScreen from '../screens/Profile/HelpScreen';
import LogoutScreen from '../screens/Profile/LogoutScreen';
import PostRequestScreen from '../screens/PostRequestScreen';
import FindRideScreen from '../screens/FindRideScreen';
 
// Create the Bottom Tab Navigator
const Tab = createBottomTabNavigator();
 
// Create the Nested Stack Navigator for Profile-related screens
const ProfileStack = createNativeStackNavigator();
 
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profilet"
        component={ProfileScreen}
        options={{ headerLeft: () => null }}
      />
      <ProfileStack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="Help" component={HelpScreen} />
      <ProfileStack.Screen name="Logout" component={LogoutScreen} />
    </ProfileStack.Navigator>
  );
};
 
const HomeStack = createNativeStackNavigator();
 
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Homet"
        component={HomeScreen}
        options={{ headerLeft: () => null }}
      />
      <HomeStack.Screen name="PostRequest" component={PostRequestScreen} />
      <HomeStack.Screen name="FindRide" component={FindRideScreen} />
    </HomeStack.Navigator>
  );
};
 
// Main Navigator combining the Bottom Tab Navigator with the Profile Stack Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
 
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Rides') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
 
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8A2BE2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
        },
        tabBarLabelStyle: {
          fontFamily: 'Orbitron',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Rides" component={RidesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};
 
export default MainNavigator;
