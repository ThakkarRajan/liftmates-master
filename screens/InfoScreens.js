import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Animated, ScrollView, ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import InfoScreensStyles from '../Styles/InfoScreensStyles';

const { width } = Dimensions.get('window');

const PaginationDots = ({ currentIndex }) => {
  return (
    <View style={InfoScreensStyles.paginationDots}>
      {[0, 1, 2].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            InfoScreensStyles.dot,
            { opacity: currentIndex === index ? 1 : 0.3 },
          ]}
        />
      ))}
    </View>
  );
};

const InfoScreens = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const handleGetStarted = () => {
    navigation.navigate('Auth', { screen: 'SignIn' });
  };
  return (
    <View style={InfoScreensStyles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
        style={InfoScreensStyles.scrollView}
      >
        <ImageBackground
      source={require('../assets/info1.png')} // Replace with your image path
      style={InfoScreensStyles.backgroundImage}
    >
        <View style={[InfoScreensStyles.screen, { width }]}>
        
          <Text style={InfoScreensStyles.title}>Welcome to Our App</Text>
          <Text style={InfoScreensStyles.text}>Discover new features and functionalities.</Text>
        </View>
        </ImageBackground>
        <ImageBackground
      source={require('../assets/info2.png')} // Replace with your image path
      style={InfoScreensStyles.backgroundImage}
    >
        <View style={[InfoScreensStyles.screen, { width }]}>
          <Text style={InfoScreensStyles.title}>Stay Connected</Text>
          <Text style={InfoScreensStyles.text}>Keep in touch with your friends and family.</Text>
        </View>
        </ImageBackground>

        <ImageBackground
      source={require('../assets/info3.png')} // Replace with your image path
      style={InfoScreensStyles.backgroundImage}
    >
        <View style={[InfoScreensStyles.screen, { width }]}>
          <Text style={InfoScreensStyles.title}>Get Started</Text>
          <Text style={InfoScreensStyles.text}>Let's get you set up and ready to go.</Text>
        </View>
        </ImageBackground>
      </ScrollView>
      <View style={InfoScreensStyles.footer}>
        <PaginationDots currentIndex={currentIndex} />
      </View>
      
      {currentIndex === 2 && (
        <TouchableOpacity
          style={InfoScreensStyles.button}
          onPress={handleGetStarted}
        >
          <Text style={InfoScreensStyles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="black" style={InfoScreensStyles.buttonIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};



export default InfoScreens;