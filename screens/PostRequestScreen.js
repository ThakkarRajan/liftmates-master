import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth, db } from '../utils/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const PostRequestScreen = ({ googleApiKey = "AIzaSyDAYE076DoS9CvYvRvFz8PYCqnZoJIB7mo" }) => {
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [seats, setSeats] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setPickupDate(date);
    hideDatePicker();
  };

  const handleSubmit = async () => {
    if (!location1 || !location2 || !pickupDate || !description || !seats) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const parsedSeats = parseInt(seats);
    if (isNaN(parsedSeats) || parsedSeats <= 0 || parsedSeats > 3) {
      Alert.alert('Error', 'Number of seats must be between 1 and 3');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to post a request');
        return;
      }

      const requestData = {
        location1,
        location2,
        pickupDate: pickupDate.toISOString(),
        description,
        seats: parsedSeats,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'requests'), requestData);
      Alert.alert('Success', 'Request posted successfully');
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
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <GooglePlacesAutocomplete
          placeholder="Departure Location"
          onPress={(data) => setLocation1(data.description)}
          query={{
            key: googleApiKey,
            language: 'en',
            components: 'country:ca',
          }}
          styles={{
            textInput: styles.input,
            container: { flex: 0, marginBottom: 15 },
            listView: { backgroundColor: 'white' },
          }}
        />
        <GooglePlacesAutocomplete
          placeholder="Destination Location"
          onPress={(data) => setLocation2(data.description)}
          query={{
            key: googleApiKey,
            language: 'en',
          }}
          styles={{
            textInput: styles.input,
            container: { flex: 0, marginBottom: 15 },
            listView: { backgroundColor: 'white' },
          }}
        />
        <Text style={styles.label}>Pickup Date and Time</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>{pickupDate.toLocaleString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Seats (max 3)"
          value={seats}
          onChangeText={setSeats}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#6c757d',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  datePickerButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ced4da',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#495057',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PostRequestScreen;