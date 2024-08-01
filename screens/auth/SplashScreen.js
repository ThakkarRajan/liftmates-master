import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, Easing, ImageBackground} from 'react-native';
import SplashScreenStyles from '../../Styles/SplashScreenStyles';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const carAnim = useRef(new Animated.Value(width)).current;
  const carScale = useRef(new Animated.Value(1)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Move car from right to center
      Animated.timing(carAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      // Enlarge car
      Animated.timing(carScale, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      // Animate text
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      navigation.replace('Auth');
    }, 3800);

    return () => clearTimeout(timeout);
  }, [carAnim, carScale, textAnim, navigation]);

  const textStyle = {
    opacity: textAnim,
    transform: [
      {
        translateY: textAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
      {
        scale: textAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  };

  return (
<ImageBackground
          source={require('../../assets/main.png')}
          style={SplashScreenStyles.backgroundImage}
          resizeMode="cover"
        >
          <View style={SplashScreenStyles.container}>
        <Animated.Image
          source={require('../../assets/logo.png')}
          style={[
            SplashScreenStyles.logo,
            {
              transform: [
                { translateX: carAnim },
                { scale: carScale }
              ],
            },
          ]}
        />
         
    <Animated.Text style={[SplashScreenStyles.title, textStyle, {backgroundColor: 'transparent'}]}>
      Welcome To LiftMates
    </Animated.Text>
    </View>
    </ImageBackground>
      
  );
};

export default SplashScreen;