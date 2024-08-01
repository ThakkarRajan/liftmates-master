import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Location from 'expo-location';
import { auth, db } from '../utils/firebase';
import DriverPostRequestScreenStyles from '../Styles/DriverPostRequestScreenStyles';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DriverPostRequestScreen = ({ googleApiKey = "AIzaSyDAYE076DoS9CvYvRvFz8PYCqnZoJIB7mo" }) => {
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');
  const [departureTime, setDepartureTime] = useState(new Date());
  const [availableSeats, setAvailableSeats] = useState('');
  const [farePrice, setFarePrice] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setDepartureTime(date);
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

  const handleAddRide = async () => {
    if (!location1 || !location2 || !departureTime || !availableSeats || !farePrice) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const parsedSeats = parseInt(availableSeats);
    const parsedFare = parseFloat(farePrice);
    if (isNaN(parsedSeats) || parsedSeats <= 0 || isNaN(parsedFare) || parsedFare <= 0) {
      Alert.alert('Error', 'Please enter valid numbers for seats and fare price');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to add a ride');
        return;
      }

      const coords1 = await fetchCoordinates(location1);
      const coords2 = await fetchCoordinates(location2);

      if (!coords1 || !coords2) {
        return;
      }

      const rideData = {
        startLocation: location1,
        endLocation: location2,
        startCoords: coords1,
        endCoords: coords2,
        departureTime: departureTime.toISOString(),
        availableSeats: parsedSeats,
        farePrice: parsedFare,
        driverId: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'rides'), rideData);
      Alert.alert('Success', 'Ride added successfully');
      
      resetForm();
    } catch (error) {
      console.error('Error adding ride:', error);
      Alert.alert('Error', 'An error occurred while adding the ride');
    }
  };

  const resetForm = () => {
    setLocation1('');
    setLocation2('');
    setDepartureTime(new Date());
    setAvailableSeats('');
    setFarePrice('');
  };

  return (
    <SafeAreaView style={DriverPostRequestScreenStyles.container}>
      <View style={DriverPostRequestScreenStyles.form}>
        <Text style={DriverPostRequestScreenStyles.label}>Start Location</Text>
        <GooglePlacesAutocomplete
          placeholder="Start Location"
          onPress={(data) => setLocation1(data.description)}
          query={{ key: googleApiKey, language: 'en' }}
          styles={{
            textInput: DriverPostRequestScreenStyles.input,
            container: { flex: 0, marginBottom: 15 },
            listView: { backgroundColor: 'white' },
          }}
        />
        <Text style={DriverPostRequestScreenStyles.label}>End Location</Text>
        <GooglePlacesAutocomplete
          placeholder="End Location"
          onPress={(data) => setLocation2(data.description)}
          query={{ key: googleApiKey, language: 'en' }}
          styles={{
            textInput: DriverPostRequestScreenStyles.input,
            container: { flex: 0, marginBottom: 15 },
            listView: { backgroundColor: 'white' },
          }}
        />
        <Text style={DriverPostRequestScreenStyles.label}>Departure Date and Time</Text>
        <TouchableOpacity onPress={showDatePicker} style={DriverPostRequestScreenStyles.datePickerButton}>
          <Text style={DriverPostRequestScreenStyles.datePickerButtonText}>{departureTime.toLocaleString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          textColor="black"
        />
        <Text style={DriverPostRequestScreenStyles.label}>Available Seats</Text>
        <TextInput
          style={DriverPostRequestScreenStyles.input}
          placeholder="Available Seats"
          value={availableSeats}
          onChangeText={setAvailableSeats}
          keyboardType="numeric"
        />
        <Text style={DriverPostRequestScreenStyles.label}>Fare Price</Text>
        <TextInput
          style={DriverPostRequestScreenStyles.input}
          placeholder="Fare Price"
          value={farePrice}
          onChangeText={setFarePrice}
          keyboardType="numeric"
        />
        <TouchableOpacity style={DriverPostRequestScreenStyles.button} onPress={handleAddRide}>
          <Text style={DriverPostRequestScreenStyles.buttonText}>Add Ride</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DriverPostRequestScreen;
