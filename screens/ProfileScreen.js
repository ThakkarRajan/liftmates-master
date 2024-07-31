import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed

const ProfileScreen = ({ navigation }) => {
  const menuOptions = [
    { id: '1', title: 'Profile Details', route: 'ProfileDetails', icon: 'person-circle-outline' },
    { id: '2', title: 'Settings', route: 'Settings', icon: 'settings-outline' },
    { id: '3', title: 'Help', route: 'Help', icon: 'help-circle-outline' },
    { id: '4', title: 'Logout', route: 'Logout', icon: 'log-out-outline' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(item.route)}>
      <Ionicons name={item.icon} size={24} color="#333" style={styles.icon} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Profile</Text>
        <FlatList
          data={menuOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Montserrat',
    color: '#333',
  },
});

export default ProfileScreen;