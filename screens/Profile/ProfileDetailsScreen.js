import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert, Platform, Text, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { auth, database, storage } from '../../utils/firebase';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { ref as dbRef, onValue, update } from 'firebase/database';
import ProfileDetailScreenStyles from '../../Styles/ProfileDetailScreenStyles';

const ProfileDetailsScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    requestPermission();

    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = dbRef(database, `users/${currentUser.uid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setName(userData.name || '');
          setDob(new Date(userData.dob) || new Date());
          setImage(userData.photoURL || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Error', 'Failed to get media library permissions');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !image) return;

    setUploading(true);
    try {
      let localUri = image;
      let filename = localUri.split('/').pop();

      const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
      const blob = await fetch(localUri).then(r => r.blob());
      await uploadBytes(storageRef, blob);

      const photoURL = await getDownloadURL(storageRef);
      await update(dbRef(database, `users/${currentUser.uid}`), { photoURL });

      Alert.alert('Photo uploaded!', 'Your profile photo has been updated.');
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const age = calculateAge(dob);
      if (age < 18) {
        Alert.alert('Invalid Date of Birth', 'You must be at least 18 years old.');
        return;
      }

      try {
        await update(dbRef(database, `users/${currentUser.uid}`), {
          name,
          dob: dob.toISOString().split('T')[0],
        });
        Alert.alert('Profile updated!', 'Your profile has been updated successfully.');
      } catch (error) {
        Alert.alert('Update Error', error.message);
      }
    }
  };

  const calculateAge = (date) => {
    const diff = Date.now() - date.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios');
    setDob(currentDate);
  };

  return (
    <SafeAreaView style={ProfileDetailScreenStyles.safeArea}>
      <TouchableOpacity style={ProfileDetailScreenStyles.backButton} onPress={() => navigation.goBack()}>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={ProfileDetailScreenStyles.scrollContainer}>
        <View style={ProfileDetailScreenStyles.card}>
          <TouchableOpacity onPress={pickImage} style={ProfileDetailScreenStyles.imageContainer}>
            <Image source={{ uri: image }} style={ProfileDetailScreenStyles.profileImage} />
            <View style={ProfileDetailScreenStyles.editIconContainer}>
              <Ionicons name="camera" size={24} color="white" />
            </View>
          </TouchableOpacity>
          
          <View style={ProfileDetailScreenStyles.inputContainer}>
            <Text style={ProfileDetailScreenStyles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={ProfileDetailScreenStyles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={ProfileDetailScreenStyles.inputContainer}>
            <Text style={ProfileDetailScreenStyles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={ProfileDetailScreenStyles.datePickerButton}>
              <Text style={ProfileDetailScreenStyles.datePickerText}>{dob.toDateString()}</Text>
            </TouchableOpacity>
          </View>
          
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
          
          <TouchableOpacity 
            style={[ProfileDetailScreenStyles.button, uploading && ProfileDetailScreenStyles.disabledButton]} 
            onPress={uploadImage} 
            disabled={uploading}
          >
            <Text style={ProfileDetailScreenStyles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={ProfileDetailScreenStyles.button} onPress={handleUpdate}>
            <Text style={ProfileDetailScreenStyles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ProfileDetailsScreen;