import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import PostRequestScreenStyles from '../Styles/PostRequestScreenStyles';

const PostRequestScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={PostRequestScreenStyles.container}>
      <View style={PostRequestScreenStyles.content}>
        <Text style={PostRequestScreenStyles.title}>Ride Share Hub</Text>
        
        <View style={PostRequestScreenStyles.card}>
          <Text style={PostRequestScreenStyles.cardTitle}>For Passengers</Text>
          <Text style={PostRequestScreenStyles.cardSubtitle}>Need a ride?</Text>
          <TouchableOpacity 
            style={PostRequestScreenStyles.button} 
            onPress={() => navigation.navigate('CustomerPostRequest')}
          >
            <Text style={PostRequestScreenStyles.buttonText}>Post Ride Request</Text>
          </TouchableOpacity>
        </View>

        <View style={PostRequestScreenStyles.card}>
          <Text style={PostRequestScreenStyles.cardTitle}>For Drivers</Text>
          <Text style={PostRequestScreenStyles.cardSubtitle}>Offering a ride?</Text>
          <TouchableOpacity 
            style={PostRequestScreenStyles.button} 
            onPress={() => navigation.navigate('DriverPostRequest')}
          >
            <Text style={PostRequestScreenStyles.buttonText}>Post Ride Offer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PostRequestScreen;