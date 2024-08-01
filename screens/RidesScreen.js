import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useFocusEffect } from '@react-navigation/native';
import RideScreenStyles from '../Styles/RideScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RidesScreen = ({ navigation }) => {
  const [customerRides, setCustomerRides] = useState([]);
  const [driverRides, setDriverRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('driver');

  const fetchRides = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      
      // Fetch customer ride requests
      const customerQuery = query(collection(db, 'requests'), where('pickupDate', '>', now));
      const customerSnapshot = await getDocs(customerQuery);
      const customerRidesData = customerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'request'
      }));
      setCustomerRides(customerRidesData);

      // Fetch driver ride offers
      const driverQuery = query(collection(db, 'rides'), where('departureTime', '>', now));
      const driverSnapshot = await getDocs(driverQuery);
      const driverRidesData = driverSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'offer'
      }));
      setDriverRides(driverRidesData);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRides();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchRides();
  };

  const renderRideItem = ({ item }) => (
    <TouchableOpacity
      style={RideScreenStyles.rideItem}
      onPress={() => navigation.navigate('RideDetails', { ride: item })}
    >
      <View style={RideScreenStyles.rideHeader}>
        <Icon name={item.type === 'request' ? 'directions-car' : 'local-taxi'} size={24} color="#007bff" />
        <Text style={RideScreenStyles.rideType}>{item.type === 'request' ? 'Ride Request' : 'Ride Offer'}</Text>
      </View>
      <Text style={RideScreenStyles.rideText}>
        <Icon name="location-on" size={18} color="#28a745" /> {item.type === 'request' ? 'Departure' : 'Start'}: {item.location1 || item.startLocation}
      </Text>
      <Text style={RideScreenStyles.rideText}>
        <Icon name="location-on" size={18} color="#dc3545" /> {item.type === 'request' ? 'Destination' : 'End'}: {item.location2 || item.endLocation}
      </Text>
      <Text style={RideScreenStyles.rideText}>
        <Icon name="access-time" size={18} color="#6c757d" /> {item.type === 'request' ? 'Pickup Date' : 'Departure Time'}: 
        {new Date(item.pickupDate || item.departureTime).toLocaleString()}
      </Text>
      {item.type === 'request' && <Text style={RideScreenStyles.rideText}><Icon name="description" size={16} color="#17a2b8" /> Description: {item.description}</Text>}
      <Text style={RideScreenStyles.rideText}><Icon name="chair" size={18} color="green" /> Seats: {item.seats || item.availableSeats}</Text>
    </TouchableOpacity>
  );

  const renderDriverRideItem = ({ item }) => (
    <TouchableOpacity
      style={RideScreenStyles.rideItem}
      onPress={() => console.log("Driver Details Pressed ")}
    >
      <View style={RideScreenStyles.rideHeader}>
        <Icon name={item.type === 'request' ? 'directions-car' : 'local-taxi'} size={24} color="#007bff" />
        <Text style={RideScreenStyles.rideType}>{item.type === 'request' ? 'Ride Request' : 'Ride Offer'}</Text>
      </View>
      <Text style={RideScreenStyles.rideText}>
        <Icon name="location-on" size={18} color="#28a745" /> {item.type === 'request' ? 'Departure' : 'Start'}: {item.location1 || item.startLocation}
      </Text>
      <Text style={RideScreenStyles.rideText}>
        <Icon name="location-on" size={18} color="#dc3545" /> {item.type === 'request' ? 'Destination' : 'End'}: {item.location2 || item.endLocation}
      </Text>
      <Text style={RideScreenStyles.rideText}>
        <Icon name="access-time" size={18} color="#6c757d" /> {item.type === 'request' ? 'Pickup Date' : 'Departure Time'}: 
        {new Date(item.pickupDate || item.departureTime).toLocaleString()}
      </Text>
      {item.type === 'request' && <Text style={RideScreenStyles.rideText}><Icon name="description" size={18} color="#17a2b8" /> Description: {item.description}</Text>}
      <Text style={RideScreenStyles.rideText}><Icon name="chair" size={18} color="green" /> Seats: {item.seats || item.availableSeats}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={RideScreenStyles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={RideScreenStyles.container}>
      <View style={RideScreenStyles.tabContainer}>
        <TouchableOpacity
          style={[RideScreenStyles.tab, activeTab === 'driver' && RideScreenStyles.activeTab]}
          onPress={() => setActiveTab('driver')}
        >
          <Text style={[RideScreenStyles.tabText, activeTab === 'driver' && RideScreenStyles.activeTabText]}>
            Ride Offers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[RideScreenStyles.tab, activeTab === 'customer' && RideScreenStyles.activeTab]}
          onPress={() => setActiveTab('customer')}
        >
          <Text style={[RideScreenStyles.tabText, activeTab === 'customer' && RideScreenStyles.activeTabText]}>
            Ride Requests
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'customer' ? (
        customerRides.length === 0 ? (
          <Text style={RideScreenStyles.noRidesText}>No upcoming ride requests available.</Text>
        ) : (
          <FlatList
            data={customerRides}
            keyExtractor={item => item.id}
            renderItem={renderRideItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )
      ) : (
        driverRides.length === 0 ? (
          <Text style={RideScreenStyles.noRidesText}>No upcoming ride offers available.</Text>
        ) : (
          <FlatList
            data={driverRides}
            keyExtractor={item => item.id}
            renderItem={renderDriverRideItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )
      )}
    </View>
  );
};

export default RidesScreen;