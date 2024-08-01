import { StyleSheet } from "react-native";

const RidesScreenStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f9fa',
    },
    tabContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: '#e9ecef',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: '#007bff',
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#6c757d',
    },
    activeTabText: {
      color: '#007bff',
    },
    noRidesText: {
      fontSize: 18,
      color: '#6c757d',
      textAlign: 'center',
      marginTop: 20,
    },
    rideItem: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
    },
    rideHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    rideType: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#007bff',
      marginLeft: 10,
    },
    rideText: {
      fontSize: 16,
      color: '#495057',
      marginBottom: 5,
    },
    rideItemButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      marginLeft: 5,
    },
  });
  
  export default RidesScreenStyles;