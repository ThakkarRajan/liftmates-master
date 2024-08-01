import { StyleSheet } from 'react-native';

const PostRequestScreenStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 30,
      color: '#333',
      textAlign: 'center',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
      alignItems: 'center',
      width: '100%',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    cardSubtitle: {
      fontSize: 16,
      marginBottom: 20,
      color: '#666',
    },
    button: {
      backgroundColor: '#007bff',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
  
  export default PostRequestScreenStyles;