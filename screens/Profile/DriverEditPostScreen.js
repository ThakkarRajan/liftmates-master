import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure @expo/vector-icons is installed
import { auth, db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const DriverEditPostScreen = ({ navigation }) => {
  const [rides, setRides] = useState([]);

  const fetchDriverRides = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(collection(db, 'rides'), where('driverId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const ridesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRides(ridesList);
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDriverRides();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('DriverEditPostDetails', { ride: item })}>
      <Ionicons name="car-outline" size={24} color="#333" style={styles.icon} />
      <View>
        <Text style={styles.title}>From: {item.startLocation}</Text>
        <Text style={styles.title}>To: {item.endLocation}</Text>
        <Text style={styles.title}>Departure: {new Date(item.departureTime).toLocaleString()}</Text>
        <Text style={styles.title}>Seats: {item.availableSeats}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.subHeader}>Your Rides</Text>
        <FlatList
          data={rides}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Montserrat',
    color: '#333',
  },
});

export default DriverEditPostScreen;