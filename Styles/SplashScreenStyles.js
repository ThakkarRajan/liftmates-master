import { StyleSheet } from 'react-native';

const SplashScreenStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
     height:'100%',
   width:'100%'
  },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 300,
      height: 200,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 35,
      fontFamily:'Roboto',
      color: 'white'
    },
  });

  export default SplashScreenStyles