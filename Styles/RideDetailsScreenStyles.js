import { StyleSheet } from "react-native";

const RideDetailsScreenStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
    },
    mapContainer: {
      height: '40%',
      overflow: 'hidden',
      margin:10,
      borderRadius:15
    },
    map: {
      flex: 1,
    },
    detailsContainer: {
      flex: 1,
      padding: 20,
    },
    gradientCard: {
      borderRadius: 15,
      padding: 20,
      elevation: 5,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    detailText: {
      fontSize: 16,
      color: '#fff',
      marginLeft: 10,
      flex: 1,
    },
  });
  
  export default RideDetailsScreenStyles