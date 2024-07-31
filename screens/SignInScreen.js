import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Switch, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase'; // Ensure this path is correct
import SignInStyles from '../Styles/SignInStyles';


const CustomButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={[SignInStyles.button, style]} onPress={onPress}>
    <Text style={SignInStyles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is required');
    } else if (!password) {
      Alert.alert('Error', 'Password is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
    } 

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user data exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Add user data to Firestore
        await setDoc(userDocRef, {
          email: user.email,
          userDetails: {
            createdAt: new Date(),
            
          },
        });
      }

      navigation.replace('Main');
    } catch (error) {
      console.log(`Error:${error}`)
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={SignInStyles.backgroundImage}
      resizeMode="cover"
    >
        <ScrollView contentContainerStyle={SignInStyles.scrollViewContent}>
        <View style={SignInStyles.cardContainer}>
          <View style={SignInStyles.card}>
            <Text style={SignInStyles.title}>Welcome Back</Text>
            <View style={SignInStyles.inputView}>
              <Ionicons name="mail-outline" size={24} color="black" style={SignInStyles.icon} />
              <TextInput
                style={SignInStyles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={SignInStyles.inputView}>
              <Ionicons name="lock-closed-outline" size={24} color="black" style={SignInStyles.icon} />
              <TextInput
                style={SignInStyles.input}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={SignInStyles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={SignInStyles.rememberMeView}>
              <Text style={SignInStyles.rememberMeText}>Remember Me</Text>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: "#767577", true: "#32cf13" }}
                thumbColor={rememberMe ? "#f4f3f4" : "#f4f3f4"}
              />
            </View>
            <View style={SignInStyles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#8A2BE2" />
              ) : (
                <CustomButton title="Sign In" onPress={handleSignIn} />
              )}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={SignInStyles.signupText}>
                Don't have an account? <Text style={SignInStyles.signupLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
        </ImageBackground>
  );
};

export default SignInScreen;
