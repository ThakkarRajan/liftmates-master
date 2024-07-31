import { StyleSheet, Platform } from 'react-native';


const SignInStyles = StyleSheet.create({
  
  backgroundImage: {  
    flex: 1,
    height:'100%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#606060',
    marginBottom: 30,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    color: 'black',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  rememberMeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    width: '95%',
    justifyContent: 'space-between',
  },
  rememberMeText: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#606060',
    fontWeight: '600',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '50%',
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'rgba(96, 96, 96, 0.7)',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 15,
  },
  signupText: {
    marginTop: 20,
    fontFamily: 'Montserrat',
    fontSize: 15,
    color: '#606060',
    textAlign: 'center',
  },
  signupLink: {
    color: '#404040',
    fontWeight: 'bold',
  },
});

export default SignInStyles;