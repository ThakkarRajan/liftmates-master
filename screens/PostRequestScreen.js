import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Location from 'expo-location';
import { auth, db } from '../utils/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import PostRequestScreenStyles from '../Styles/PostRequestScreenStyles';

const PostRequestScreen = ({ googleApiKey = "AIzaSyDAYE076DoS9CvYvRvFz8PYCqnZoJIB7mo" }) => {
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [seats, setSeats] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, []);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setPickupDate(date);
    hideDatePicker();
  };

  const fetchCoordinates = async (address) => {
    if (!locationPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      return null;
    }

    try {
      let location = await Location.geocodeAsync(address);
      if (location.length > 0) {
        return {
          latitude: location[0].latitude,
          longitude: location[0].longitude
        };
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      Alert.alert('Error', 'Unable to fetch coordinates for the provided location');
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!location1 || !location2 || !pickupDate || !description || !seats) {
      Alert.alert('Error', 'Fields Cannot be Empty');
      return;
    }

    const parsedSeats = parseInt(seats);
    if (isNaN(parsedSeats) || parsedSeats <= 0 || parsedSeats > 3) {
      Alert.alert('Error', 'Number of seats must be between 1 and 3');
      return;
    }

    if (!locationPermission) {
      Alert.alert('Permission Required', 'Location permission is needed to post a request. Please grant permission in your device settings.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to post a request');
        return;
      }

      const coords1 = await fetchCoordinates(location1);
      const coords2 = await fetchCoordinates(location2);

      if (!coords1 || !coords2) {
        return; // Alert is already shown in fetchCoordinates
      }

      const requestData = {
        location1,
        location2,
        location1Coords: coords1,
        location2Coords: coords2,
        pickupDate: pickupDate.toISOString(),
        description,
        seats: parsedSeats,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'requests'), requestData);
      Alert.alert('Success', 'Request posted successfully');
      // Reset form fields
      setLocation1('');
      setLocation2('');
      setPickupDate(new Date());
      setDescription('');
      setSeats('');
    } catch (error) {
      console.error('Error posting request:', error);
      Alert.alert('Error', 'An error occurred while posting the request');
    }
  };

  return (
    <SafeAreaView style={PostRequestScreenStyles.container}>
      <ScrollView contentContainerStyle={PostRequestScreenStyles.scrollView}>
        <View style={PostRequestScreenStyles.form}>
          <View style={PostRequestScreenStyles.inputContainer}>
            <Text style={PostRequestScreenStyles.label}>Departure Location</Text>
            <GooglePlacesAutocomplete
              placeholder="Enter departure location"
              onPress={(data) => setLocation1(data.description)}
              query={{
                key: googleApiKey,
                language: 'en',
                components: 'country:ca',
              }}
              styles={{
                textInput: PostRequestScreenStyles.googlePlacesInput.textInput,
                container: PostRequestScreenStyles.googlePlacesInput.container,
                listView: PostRequestScreenStyles.googlePlacesInput.listView,
                row: PostRequestScreenStyles.googlePlacesInput.row,
                separator: PostRequestScreenStyles.googlePlacesInput.separator,
                description: PostRequestScreenStyles.googlePlacesInput.description,
              }}
            />
          </View>
          <View style={PostRequestScreenStyles.inputContainer}>
            <Text style={PostRequestScreenStyles.label}>Destination Location</Text>
            <GooglePlacesAutocomplete
              placeholder="Enter destination location"
              onPress={(data) => setLocation2(data.description)}
              query={{
                key: googleApiKey,
                language: 'en',
              }}
              styles={{
                textInput: PostRequestScreenStyles.googlePlacesInput.textInput,
                container: PostRequestScreenStyles.googlePlacesInput.container,
                listView: PostRequestScreenStyles.googlePlacesInput.listView,
                row: PostRequestScreenStyles.googlePlacesInput.row,
                separator: PostRequestScreenStyles.googlePlacesInput.separator,
                description: PostRequestScreenStyles.googlePlacesInput.description,
              }}
            />
          </View>
          <View style={PostRequestScreenStyles.inputContainer}>
            <Text style={PostRequestScreenStyles.label}>Pickup Date and Time</Text>
            <TouchableOpacity onPress={showDatePicker} style={PostRequestScreenStyles.datePickerButton}>
              <Text style={PostRequestScreenStyles.datePickerButtonText}>{pickupDate.toLocaleString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View style={PostRequestScreenStyles.inputContainer}>
            <Text style={PostRequestScreenStyles.label}>Description</Text>
            <TextInput
              style={[PostRequestScreenStyles.input, PostRequestScreenStyles.descriptionInput]}
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
          <View style={PostRequestScreenStyles.inputContainer}>
            <Text style={PostRequestScreenStyles.label}>Number of Seats (max 3)</Text>
            <TextInput
              style={PostRequestScreenStyles.input}
              placeholder="Enter number of seats"
              value={seats}
              onChangeText={setSeats}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={PostRequestScreenStyles.button} onPress={handleSubmit}>
            <Text style={PostRequestScreenStyles.buttonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostRequestScreen;