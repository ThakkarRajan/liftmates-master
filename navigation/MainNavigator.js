// Import necessary modules
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
import RideDetailsScreen from '../screens/RideDetailsScreen';
import DriverPostRequestScreen from '../screens/DriverPostRequestScreen';
import CustomerPostRequestScreen from '../screens/CustomerPostRequestScreen';
import DriverEditPostDetailsScreen from '../screens/Profile/DriverEditPostDetailsScreen';
import DriverEditPostScreen from '../screens/Profile/DriverEditPostScreen';


// Create the Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Create the Nested Stack Navigator for Profile-related screens
const ProfileStack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile Page" 
        component={ProfileScreen} 
        options={{ headerLeft: () => null }}
      />
      <ProfileStack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="DriverEditPost" component={DriverEditPostScreen } />
      <ProfileStack.Screen name="DriverEditPostDetails" component={DriverEditPostDetailsScreen} />
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
        name="Home Page" 
        component={HomeScreen} 
        options={{ headerLeft: () => null }}
      />
      <HomeStack.Screen name="PostRequest" component={PostRequestScreen} />
      <HomeStack.Screen name="DriverPostRequest" component={DriverPostRequestScreen} />
      <HomeStack.Screen name="CustomerPostRequest" component={CustomerPostRequestScreen} />
      <HomeStack.Screen name="FindRide" component={FindRideScreen} />
    </HomeStack.Navigator>
  );
};

const RideStack = createNativeStackNavigator();

const RideStackNavigator = () => {
  return (
    <RideStack.Navigator>
      <RideStack.Screen 
        name="Rides" 
        component={RidesScreen} 
        options={{ headerLeft: () => null }}
      />
      <RideStack.Screen name="RideDetails" component={RideDetailsScreen} />
      
    </RideStack.Navigator>
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
          } else if (route.name === 'Ride') {
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
      <Tab.Screen name="Ride" component={RideStackNavigator} options={{ headerShown: false }} />

      
      <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default MainNavigator;