import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { auth, db } from '../../utils/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import * as Location from 'expo-location';

const DriverEditPostDetailsScreen = ({ route, navigation }) => {
  const ride = route.params?.ride;

  if (!ride) {
    return <Text>No ride data available</Text>;
  }

  const [startLocation, setStartLocation] = useState(ride.startLocation);
  const [endLocation, setEndLocation] = useState(ride.endLocation);
  const [departureTime, setDepartureTime] = useState(new Date(ride.departureTime));
  const [availableSeats, setAvailableSeats] = useState(ride.availableSeats.toString());
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
          longitude: location[0].longitude,
        };
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      Alert.alert('Error', 'Unable to fetch coordinates for the provided location');
      return null;
    }
  };

  const handleUpdateRide = async () => {
    const parsedSeats = parseInt(availableSeats);
    if (isNaN(parsedSeats) || parsedSeats <= 0) {
      Alert.alert('Error', 'Please enter a valid number of seats');
      return;
    }

    try {
      const startCoords = await fetchCoordinates(startLocation);
      const endCoords = await fetchCoordinates(endLocation);

      if (!startCoords || !endCoords) {
        return;
      }

      await updateDoc(doc(db, 'rides', ride.id), {
        startLocation,
        endLocation,
        startCoords,
        endCoords,
        departureTime: departureTime.toISOString(),
        availableSeats: parsedSeats,
      });
      Alert.alert('Success', 'Ride updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating ride:', error);
      Alert.alert('Error', 'An error occurred while updating the ride');
    }
  };

  const handleDeleteRide = async () => {
    try {
      await deleteDoc(doc(db, 'rides', ride.id));
      Alert.alert('Success', 'Ride deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting ride:', error);
      Alert.alert('Error', 'An error occurred while deleting the ride');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>From:</Text>
        <GooglePlacesAutocomplete
          placeholder="Start Location"
          onPress={(data) => setStartLocation(data.description)}
          query={{ key: 'AIzaSyDAYE076DoS9CvYvRvFz8PYCqnZoJIB7mo', language: 'en' }}
          styles={{
            textInput: styles.input,
            container: { flex: 0, marginBottom: 15 },
            listView: { backgroundColor: 'white' },
          }}
          defaultValue={startLocation}
        />
        <Text style={styles.label}>To:</Text>
        <GooglePlacesAutocomplete
          placeholder="End Location"
          onPress={(data) => setEndLocation(data.description)}
          query={{ key: 'AIzaSyDAYE076DoS9CvYvRvFz8PYCqnZoJIB7mo', language: 'en' }}
          styles={{
            textInput: styles.input,
            container: { flex: 0, marginBottom: 15 },
            listView: { backgroundColor: 'white' },
          }}
          defaultValue={endLocation}
        />
        <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>{departureTime.toLocaleString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <TextInput
          style={styles.input}
          placeholder="Available Seats"
          value={availableSeats}
          onChangeText={setAvailableSeats}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateRide}>
          <Text style={styles.buttonText}>Update Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteRide}>
          <Text style={styles.buttonText}>Delete Ride</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 16,
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  datePickerButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DriverEditPostDetailsScreen;
