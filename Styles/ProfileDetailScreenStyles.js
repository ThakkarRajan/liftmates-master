import { StyleSheet } from "react-native";

const ProfileDetailsScreenStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
      flexGrow: 1,
      padding: 24,
      justifyContent:'center'
    },
    card: {
      justifyContent:'center',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    backButton: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 1,
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 32,
      position: 'relative',  // Add this line
    },
    profileImage: {
      width: 160,
      height: 160,
      borderRadius: 80,
      borderWidth: 4,
      borderColor: '#4A90E2',
    },
    editIconContainer: {
      position: 'absolute',
      right: 85,  // Adjust this value as needed
      bottom: 1,  // Adjust this value as needed
      backgroundColor: '#4A90E2',
      borderRadius: 24,
      padding: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    inputContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
      color: '#495057',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ced4da',
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: '#495057',
      backgroundColor: '#f8f9fa',
    },
    datePickerButton: {
      borderWidth: 1,
      borderColor: '#ced4da',
      borderRadius: 12,
      padding: 16,
      backgroundColor: '#f8f9fa',
    },
    datePickerText: {
      fontSize: 16,
      color: '#495057',
    },
    button: {
      backgroundColor: '#4A90E2',
      padding: 18,
      width:'50%',
      marginLeft:'25%',
      borderRadius: 35,
      alignItems: 'center',
      marginTop: 24,
      shadowColor: "#4A90E2",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    disabledButton: {
      backgroundColor: '#a0a0a0',
      shadowOpacity: 0.1,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
  });
  
  export default ProfileDetailsScreenStyles;