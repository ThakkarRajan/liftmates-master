import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, FlatList } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Location from 'expo-location';
import { auth, db } from '../utils/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DriverPostRequestScreenStyles from '../Styles/DriverPostRequestScreenStyles';

import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';

const DriverPostRequestScreen = ({ navigation, googleApiKey = "AIzaSyDAYE076DoS9CvYvRvFz8PYCqnZoJIB7mo" }) => {
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');
  const [departureTime, setDepartureTime] = useState(new Date());
  const [availableSeats, setAvailableSeats] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    checkLocationPermission();
    fetchDriverRides();
  }, []);

  const checkLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  const fetchDriverRides = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'rides'), where('driverId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const ridesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRides(ridesList);
    }
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
    if (!location1 || !location2 || !departureTime || !availableSeats) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const parsedSeats = parseInt(availableSeats);
    if (isNaN(parsedSeats) || parsedSeats <= 0) {
      Alert.alert('Error', 'Please enter a valid number of seats');
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
        driverId: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'rides'), rideData);
      Alert.alert('Success', 'Ride added successfully');
      fetchDriverRides(); // Refresh the list
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
  };

  const handleEditRide = (ride) => {
    // Navigate to edit screen or show edit modal
    navigation.navigate('EditRide', { ride });
  };

  const handleDeleteRide = async (rideId) => {
    try {
      await deleteDoc(doc(db, 'rides', rideId));
      Alert.alert('Success', 'Ride deleted successfully');
      fetchDriverRides(); // Refresh the list
    } catch (error) {
      console.error('Error deleting ride:', error);
      Alert.alert('Error', 'An error occurred while deleting the ride');
    }
  };

  const renderRideItem = ({ item }) => (
    <View style={DriverPostRequestScreenStyles.rideItem}>
      <Text style={DriverPostRequestScreenStyles.rideText}>From: {item.startLocation}</Text>
      <Text style={DriverPostRequestScreenStyles.rideText}>To: {item.endLocation}</Text>
      <Text style={DriverPostRequestScreenStyles.rideText}>Departure: {new Date(item.departureTime).toLocaleString()}</Text>
      <Text style={DriverPostRequestScreenStyles.rideText}>Available Seats: {item.availableSeats}</Text>
      <View style={DriverPostRequestScreenStyles.rideItemButtons}>
        <TouchableOpacity style={DriverPostRequestScreenStyles.editButton} onPress={() => handleEditRide(item)}>
          <Icon name="edit" size={20} color="#fff" />
          <Text style={DriverPostRequestScreenStyles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={DriverPostRequestScreenStyles.deleteButton} onPress={() => handleDeleteRide(item.id)}>
          <Icon name="delete" size={20} color="#fff" />
          <Text style={DriverPostRequestScreenStyles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <TouchableOpacity style={DriverPostRequestScreenStyles.button} onPress={handleAddRide}>
          <Text style={DriverPostRequestScreenStyles.buttonText}>Add Ride</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={rides}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        style={DriverPostRequestScreenStyles.rideList}
      />
    </SafeAreaView>
  );
};

export default DriverPostRequestScreen;