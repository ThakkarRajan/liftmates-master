import { StyleSheet } from 'react-native';

const PostRequestScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    padding: 18, 
  },
  form: {
    marginTop: 10, 
  },
  label: {
    fontSize: 15, 
    marginBottom: 8, 
    color: '#6c757d',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3, 
  },
  inputContainer: {
    marginBottom: 15, 
  },
  input: {
    height: 50, 
    borderColor: '#e9ecef',
    borderWidth: 1,
    paddingHorizontal: 12, 
    borderRadius: 10, 
    backgroundColor: '#fff',
    fontSize: 15, 
    color: '#495057',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  datePickerButton: {
    height: 50, 
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e9ecef',
    borderWidth: 1,
    borderRadius: 10, 
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  datePickerButtonText: {
    fontSize: 15, 
    color: '#495057',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14, 
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 24, 
    marginTop: 15, 
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16, 
    letterSpacing: 0.5, 
  },
  descriptionInput: {
    height: 100, 
    textAlignVertical: 'top',
    paddingTop: 12, 
  },
  googlePlacesInput: {
    container: {
      flex: 0,
      marginBottom: 16, 
    },
    textInputContainer: {
      backgroundColor: 'transparent',
    },
    textInput: {
      height: 48, 
      borderColor: '#e9ecef',
      borderWidth: 1,
      paddingHorizontal: 12, 
      fontSize: 15, 
      backgroundColor: '#fff',
      borderRadius: 10, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    listView: {
      backgroundColor: '#fff',
      borderRadius: 10, 
      marginTop: 4, 
    },
    row: {
      padding: 10, 
      height: 45, 
    },
    separator: {
      height: 1,
      backgroundColor: '#e9ecef',
    },
    description: {
      fontSize: 15, 
    },
  },
});

export default PostRequestScreenStyles;