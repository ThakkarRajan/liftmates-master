
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { db } from '../utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const DriverEditPostScreen = ({ route, navigation }) => {
  const { ride } = route.params;
  const [departureTime, setDepartureTime] = useState(new Date(ride.departureTime));
  const [availableSeats, setAvailableSeats] = useState(ride.availableSeats.toString());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setDepartureTime(date);
    hideDatePicker();
  };

  const handleUpdateRide = async () => {
    const parsedSeats = parseInt(availableSeats);
    if (isNaN(parsedSeats) || parsedSeats <= 0) {
      Alert.alert('Error', 'Please enter a valid number of seats');
      return;
    }

    try {
      await updateDoc(doc(db, 'rides', ride.id), {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>From: {ride.startLocation}</Text>
        <Text style={styles.label}>To: {ride.endLocation}</Text>
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
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  // ... (include all previous styles)
  rideList: {
    marginTop: 20,
  },
  rideItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 3,
  },
  rideItemButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
});


export default DriverEditPostScreen;
