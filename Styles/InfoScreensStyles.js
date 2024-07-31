import { StyleSheet } from 'react-native';

const InfoScreensStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent:'center',
   objectFit:'cover',
   height:'100%',
   width:'100%'
  },
  container: {
    flex: 1,
   
  },
  scrollView: {
    flex: 1,
  },
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Roboto',
    marginBottom: 30,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  paginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: 'black',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 44,
    right: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    marginRight: 5,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});
  export default InfoScreensStyles