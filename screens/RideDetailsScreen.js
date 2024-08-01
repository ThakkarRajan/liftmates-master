import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getDistance } from 'geolib';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import RideDetailsScreenStyles from '../Styles/RideDetailsScreenStyles';

const { width } = Dimensions.get('window');

const RideDetails = ({ route }) => {
  const { ride } = route.params;
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [averageCost, setAverageCost] = useState(null);

  useEffect(() => {
    const calculateDetails = () => {
      const pickupLocation = ride.location1Coords;
      const destinationLocation = ride.location2Coords;

      if (
        !pickupLocation || !destinationLocation ||
        isNaN(pickupLocation.latitude) || 
        isNaN(pickupLocation.longitude) ||
        isNaN(destinationLocation.latitude) || 
        isNaN(destinationLocation.longitude)
      ) {
        console.error('Invalid location data');
        return;
      }

      const distance = getDistance(pickupLocation, destinationLocation);
      const averageSpeed = 16.67; // m/s
      const costPerKm = 1.5; // example cost per km

      const time = distance / averageSpeed / 60;
      setEstimatedTime(time.toFixed(2));

      const cost = (distance / 1000) * costPerKm;
      setAverageCost(cost.toFixed(2));
    };

    calculateDetails();
  }, [ride]);

  return (
    <View style={RideDetailsScreenStyles.container}>
      <View style={RideDetailsScreenStyles.mapContainer}>
        <MapView
          style={RideDetailsScreenStyles.map}
          initialRegion={{
            latitude: (ride.location1Coords?.latitude + ride.location2Coords?.latitude) / 2 || 0,
            longitude: (ride.location1Coords?.longitude + ride.location2Coords?.longitude) / 2 || 0,
            latitudeDelta: Math.abs(ride.location1Coords?.latitude - ride.location2Coords?.latitude) * 2 || 0.0922,
            longitudeDelta: Math.abs(ride.location1Coords?.longitude - ride.location2Coords?.longitude) * 2 || 0.0421,
          }}
        >
          {ride.location1Coords && (
            <Marker 
              coordinate={ride.location1Coords} 
              title="Pickup Location" 
            />
          )}
          {ride.location2Coords && (
            <Marker 
              coordinate={ride.location2Coords} 
              title="Destination" 
            />
          )}
          {ride.location1Coords && ride.location2Coords && (
            <Polyline
              coordinates={[
                ride.location1Coords,
                ride.location2Coords,
              ]}
              strokeColor="#007bff"
              strokeWidth={6}
            />
          )}
        </MapView>
      </View>
      <ScrollView style={RideDetailsScreenStyles.detailsContainer}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={RideDetailsScreenStyles.gradientCard}
        >
          <View style={RideDetailsScreenStyles.detailRow}>
            <MaterialIcons name="location-on" size={24} color="#fff" />
            <Text style={RideDetailsScreenStyles.detailText}>Pickup: {ride.location1}</Text>
          </View>
          <View style={RideDetailsScreenStyles.detailRow}>
            <MaterialIcons name="flag" size={24} color="#fff" />
            <Text style={RideDetailsScreenStyles.detailText}>Destination: {ride.location2}</Text>
          </View>
          <View style={RideDetailsScreenStyles.detailRow}>
            <MaterialIcons name="access-time" size={24} color="#fff" />
            <Text style={RideDetailsScreenStyles.detailText}>Pickup: {new Date(ride.pickupDate).toLocaleString()}</Text>
          </View>
          <View style={RideDetailsScreenStyles.detailRow}>
            <MaterialIcons name="description" size={24} color="#fff" />
            <Text style={RideDetailsScreenStyles.detailText}>Description: {ride.description}</Text>
          </View>
          <View style={RideDetailsScreenStyles.detailRow}>
            <MaterialIcons name="event-seat" size={24} color="#fff" />
            <Text style={RideDetailsScreenStyles.detailText}>Seats: {ride.seats}</Text>
          </View>
          {estimatedTime && (
            <View style={RideDetailsScreenStyles.detailRow}>
              <MaterialIcons name="timer" size={24} color="#fff" />
              <Text style={RideDetailsScreenStyles.detailText}>Est. Time: {estimatedTime} mins</Text>
            </View>
          )}
          {averageCost && (
            <View style={RideDetailsScreenStyles.detailRow}>
              <MaterialIcons name="attach-money" size={24} color="#fff" />
              <Text style={RideDetailsScreenStyles.detailText}>Avg. Cost: ${averageCost}</Text>
            </View>
          )}
        </LinearGradient>
      </ScrollView>
    </View>
  );
};


export default RideDetails;