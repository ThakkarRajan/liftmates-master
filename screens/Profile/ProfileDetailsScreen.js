import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert, Platform, Text, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { auth, database, storage } from '../../utils/firebase';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { ref as dbRef, onValue, update } from 'firebase/database';

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
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.profileImage} />
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={24} color="white" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>{dob.toDateString()}</Text>
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
            style={[styles.button, uploading && styles.disabledButton]} 
            onPress={uploadImage} 
            disabled={uploading}
          >
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  editIconContainer: {
    position: 'absolute',
    right: -5,
    bottom: 0,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    padding: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileDetailsScreen;