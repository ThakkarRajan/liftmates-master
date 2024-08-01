import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, SafeAreaView, Alert, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import SignUpStyles from '../../Styles/SignUpStyles';


const CustomButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={[SignUpStyles.button, style]} onPress={onPress}>
  
      <Text style={SignUpStyles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is required');
    } else if (!password) {
      Alert.alert('Error', 'Password is required');
    } else if (!confirmPassword) {
      Alert.alert('Error', 'Confirm password is required');
    } else if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
    } 
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('SignIn');
    } catch (error) {
      console.log(`Error:${error}`)
    }
  };

  return (
    <ImageBackground
    source={require('../../assets/bg.png')} 
    style={SignUpStyles.backgroundImage}
  >
  <SafeAreaView style={SignUpStyles.overlay}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={SignUpStyles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={SignUpStyles.scrollViewContent}>
          <View style={SignUpStyles.card}>
            <Text style={SignUpStyles.title}>Create Account</Text>
            <View style={SignUpStyles.inputView}>
              <Ionicons name="mail-outline" size={24} color="black" style={SignUpStyles.icon} />
              <TextInput
                style={SignUpStyles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={SignUpStyles.inputView}>
              <Ionicons name="lock-closed-outline" size={24} color="black" style={SignUpStyles.icon} />
              <TextInput
                style={SignUpStyles.input}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={SignUpStyles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={SignUpStyles.inputView}>
              <Ionicons name="lock-closed-outline" size={24} color="black" style={SignUpStyles.icon} />
              <TextInput
                style={SignUpStyles.input}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={SignUpStyles.eyeIcon}>
                <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={SignUpStyles.buttonContainer}>
              <CustomButton title="Sign Up" onPress={handleSignUp} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={SignUpStyles.signinText}>
                Already have an account? <Text style={SignUpStyles.signinLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
  </ImageBackground>
  );
};

export default SignUpScreen;