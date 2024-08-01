import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreenStyles from '../../Styles/HomeScreenStyles';
import { useNavigation } from '@react-navigation/native'; 

const HomeScreen = () => {
  const navigation = useNavigation(); 

  return (
    
      <SafeAreaView style={HomeScreenStyles.container}>
      <View style={HomeScreenStyles.overlay} />
        <View style={HomeScreenStyles.header}>
          <View style={HomeScreenStyles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer( "Profile" )}
              style={HomeScreenStyles.drawerIcon}
            >
              <Ionicons name="menu" size={30} color="#333" />
            </TouchableOpacity>
            <Text style={HomeScreenStyles.logo}>LiftMates</Text>
          </View>
        </View>
        
        <View style={HomeScreenStyles.content}>
          <Text style={HomeScreenStyles.contentTitle}>Welcome Back</Text>
          <Text style={HomeScreenStyles.contentText}>Discover, Share, and Connect through Rides</Text>
          
          <View style={HomeScreenStyles.actionContainer}>
            <TouchableOpacity style={HomeScreenStyles.actionButton} onPress={() => navigation.navigate('FindRide')}>
              <Ionicons name="search" size={20} color="white" />
              <Text style={HomeScreenStyles.actionButtonText}>Find Ride</Text>
            </TouchableOpacity>
            <TouchableOpacity style={HomeScreenStyles.actionButton} onPress={() => navigation.navigate('PostRequest')}>
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={HomeScreenStyles.actionButtonText}>Post Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      
    
  );
};

export default HomeScreen;